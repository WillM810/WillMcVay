docker build -t gcr.io/coral-marker-245905/willmcvay:latest .
docker push gcr.io/coral-marker-245905/willmcvay:latest
gcloud run deploy willmcvay `
  --image gcr.io/coral-marker-245905/willmcvay:latest `
  --platform managed `
  --region us-central1 `
  --allow-unauthenticated
