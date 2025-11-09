# Define image name
$IMAGE = "gcr.io/coral-marker-245905/willmcvay:latest"
$CACHE = "gcr.io/coral-marker-245905/willmcvay:cache"

# Build with cache-from / cache-to
docker buildx build `
  --cache-from=type=registry,ref=$CACHE `
  --cache-to=type=registry,ref=$CACHE,mode=max `
  -t $IMAGE `
  .

# Push the image
docker push $IMAGE

# Deploy to Cloud Run
gcloud run deploy willmcvay `
  --image $IMAGE `
  --platform managed `
  --region us-central1 `
  --allow-unauthenticated
