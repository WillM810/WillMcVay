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
  