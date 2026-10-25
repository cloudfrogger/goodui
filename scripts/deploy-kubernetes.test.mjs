import test from 'node:test';
import assert from 'node:assert/strict';
import { configuration, deploy } from './deploy-kubernetes.mjs';

const image = 'cloudfrogger/goodui:0123456789abcdef0123456789abcdef01234567';
const config = {
  namespace: 'goodui', deployment: 'goodui',
  repository: 'cloudfrogger/goodui', image,
};

const deployment = (currentImage, generation = 1, status = {}, extraContainers = []) => ({
  metadata: { generation, resourceVersion: String(generation) },
  spec: {
    replicas: 1,
    strategy: { type: 'RollingUpdate' },
    template: { spec: { containers: [{ name: 'homepage', image: currentImage }, ...extraContainers] } },
  },
  status,
});

test('configuration requires verified HTTPS and an untagged image repository', () => {
  const env = {
    K8S_NAMESPACE: 'goodui', K8S_DEPLOYMENT: 'goodui',
    REGISTRY_IMAGE: 'cloudfrogger/goodui', DRONE_COMMIT_SHA: image.split(':')[1],
    K8S_API_SERVER: 'https://kubernetes.example.com:6443', K8S_TOKEN: 'test-token',
    K8S_CA_PEM_B64: Buffer.from('-----BEGIN CERTIFICATE-----\ntest\n-----END CERTIFICATE-----').toString('base64'),
  };
  assert.equal(configuration(env).image, image);
  assert.throws(() => configuration({ ...env, K8S_API_SERVER: 'http://kubernetes.example.com' }), /HTTPS/);
  assert.throws(() => configuration({ ...env, REGISTRY_IMAGE: 'cloudfrogger/goodui:latest' }), /without a tag/);
  assert.throws(() => configuration({ ...env, K8S_DEPLOYMENT: '*' }), /Invalid k8s_deployment/);
});

test('deployment refuses a different repository before making a patch', async () => {
  const calls = [];
  const request = async (_config, method) => {
    calls.push(method);
    return deployment('another/app:latest');
  };
  await assert.rejects(deploy(config, request), /another image repository/);
  assert.deepEqual(calls, ['GET']);
});

test('deployment refuses to guess when it has multiple application containers', async () => {
  const calls = [];
  const request = async (_config, method) => {
    calls.push(method);
    return deployment('cloudfrogger/goodui:latest', 1, {}, [{ name: 'sidecar', image: 'example/sidecar:1' }]);
  };
  await assert.rejects(deploy(config, request), /exactly one application container/);
  assert.deepEqual(calls, ['GET']);
});

test('deployment patches only the named container and waits for new replicas', async () => {
  const calls = [];
  const request = async (_config, method, path, payload) => {
    calls.push({ method, path, payload });
    if (calls.length === 1) return deployment('cloudfrogger/goodui:latest');
    if (calls.length === 2) return deployment(image, 2, { observedGeneration: 1 });
    return deployment(image, 2, { observedGeneration: 2, replicas: 1, updatedReplicas: 1, readyReplicas: 1, availableReplicas: 1 });
  };
  await deploy(config, request, async () => {});
  assert.deepEqual(calls.map(item => item.method), ['GET', 'PATCH', 'GET']);
  assert.equal(calls[1].path, '/apis/apps/v1/namespaces/goodui/deployments/goodui');
  assert.deepEqual(calls[1].payload, {
    metadata: { resourceVersion: '1' },
    spec: { template: { spec: { containers: [{ name: 'homepage', image }] } } },
  });
});

test('deployment fails if another rollout replaces the selected image', async () => {
  let count = 0;
  const request = async () => {
    count++;
    if (count === 1) return deployment('cloudfrogger/goodui:latest');
    if (count === 2) return deployment(image, 2, { observedGeneration: 1 });
    return deployment('cloudfrogger/goodui:other', 3);
  };
  await assert.rejects(deploy(config, request, async () => {}), /Another rollout/);
});
