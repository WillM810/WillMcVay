# Record start time
$startTime = Get-Date

# Define image name
$IMAGE = "gcr.io/coral-marker-245905/willmcvay:latest"

docker build -t $IMAGE .

# Push the image
docker push $IMAGE

# Deploy to Cloud Run
gcloud run deploy willmcvay `
  --image $IMAGE `
  --platform managed `
  --region us-central1 `
  --allow-unauthenticated

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