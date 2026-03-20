# kinto

## Production image flow

## Local API env

Create a local `.env` from `.env.example` and fill in your Google Sheets / DigitalOcean Spaces values:

```powershell
Copy-Item .env.example .env
```

Run the frontend and API locally in separate terminals:

```powershell
npm run dev
```

```powershell
npm run server
```

The API reads these values from `.env`:

```text
GOOGLE_APPLICATION_CREDENTIALS=./credentials.json
GOOGLE_SHEETS_SPREADSHEET_ID=...
SPACES_REGION=sgp1
SPACES_BUCKET=...
SPACES_ENDPOINT=https://sgp1.digitaloceanspaces.com
SPACES_KEY=...
SPACES_SECRET=...
SPACES_CDN_BASE_URL=https://your-space-name.sgp1.digitaloceanspaces.com
```

Build and push the production image from your local machine:

```powershell
$env:REGISTRY="ghcr.io/kimkundad"
$env:IMAGE_TAG="2026-03-20-01"
$apiImage="$env:REGISTRY/kinto-api:$env:IMAGE_TAG"
$nginxImage="$env:REGISTRY/kinto-nginx:$env:IMAGE_TAG"
docker build -f Dockerfile.prod --target api-runtime -t $apiImage .
docker build -f Dockerfile.prod --target nginx-runtime -t $nginxImage .
docker push $apiImage
docker push $nginxImage
```

Or use the helper script:

```powershell
.\deploy\build-and-push-ghcr.ps1 -ImageTag 2026-03-20-01
```

On the server:

```bash
cd /opt/kinto
export API_IMAGE=ghcr.io/kimkundad/kinto-api
export NGINX_IMAGE=ghcr.io/kimkundad/kinto-nginx
export IMAGE_TAG=2026-03-20-01
export SPACES_REGION=sgp1
export SPACES_BUCKET=your-space-name
export SPACES_ENDPOINT=https://sgp1.digitaloceanspaces.com
export SPACES_KEY=your_spaces_key
export SPACES_SECRET=your_spaces_secret
export SPACES_CDN_BASE_URL=https://your-space-name.sgp1.digitaloceanspaces.com
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d --force-recreate --remove-orphans
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}"
```

This setup runs nginx inside the container and binds it only to localhost on the server:

```text
127.0.0.1:8087 -> container:80
```

The API container is internal-only and receives `/api` traffic from nginx inside Docker.

Make sure the Google Sheet is shared with the service account in `credentials.json`.
Receipt uploads are stored in DigitalOcean Spaces under `kinto/bill/...` and the full public URL is saved into Google Sheets.
Uploaded receipt object names include `invoiceNumber` and `phone` to make searching easier.

Example nginx reverse proxy on the server:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name kinto.your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8087;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Connection "";
        proxy_read_timeout 120s;
    }
}
```
