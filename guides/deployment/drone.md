# Build and publish the homepage with Drone

The root `.drone.yml` builds the Angular library and homepage inside a multistage Docker image, then publishes the static homepage in an unprivileged Nginx image. A Kaniko step performs the build and registry push without a Docker socket or a privileged Drone repository. On a push to `master`, a second step updates one existing Kubernetes Deployment after the image push succeeds. After a successful deployment on a push to `master`, Drone builds the Angular package and publishes `@cloudfrogger/goodui` to npm. Pipeline runs are serialized to keep deployments and npm releases in order. A custom Drone run builds and publishes the image.

## Configure the private registry

Create these repository secrets in Drone before pushing the pipeline:

| Secret | Example | Purpose |
| --- | --- | --- |
| `registry_host` | `registry.example.com:5000` | Registry address used for authentication. For Docker Hub, use `https://index.docker.io/v1/`. |
| `registry_image` | `registry.example.com:5000/cloudfrogger/goodui-homepage` | Image repository without a tag. For Docker Hub, use `cloudfrogger/goodui-homepage`. |
| `registry_username` | A dedicated CI account | Account with push access to this image only. |
| `registry_password` | A registry token | Password or scoped token for that account. |

Use a TLS-enabled registry trusted by the Drone runner. For a self-hosted registry, the host portion of `registry_image` must equal `registry_host`. Docker Hub is the exception: the Kaniko plugin authenticates against `https://index.docker.io/v1/` and publishes a repository such as `cloudfrogger/goodui-homepage`. Keep credentials in Drone secrets, never in YAML, build arguments, or the Git repository. Registry secrets must be available for push and custom builds; restrict Kubernetes secrets to push events if your Drone installation supports event restrictions. Protect `master` in the source repository, since code on that branch controls the image build. Kaniko publishes both `:latest` and a `:<full commit SHA>` tag. Enable tag immutability in the registry if available.

## Configure the Kubernetes rollout

Create these additional Drone repository secrets. The deployment step receives them only at runtime; no cluster credentials or manifests are committed:

| Secret | Value |
| --- | --- |
| `k8s_api_server` | Bare HTTPS origin of the Kubernetes API, such as `https://kubernetes.example.com:6443` |
| `k8s_ca_pem_b64` | Single-line base64-encoded PEM CA certificate used to verify that API server |
| `k8s_token` | Token for a dedicated, namespace-scoped ServiceAccount |
| `k8s_namespace` | Namespace containing the existing homepage Deployment |
| `k8s_deployment` | Name of that existing Deployment |

The ServiceAccount needs only `get` and `patch` on the named Deployment. For example, an administrator can bind it to a Role with this rule in the target namespace:

```yaml
rules:
  - apiGroups: ["apps"]
    resources: ["deployments"]
    resourceNames: ["goodui"]
    verbs: ["get", "patch"]
```

Replace `goodui` with `k8s_deployment` when creating the Role. No cluster-wide role, pod access, `create`, `delete`, or `scale` permission is needed. Rotate the ServiceAccount token using your normal secret-management process. The existing Deployment must already have the appropriate image pull credentials, readiness probe, and rolling-update strategy; this pipeline does not create or change them.

`k8s_token` is the raw bearer token for that dedicated ServiceAccount, not a kubeconfig or a base64 value. For an initial test, an administrator can request one with `kubectl -n <namespace> create token goodui-deployer --duration=24h` and enter the returned string as the Drone secret. The API server may grant a different lifetime; check its expiry and arrange rotation before relying on unattended deployments. Do not use a personal or cluster-admin token, and do not commit the token. Long-lived ServiceAccount token Secrets are discouraged by Kubernetes.

The deploy step first runs its safety tests, then reads the named Deployment. It selects the sole application container automatically and refuses to guess if the Deployment has more than one. It also refuses a different image repository, a paused or `Recreate` Deployment, or a Deployment scaled to zero. It patches only that container image to the `${DRONE_COMMIT_SHA}` tag, conditioned on the Deployment's resource version, and checks readiness for up to five minutes. A concurrent change causes a conflict instead of overwriting it. A failed rollout fails the Drone step but does not delete resources or automatically roll back; inspect the Deployment and choose a rollback explicitly. The deployment step runs only after Kaniko has published the image successfully.

