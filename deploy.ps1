# Record start time
$startTime = Get-Date

# Define image name
$IMAGE = "gcr.io/coral-marker-245905/willmcvay:latest"

docker build -t $IMAGE .
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker build failed. Aborting deployment." -ForegroundColor Red
    exit 1
}

# Push the image
docker push $IMAGE

# Deploy to Cloud Run
gcloud run deploy willmcvay `
  --image $IMAGE `
  --platform managed `
  --region us-central1 `
  --allow-unauthenticated

.\cleanup.ps1

# Record end time
$endTime = Get-Date

# Calculate duration
$duration = $endTime - $startTime

# Print execution time
Write-Host ("Total execution time: {0}h {1}m {2}s {3}ms" -f 
    $duration.Hours, 
    $duration.Minutes, 
    $duration.Seconds, 
    $duration.Milliseconds)
