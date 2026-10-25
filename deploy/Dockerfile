FROM node:22-bookworm-slim@sha256:de170b39439eb0e5a3444ad7d60b015614a381e10fecae2e30ec9e735122f38d AS build

ENV CI=true
WORKDIR /workspace

COPY angular/package.json angular/package-lock.json angular/
RUN npm --prefix angular ci --legacy-peer-deps --no-audit --no-fund

COPY package.json LICENSE ./
COPY angular/ angular/
COPY homepage/ homepage/
COPY scripts/ scripts/
COPY design-tokens/ design-tokens/
COPY assets/brand/ assets/brand/
RUN npm run build:lib \
    && npm --prefix homepage ci --legacy-peer-deps --no-audit --no-fund \
    && npm run brand:sync \
    && npm run link:homepage \
    && npm --prefix homepage run build

FROM nginx/nginx-unprivileged:stable-alpine@sha256:517607ae849a46afbd400616a783e4ead0290f52d20ccc0618ccea1a49362474

COPY deploy/nginx.conf /etc/nginx/nginx.conf
COPY deploy/security-headers.conf /etc/nginx/security-headers.conf
COPY --from=build /workspace/homepage/dist/homepage/browser/ /usr/share/nginx/html/
RUN nginx -t

USER 101
EXPOSE 8080
ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
