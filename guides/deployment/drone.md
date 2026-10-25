# Build and publish the homepage with Drone

The root `.drone.yml` builds the Angular library and homepage inside a multistage Docker image, then publishes the static homepage in an unprivileged Nginx image. A Kaniko step performs the build and registry push without a Docker socket or a privileged Drone repository. The pipeline runs only for pushes to `master`.

## Configure the private registry

Create these repository secrets in Drone before pushing the pipeline:

| Secret | Example | Purpose |
| --- | --- | --- |
| `registry_host` | `registry.example.com:5000` | Registry address used for authentication. For Docker Hub, use `https://index.docker.io/v1/`. |
| `registry_image` | `registry.example.com:5000/cloudfrogger/goodui-homepage` | Image repository without a tag. For Docker Hub, use `cloudfrogger/goodui-homepage`. |
| `registry_username` | A dedicated CI account | Account with push access to this image only. |
| `registry_password` | A registry token | Password or scoped token for that account. |

Use a TLS-enabled registry trusted by the Drone runner. For a self-hosted registry, the host portion of `registry_image` must equal `registry_host`. Docker Hub is the exception: the Kaniko plugin authenticates against `https://index.docker.io/v1/` and publishes a repository such as `cloudfrogger/goodui-homepage`. Keep credentials in Drone secrets, never in YAML, build arguments, or the Git repository. Scope the secrets to push events if your Drone installation supports event restrictions. Protect `master` in the source repository, since code on that branch controls the image build. Kaniko publishes both `:latest` and an immutable `:<full commit SHA>` tag. Deploy by SHA when a stable rollback target matters.

The pipeline publishes an image; it does not update a running service. To build the same image locally without publishing:

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
