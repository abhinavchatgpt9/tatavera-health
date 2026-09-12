# Tatavera Health - Deployment Guide

Complete step-by-step instructions for deploying to production.

## Pre-Deployment Checklist

- [ ] All content updated in `lib/constants.ts`
- [ ] Images added to `/public` directory
- [ ] Environment variables configured
- [ ] Email service set up
- [ ] Database configured (if needed)
- [ ] CRM integration configured (if needed)
- [ ] Analytics ID configured
- [ ] Forms tested locally
- [ ] Mobile testing completed
- [ ] Lighthouse audit passed

## Option 1: Deploy to Vercel (Recommended)

Vercel is optimized for Next.js and offers free tier deployment.

### 1a. Using Vercel CLI (Fastest)

```bash
# Install Vercel CLI (one-time)
npm i -g vercel

# Deploy from project directory
cd tatavera-health
vercel

# Follow prompts:
# - Link to existing Vercel account (or create new)
# - Select project name
# - Confirm production deployment
```

Your site will be live at `tatavera-health.vercel.app`

### 1b. Using GitHub Integration (Recommended for teams)

1. Push code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit: Tatavera Health website"
git remote add origin https://github.com/yourusername/tatavera-health.git
git push -u origin main
```

2. Connect to Vercel:
   - Go to https://vercel.com/import
   - Select "GitHub"
   - Find and select `tatavera-health` repository
   - Configure environment variables
   - Click "Deploy"

3. Every push to `main` branch auto-deploys!

### Configure Environment Variables on Vercel

1. Go to Project Settings → Environment Variables
2. Add each variable from `.env.example`:

```
SENDGRID_API_KEY=your_actual_key
FROM_EMAIL=hello@tatavera-health.com
ADMIN_EMAIL=admin@tatavera-health.com
HUBSPOT_API_KEY=your_actual_key
NEXT_PUBLIC_GA_ID=UA-XXXXXXXXX-X
NODE_ENV=production
```

3. Redeploy after adding variables:
```bash
vercel --prod
```

## Option 2: Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Or build and deploy manually:
npm run build
netlify deploy --dir=.next --prod
```

## Option 3: Deploy to AWS Amplify

```bash
# Install Amplify CLI
npm i -g @aws-amplify/cli

# Initialize
amplify init

# Deploy
amplify publish
```

## Option 4: Deploy to Docker (Self-Hosted)

### Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application
COPY . .

# Build
RUN npm run build

# Expose port
EXPOSE 3000

# Start production server
CMD ["npm", "start"]
```

### Build and Run

```bash
# Build image
docker build -t tatavera-health .

# Run container
docker run -p 3000:3000 -e NODE_ENV=production tatavera-health

# Push to Docker Hub
docker tag tatavera-health username/tatavera-health
docker push username/tatavera-health
```

## Option 5: Deploy to Traditional Server (Ubuntu/Debian)

### 1. SSH into Server
```bash
ssh user@your-server.com
```

### 2. Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 3. Clone Repository
```bash
cd /var/www
git clone https://github.com/yourusername/tatavera-health.git
cd tatavera-health
```

### 4. Install Dependencies
```bash
npm install --production
```

### 5. Build Application
```bash
npm run build
```

### 6. Create Environment File
```bash
cp .env.example .env.local
nano .env.local  # Edit with your values
```

### 7. Install PM2 (Process Manager)
```bash
npm install -g pm2
pm2 start npm --name "tatavera-health" -- start
pm2 startup
pm2 save
```

### 8. Setup Nginx (Reverse Proxy)
```bash
sudo apt-get install nginx
```

Create `/etc/nginx/sites-available/tatavera-health`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/tatavera-health /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 9. Setup SSL with Let's Encrypt
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Post-Deployment

### 1. Verify Site is Live
```bash
curl https://your-domain.com
# Should return HTML content
```

### 2. Test Form Submission
- Visit homepage
- Scroll to form
- Fill out all fields
- Submit
- Should see success message
- Check email/CRM for submission

### 3. Check Analytics
- Go to Google Analytics
- Verify tracking code is working
- Set up conversion goals

### 4. Monitor Performance
- Run Lighthouse audit: https://your-domain.com
- Target: 90+ scores
- Fix any issues

### 5. Setup Error Monitoring (Optional)
- Create Sentry account: https://sentry.io
- Add environment variable: `SENTRY_DSN=your_dsn`
- Errors now tracked automatically

### 6. Setup Email Service

#### SendGrid Integration
```bash
npm install @sendgrid/mail
```

Update `/app/api/lead/route.ts`:
```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const msg = {
  to: process.env.ADMIN_EMAIL,
  from: process.env.FROM_EMAIL,
  subject: `New Lead: ${body.name}`,
  html: `
    <h2>New Patient Inquiry</h2>
    <p><strong>Name:</strong> ${body.name}</p>
    <p><strong>Email:</strong> ${body.email}</p>
    <p><strong>Phone:</strong> ${body.phone}</p>
    <p><strong>Country:</strong> ${body.country}</p>
    <p><strong>Procedure:</strong> ${body.procedure}</p>
    <p><strong>Message:</strong> ${body.message}</p>
  `
};

