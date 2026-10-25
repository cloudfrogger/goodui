import { request as httpsRequest } from 'node:https';
import { fileURLToPath } from 'node:url';

const required = (value, name) => {
  if (!value) throw new Error(`Missing ${name} Drone secret.`);
  return value;
};

const dnsName = (value, name) => {
  required(value, name);
  if (value.length > 253 || !/^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/.test(value)) {
    throw new Error(`Invalid ${name}.`);
  }
  return value;
};

const imageRepository = (image) => {
  const withoutDigest = image.split('@')[0];
  const lastSlash = withoutDigest.lastIndexOf('/');
  const lastColon = withoutDigest.lastIndexOf(':');
  return lastColon > lastSlash ? withoutDigest.slice(0, lastColon) : withoutDigest;
};

const canonicalRepository = (image) => imageRepository(image).replace(/^(?:docker\.io\/|index\.docker\.io\/)/, '');

export function configuration(env) {
  const namespace = dnsName(env.K8S_NAMESPACE, 'k8s_namespace');
  const deployment = dnsName(env.K8S_DEPLOYMENT, 'k8s_deployment');
  const repository = required(env.REGISTRY_IMAGE, 'registry_image');
  const sha = required(env.DRONE_COMMIT_SHA, 'DRONE_COMMIT_SHA');
  if (!/^[a-z0-9][a-z0-9._:/-]*[a-z0-9]$/.test(repository) || repository.includes('@') ||
      /:[^/]+$/.test(repository.split('/').at(-1)) || !/^[0-9a-f]{40}$/.test(sha)) {
    throw new Error('Invalid registry_image or commit SHA. Use an image repository without a tag.');
  }

  const server = new URL(required(env.K8S_API_SERVER, 'k8s_api_server'));
  if (server.protocol !== 'https:' || server.pathname !== '/' || server.search || server.hash || server.username || server.password) {
    throw new Error('k8s_api_server must be a bare HTTPS origin.');
  }
  const token = required(env.K8S_TOKEN, 'k8s_token');
  const encodedCa = required(env.K8S_CA_PEM_B64, 'k8s_ca_pem_b64');
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(encodedCa) || encodedCa.length % 4 !== 0) {
    throw new Error('k8s_ca_pem_b64 must be base64-encoded PEM.');
  }
  const ca = Buffer.from(encodedCa, 'base64').toString('utf8');
  if (!ca.includes('-----BEGIN CERTIFICATE-----')) throw new Error('k8s_ca_pem_b64 does not contain a PEM certificate.');

  return { namespace, deployment, repository, image: `${repository}:${sha}`, server, token, ca };
}

export function kubernetesRequest({ server, token, ca }, method, path, payload) {
  const body = payload === undefined ? undefined : JSON.stringify(payload);
  return new Promise((resolve, reject) => {
    const req = httpsRequest(new URL(path, server), {
      method,
      ca,
      timeout: 10000,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        ...(body === undefined ? {} : { 'Content-Type': 'application/strategic-merge-patch+json', 'Content-Length': Buffer.byteLength(body) }),
      },
    }, (res) => {
      const chunks = [];
      let size = 0;
      res.on('data', (chunk) => {
        size += chunk.length;
        if (size > 2 * 1024 * 1024) req.destroy(new Error('Kubernetes response exceeded 2 MiB.'));
        else chunks.push(chunk);
      });
      res.on('end', () => {
        let data;
        try { data = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
        catch { return reject(new Error(`Kubernetes returned invalid JSON (HTTP ${res.statusCode}).`)); }
        if (res.statusCode < 200 || res.statusCode >= 300) {
          return reject(new Error(`Kubernetes ${method} failed (HTTP ${res.statusCode}, ${data.reason || 'unknown reason'}).`));
        }
        resolve(data);
      });
    });
    req.on('timeout', () => req.destroy(new Error('Kubernetes API request timed out.')));
    req.on('error', reject);
    req.end(body);
  });
}

export async function deploy(config, request = kubernetesRequest, sleep = ms => new Promise(resolve => setTimeout(resolve, ms))) {
  const path = `/apis/apps/v1/namespaces/${encodeURIComponent(config.namespace)}/deployments/${encodeURIComponent(config.deployment)}`;
  let current = await request(config, 'GET', path);
  if (current.spec?.paused) throw new Error('Deployment is paused; no image change was made.');
  if (current.spec?.strategy?.type === 'Recreate') throw new Error('Deployment uses Recreate; no image change was made.');
  const replicas = current.spec?.replicas ?? 1;
  if (!Number.isInteger(replicas) || replicas < 1) throw new Error('Deployment has no desired replicas; no image change was made.');
  const containers = current.spec?.template?.spec?.containers;
  if (!Array.isArray(containers) || containers.length !== 1) {
    throw new Error('Deployment must have exactly one application container; no image change was made.');
  }
  const target = containers[0];
  const container = target.name;
  if (!container) throw new Error('Application container has no name; no image change was made.');
  if (canonicalRepository(target.image) !== canonicalRepository(config.repository)) {
    throw new Error('Existing container uses another image repository; no image change was made.');
  }
  if (!current.metadata?.resourceVersion) throw new Error('Deployment has no resource version; no image change was made.');

  if (target.image !== config.image) {
    current = await request(config, 'PATCH', path, {
      metadata: { resourceVersion: current.metadata.resourceVersion },
      spec: { template: { spec: { containers: [{ name: container, image: config.image }] } } },
    });
    console.log(`Updated ${config.namespace}/${config.deployment} container ${container} to ${config.image}.`);
  } else {
    console.log(`Image ${config.image} is already configured; checking readiness.`);
  }

  const generation = current.metadata?.generation;
  if (!Number.isInteger(generation)) throw new Error('Kubernetes response has no Deployment generation.');
  for (let attempt = 0; attempt <= 60; attempt++) {
    if (attempt > 0) current = await request(config, 'GET', path);
    if (current.spec?.template?.spec?.containers?.find(item => item.name === container)?.image !== config.image) {
      throw new Error('Another rollout changed the container image while deployment was being checked.');
    }
    const status = current.status ?? {};
    const desired = current.spec?.replicas ?? 1;
    const failed = status.conditions?.find(item => item.type === 'Progressing' && item.reason === 'ProgressDeadlineExceeded');
    if (failed) throw new Error('Deployment exceeded its progress deadline.');
    if (status.observedGeneration >= generation && status.updatedReplicas === desired &&
        status.replicas === desired && status.readyReplicas === desired && status.availableReplicas === desired) {
      console.log(`Deployment ${config.namespace}/${config.deployment} is ready (${desired}/${desired}).`);
      return;
    }
    if (attempt === 60) break;
    await sleep(5000);
  }
  throw new Error('Deployment did not become ready within five minutes. The new image remains set for inspection or manual rollback.');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try { await deploy(configuration(process.env)); }
  catch (error) { console.error(`Deployment failed: ${error.message}`); process.exitCode = 1; }
}
