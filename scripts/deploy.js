const { execSync } = require('child_process');

// Ensure we fail if env vars are missing
const requiredVars = ['PROJECT_ID', 'VITE_GOOGLE_MAPS_API_KEY', 'MONGODB_URI', 'JWT_SECRET', 'STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'CLIENT_URL'];
const missing = requiredVars.filter(key => !process.env[key]);

if (missing.length > 0) {
    console.error(`Error: Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
}

const projectId = process.env.PROJECT_ID;
const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY;
const mongoUri = process.env.MONGODB_URI;
const jwtSecret = process.env.JWT_SECRET;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const clientUrl = process.env.CLIENT_URL;

const run = (cmd) => {
    console.log(`\n> ${cmd}`);
    try {
        execSync(cmd, { stdio: 'inherit' });
    } catch (error) {
        console.error('Command failed.');
        process.exit(1);
    }
};

console.log('🚀 Starting Deployment...');

// 1. Build
console.log('📦 Building Docker image...');
run(`docker build --build-arg VITE_GOOGLE_MAPS_API_KEY=${apiKey} -t pickup-app .`);

// 2. Tag
console.log('🏷️  Tagging image...');
run(`docker tag pickup-app gcr.io/${projectId}/pickup-app`);

// 3. Push
console.log('⬆️  Pushing to GCR...');
run(`docker push gcr.io/${projectId}/pickup-app`);

// 4. Deploy
console.log('🚀 Deploying to Cloud Run...');
// Note: We use double quotes for the --set-env-vars string to handle the comma-separated list
// and ensure we escape properly if values have commas (though URIs usually don't need complex escaping here if simple)
const envVars = `MONGODB_URI=${mongoUri},JWT_SECRET=${jwtSecret},NODE_ENV=production,STRIPE_SECRET_KEY=${stripeSecretKey},STRIPE_WEBHOOK_SECRET=${stripeWebhookSecret},CLIENT_URL=${clientUrl}`;
run(`gcloud run deploy pickup-app --image gcr.io/${projectId}/pickup-app --platform managed --region us-central1 --allow-unauthenticated --set-env-vars "${envVars}"`);

console.log('✅ Deployment Complete!');
