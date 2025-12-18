# Docker Deployment Guide

This guide explains how to build, run, and deploy the Pickup application using Docker.

## Prerequisites
- Docker installed on your machine.
- Google Cloud CLI (`gcloud`) installed and authenticated (for deployment).
- A valid Google Maps API Key.
- A valid MongoDB connection string.

## 1. Build the Image
The **Google Maps API Key** is required at **build time** because Vite bundles it into the static client assets.

**Run this command (Single Line):**
```powershell
docker build --build-arg VITE_GOOGLE_MAPS_API_KEY=your_key_here -t pickup-app .
```

## 2. Run Locally
The **Server Secrets** (Mongo URI, JWT Secret) are required at **run time**.

**Run this command (Single Line):**
```powershell
docker run -p 8080:8080 -e PORT=8080 -e MONGODB_URI="mongodb+srv://user:pass@host/pickup" -e JWT_SECRET="your_secret" -e NODE_ENV=production pickup-app
```

## 3. Deployment (Google Cloud Run)
These steps assume you have the Google Cloud CLI installed.

### Step 3a: Authenticate Docker
You must authenticate your local Docker client with Google Cloud.

**Run this command (Single Line):**
```powershell
gcloud auth configure-docker
```

### Step 3b: Tag and Push
First, tag your image for the Google Container Registry (GCR) or Artifact Registry. Replace `PROJECT_ID` with your actual Google Cloud Project ID.

**Tag (Single Line):**
```powershell
docker tag pickup-app gcr.io/PROJECT_ID/pickup-app
```

**Push (Single Line):**
```powershell
docker push gcr.io/PROJECT_ID/pickup-app
```

### Step 3c: Deploy
Deploy to Cloud Run, passing the runtime environment variables. Note that we define the memory limit to 512MB or 1GB depending on needs (Node apps often need >256MB).

**Deploy Command (Single Line):**
```powershell
gcloud run deploy pickup-app --image gcr.io/PROJECT_ID/pickup-app --platform managed --region us-central1 --allow-unauthenticated --set-env-vars "MONGODB_URI=mongodb+srv://user:pass@host/pickup,JWT_SECRET=your_secret,NODE_ENV=production"
```

> [!WARNING]
> passing secrets via command line flags (like `--set-env-vars`) can leave traces in shell history. For production, consider using Google Secret Manager and the `--set-secrets` flag instead.

## Environment Variable Reference

| Variable | Type | Description |
| :--- | :--- | :--- |
| `VITE_GOOGLE_MAPS_API_KEY` | **Build Argument** | Used by the client (web browser) to load maps. |
| `MONGODB_URI` | **Runtime Env** | Database connection string for the server. |
| `JWT_SECRET` | **Runtime Env** | Secret key for signing authentication tokens. |
| `PORT` | **Runtime Env** | Port the server listens on (Cloud Run injects this automatically). |

## Troubleshooting

### PowerShell Security Error
If you see an error like `cannot be loaded because running scripts is disabled`, run this command to allow scripts in your current session only:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```
Then try the `gcloud` command again.
