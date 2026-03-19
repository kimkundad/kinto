param(
  [string]$ImageTag = "",
  [string]$Registry = "ghcr.io/kimkundad"
)

if ([string]::IsNullOrWhiteSpace($ImageTag)) {
  $ImageTag = Get-Date -Format "yyyy-MM-dd-HH"
}

$nginxImage = "$Registry/kinto-nginx:$ImageTag"

Write-Host "Building $nginxImage"
docker build -f Dockerfile.prod --target nginx-runtime -t $nginxImage .

Write-Host "Pushing $nginxImage"
docker push $nginxImage

Write-Host ""
Write-Host "Use these values on the server:"
Write-Host "export NGINX_IMAGE=$Registry/kinto-nginx"
Write-Host "export IMAGE_TAG=$ImageTag"
