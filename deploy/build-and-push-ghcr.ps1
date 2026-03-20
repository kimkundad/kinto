param(
  [string]$ImageTag = "",
  [string]$Registry = "ghcr.io/kimkundad"
)

if ([string]::IsNullOrWhiteSpace($ImageTag)) {
  $ImageTag = Get-Date -Format "yyyy-MM-dd-HH"
}

$apiImage = "$Registry/kinto-api:$ImageTag"
$nginxImage = "$Registry/kinto-nginx:$ImageTag"

Write-Host "Building $apiImage"
docker build -f Dockerfile.prod --target api-runtime -t $apiImage .

Write-Host "Building $nginxImage"
docker build -f Dockerfile.prod --target nginx-runtime -t $nginxImage .

Write-Host "Pushing $apiImage"
docker push $apiImage

Write-Host "Pushing $nginxImage"
docker push $nginxImage

Write-Host ""
Write-Host "Use these values on the server:"
Write-Host "export API_IMAGE=$Registry/kinto-api"
Write-Host "export NGINX_IMAGE=$Registry/kinto-nginx"
Write-Host "export IMAGE_TAG=$ImageTag"