To build the same image locally without publishing or deploying:

```sh
docker build -f deploy/Dockerfile -t goodui-homepage:local .
docker run --rm --read-only \
  --cap-drop ALL --security-opt no-new-privileges \
  -p 127.0.0.1:8080:8080 goodui-homepage:local
```

Visit `http://127.0.0.1:8080/`. The image listens on IPv4 port 8080 and includes a `/healthz` probe. The IPv4-only listener lets `nginx -t` run in Kaniko environments without IPv6 support; an ingress or reverse proxy may still expose the site over IPv6. Nginx stores its PID and temporary files in the container's writable `/dev/shm`, so it can run as UID 101 with a read-only root filesystem even when `/tmp` is not writable. Keep `/dev/shm` writable in the deployment. Nginx logs to container stdout/stderr. TLS termination, the public hostname, and port exposure belong to the deployment or reverse proxy configuration.

The builder, runtime, and Kaniko images are pinned by digest for repeatable builds. Update those digests deliberately when applying upstream security updates, then rebuild and test the image.

## Cloudflare request headers

The host or ingress controls which clients may reach this container. GoodUI's Nginx configuration does not filter Cloudflare IP ranges or rewrite the client address. Cloudflare request headers such as `CF-Connecting-IP`, `CF-Ray`, and `CF-IPCountry` remain available as Nginx `$http_*` variables. The access log records `CF-Connecting-IP` and `CF-Ray` separately from `$remote_addr`, which remains the direct peer address.

If an ingress sits between Cloudflare and this container, configure it to pass the Cloudflare request headers through unchanged. This Nginx image serves static Angular files; it has no `proxy_pass` upstream to forward headers to. Request headers are not copied into browser response headers. Nginx serves Angular routes via `index.html`, returns 404 for missing assets and hidden files, disables source-map delivery, applies security response headers, avoids caching the application shell, and caches hashed JS/CSS assets for one year. Set HTTPS and HSTS policy at Cloudflare or the TLS-terminating proxy.

The production Angular build disables critical CSS inlining. This keeps Angular from adding an inline `onload` handler to the stylesheet link, which the image's `script-src 'self'` policy blocks. The stylesheet remains minified and loads as a regular blocking CSS file. Keep this build setting aligned with the CSP when changing the homepage build.

## Publish the Angular package to npm

Create a Drone repository secret named `npm_token` with a granular npm access token that has publish permission for `@cloudfrogger/goodui` and bypass 2FA enabled for unattended publishing. The npm account must own the `cloudfrogger` scope or have permission to publish there. Configure token expiry and rotation in your npm account. See [npm's CI token documentation](https://docs.npmjs.com/using-private-packages-in-a-ci-cd-workflow/).

The `build-npm-package` step installs dependencies and builds the Angular package without the publishing token. The following `publish-npm-package` step receives that token and publishes only on push events for `master`, after all preceding steps succeed. A temporary npm configuration reads the token from the environment and is removed afterward.

Each publication uses the source package's major and minor numbers and the Drone build number as its patch number. For example, source version `0.0.1` and build 42 produce `0.0.42`. The published package records the commit SHA in `gitHead`. Its bundled AI catalog, reference manifest, and source package identity receive the same version; the reference manifest also records that commit. The build checks every catalog reference against the bundled files and compiles the agent examples before publication. Retrying the same build skips a version already published for the same commit. A version belonging to another commit fails the step. The source version and built manifest are preserved after the command completes.

Consumers install the public package with `npm install @cloudfrogger/goodui` and import its stylesheet from `@cloudfrogger/goodui/styles.css`. This replaces the earlier local package name `@goodui/angular`; update existing TypeScript and stylesheet imports when migrating.

To inspect the publication without uploading a package, build the library and run the script with `--dry-run`, setting `DRONE_BUILD_NUMBER` to a positive integer and `DRONE_COMMIT_SHA` to a full commit SHA.