await sgMail.send(msg);
```

#### Mailgun Integration
```bash
npm install mailgun.js
```

## Domain Setup

### Point Domain to Vercel
If using Vercel:

1. Go to Vercel Dashboard → Project Settings → Domains
2. Enter domain name
3. Follow DNS instructions
4. Update DNS records at your registrar

Typical DNS records:
```
A       your-domain.com          76.76.19.165
CNAME   www.your-domain.com      cname.vercel-dns.com
CNAME   _acme-challenge          _acme-challenge.vercel-dns.com
```

### Setup SSL Certificate
Most platforms (Vercel, Netlify) auto-generate SSL. For manual setup, use Let's Encrypt above.

## Continuous Deployment

### GitHub Actions (Auto-deploy on Push)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Monitoring & Maintenance

### Weekly Tasks
- [ ] Check form submissions
- [ ] Monitor error logs
- [ ] Review analytics

### Monthly Tasks
- [ ] Update dependencies: `npm update`
- [ ] Check security vulnerabilities: `npm audit`
- [ ] Review performance metrics
- [ ] Backup database (if applicable)

### Quarterly Tasks
- [ ] Update Next.js and dependencies
- [ ] Security audit
- [ ] Performance optimization
- [ ] A/B testing of CTAs

## Troubleshooting

### 504 Error (Gateway Timeout)
- Check API routes are responding
- Verify database connection
- Check for infinite loops in code

### 502 Error (Bad Gateway)
- Restart application
- Check error logs
- Verify environment variables

### Form Not Submitting
- Check browser console for errors
- Verify API endpoint is accessible
- Check CORS headers
- Test with curl:
```bash
curl -X POST https://your-domain.com/api/lead \
  -H "Content-Type: application/json" \
  -d '{"name":"test","email":"test@example.com",...}'
```

### Slow Performance
- Run Lighthouse audit
- Check image sizes
- Enable caching
- Optimize database queries
- Use CDN for static assets

## Security Checklist

- [ ] HTTPS enabled
- [ ] Security headers configured (done in next.config.js)
- [ ] Environment variables not in code
- [ ] Form inputs validated
- [ ] API rate limiting enabled
- [ ] DDoS protection enabled
- [ ] Regular backups scheduled
- [ ] Sensitive data encrypted

## Cost Estimates

| Platform | Monthly Cost | Notes |
|----------|-------------|-------|
| Vercel | Free-$20 | Excellent for Next.js |
| Netlify | Free-$19 | Good general option |
| AWS Amplify | Free-$5-50 | Scales with usage |
| Self-hosted VPS | $5-20 | Requires management |
| Docker (managed) | $15-100 | Platform-dependent |

## Support

For deployment issues:
- Vercel docs: https://vercel.com/docs
- Next.js docs: https://nextjs.org/docs
- React docs: https://react.dev

Good luck with your deployment!
