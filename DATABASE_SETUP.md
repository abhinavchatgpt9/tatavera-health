# Database Setup Guide — Tatavera Health

Complete step-by-step guide to set up PostgreSQL + Prisma for the platform.

---

## Prerequisites

- Node.js 18+ installed
- macOS, Linux, or Windows (WSL2 recommended on Windows)
- Terminal / command line access

---

## Step 1: Install PostgreSQL

### macOS (via Homebrew)
```bash
brew install postgresql@16
brew services start postgresql@16
echo 'export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Ubuntu / Debian
```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Windows
Download from https://www.postgresql.org/download/windows/ and run the installer.
Use the default port 5432 and remember the password you set.

---

## Step 2: Create the Database and User

Connect to PostgreSQL as the superuser:

```bash
# macOS/Linux
psql postgres

# Ubuntu (switch to postgres user first)
sudo -u postgres psql
```

Run these SQL commands inside psql:

```sql
-- Create a dedicated database user
CREATE USER tatavera_user WITH PASSWORD 'your_strong_password_here';

-- Create the database
CREATE DATABASE tatavera_health OWNER tatavera_user;

-- Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE tatavera_health TO tatavera_user;

-- Exit psql
\q
```

Test the connection:
```bash
psql -U tatavera_user -d tatavera_health -h localhost
# Enter your password when prompted
\q
```

---

## Step 3: Configure Environment Variables

Copy the example env file:
```bash
cd /path/to/tatavera-health
cp .env.example .env
```

Edit `.env` and set your DATABASE_URL:
```env
DATABASE_URL="postgresql://tatavera_user:your_strong_password_here@localhost:5432/tatavera_health?schema=public"
```

Also generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Copy the output and set it as JWT_SECRET in `.env`.

---

## Step 4: Install Dependencies

```bash
npm install
```

This installs Prisma, bcryptjs, jsonwebtoken, and all other dependencies.

---

## Step 5: Generate Prisma Client

```bash
npm run db:generate
```

This reads `prisma/schema.prisma` and generates the TypeScript client in `node_modules/@prisma/client`.

---

## Step 6: Push the Schema to the Database

For development (no migration history):
```bash
npm run db:push
```

For production (with migration history, recommended):
```bash
npm run db:migrate
# When prompted, enter a migration name like: "initial_schema"
```

Verify the tables were created:
```bash
psql -U tatavera_user -d tatavera_health -h localhost
\dt
# You should see: users, patient_cases, hospitals, doctors, etc.
\q
```

---

## Step 7: Open Prisma Studio (Optional)

Prisma Studio is a visual database browser:
```bash
npm run db:studio
```
Opens at http://localhost:5555 — you can browse and edit all tables.

---

## Step 8: Start the Development Server

```bash
npm run dev
```

Visit http://localhost:3000

---

## Database Tables Reference

| Table | Description |
|-------|-------------|
| `User` | Patient accounts (email, phone, password hash) |
| `OtpToken` | OTP tokens for phone login |
| `PatientCase` | Each patient's active medical case and stage |
| `CaseManager` | Internal case manager profiles |
| `Treatment` | Treatment pages (cardiac, orthopedic, etc.) |
| `TreatmentFaq` | FAQs for each treatment |
| `Hospital` | Hospital profiles with accreditation data |
| `HospitalTreatment` | Many-to-many: hospitals ↔ treatments |
| `HospitalCostItem` | Procedure costs per hospital |
| `Doctor` | Doctor profiles |
| `DoctorHospital` | Many-to-many: doctors ↔ hospitals |
| `DoctorTreatment` | Many-to-many: doctors ↔ treatments |
| `Destination` | Country destination pages |
| `Review` | Patient reviews for hospitals/doctors |
| `Testimonial` | Featured patient testimonials |
| `Report` | Encrypted patient medical files (S3 keys) |
| `Appointment` | Video/in-person consultations |
| `Message` | In-app chat between patients and case managers |
| `Enquiry` | Lead form submissions |
| `BlogPost` | Blog articles |
| `Partner` | Referring partners (doctors, agents) |
| `PartnerReferral` | Partner referral tracking |

---

## AWS S3 Setup (Patient Reports)

Patient medical reports are stored encrypted on S3.

### 1. Create an S3 Bucket
```
Bucket name: tatavera-patient-reports
Region: us-east-1 (or nearest region to your users)
Block all public access: YES ✅
Versioning: Enabled (recommended)
Server-side encryption: AES-256 (SSE-S3)
```

### 2. Create an IAM User
In AWS Console → IAM → Users → Create user:
- Username: `tatavera-app`
- Attach policy: `AmazonS3FullAccess` (or a scoped custom policy)
- Create access key → copy Access Key ID and Secret

### 3. Add CORS Configuration to the Bucket
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedOrigins": ["https://tataverahealth.com"],
    "ExposeHeaders": []
  }
]
```

### 4. Set env variables
```env
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"
AWS_SECRET_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
AWS_S3_BUCKET="tatavera-patient-reports"
```

---

## Production Deployment Checklist

### Database
- [ ] Use managed PostgreSQL (Supabase, Railway, Neon, or AWS RDS)
- [ ] Enable SSL connection in DATABASE_URL: `?sslmode=require`
- [ ] Set up daily automated backups
- [ ] Create read replica for analytics queries

### Environment
- [ ] All secrets in `.env` are production values (not dev defaults)
- [ ] JWT_SECRET is a 64-byte random hex string
- [ ] NODE_ENV=production

### Security
- [ ] HTTPS enforced via Vercel/Nginx/Cloudflare
- [ ] Rate limiting on all API routes (middleware or Vercel Edge Config)
- [ ] CORS limited to your domain
- [ ] SQL injection: protected by Prisma ORM (parameterized queries)
- [ ] XSS: protected by React DOM escaping
- [ ] CSRF: not required for API-based auth (JWT cookie with SameSite)

### Recommended Hosting
| Service | Use |
|---------|-----|
| **Vercel** | Next.js hosting (automatic SSL, edge CDN) |
| **Supabase** or **Neon** | Managed PostgreSQL (free tier available) |
| **AWS S3** | Patient report storage |
| **Cloudflare** | CDN + DDoS protection |

---

## Connecting to Supabase (Recommended Free Option)

1. Create account at https://supabase.com
2. Create new project → note your database password
3. Go to Settings → Database → Connection String (URI mode)
4. Copy the connection string — it looks like:
   ```
   postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
   ```
5. Set it in `.env` as DATABASE_URL
6. Run `npm run db:push`

---

## Quick Reset (Development Only)

If you need to reset everything:
```bash
# Drop all tables and re-push schema
npx prisma db push --force-reset

# Or drop and recreate the database
psql postgres -c "DROP DATABASE IF EXISTS tatavera_health;"
psql postgres -c "CREATE DATABASE tatavera_health OWNER tatavera_user;"
npm run db:push
```

---

## Troubleshooting

**"Can't reach database server"**
- Check PostgreSQL is running: `brew services list` (macOS) or `sudo systemctl status postgresql` (Linux)
- Verify DATABASE_URL has correct host, port, user, password, and database name

**"Table does not exist"**
- Run `npm run db:push` again
- Run `npx prisma generate` to regenerate the client

**"P1001: Can't reach database server"**
- Ensure your IP is allowed if using a hosted DB (check firewall/IP allowlist in Supabase/RDS)

**"Prisma client is not generated"**
- Run `npx prisma generate`
- Check node_modules/@prisma/client exists
