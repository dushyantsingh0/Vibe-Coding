# Deploying to Vercel

This guide will walk you through deploying the DevPulse blogging application to Vercel.

## Prerequisites

- Vercel account (sign up at [vercel.com](https://vercel.com))
- Neon database with tables created
- Firebase project configured
- Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Prepare Your Database

1. **Run Database Migrations** on your Neon database:
   ```bash
   npm run db:push
   ```

2. **Add Welcome Post** (optional):
   - Connect to your Neon database
   - Run the SQL from `welcome-post.sql` to create an initial blog post

## Step 2: Push to Git Repository

Ensure your code is pushed to a Git repository:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## Step 3: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your Git repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `dist`

5. Click **"Deploy"** (it will fail initially - this is expected, we need to add environment variables first)

### Option B: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

## Step 4: Configure Environment Variables

In the Vercel dashboard, go to your project → **Settings** → **Environment Variables** and add:

### Firebase Configuration
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### API Configuration
```
VITE_API_URL=/api
```

### Database (for serverless functions)
```
DATABASE_URL=your_neon_database_connection_string
```

**Important**: Make sure to add these variables for **Production**, **Preview**, and **Development** environments.

## Step 5: Redeploy

After adding environment variables:

1. Go to **Deployments** tab
2. Click the **three dots** (•••) on the latest deployment
3. Click **"Redeploy"**
4. Check **"Use existing Build Cache"** (optional)
5. Click **"Redeploy"**

## Step 6: Update Firebase Authorized Domains

1. Go to Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Add your Vercel domain (e.g., `your-app.vercel.app`)

## Step 7: Test Your Deployment

Visit your Vercel URL and test:

- ✅ Home page loads with blog posts
- ✅ Individual blog post pages work
- ✅ Search functionality works
- ✅ Login with Google works
- ✅ Create new post (after login)
- ✅ Add comments to posts
- ✅ Like/dislike posts

## Troubleshooting

### API Requests Failing

**Problem**: API calls return 404 or 500 errors

**Solutions**:
- Check that `DATABASE_URL` is set in Vercel environment variables
- Verify the database connection string is correct
- Check Vercel function logs: Project → **Deployments** → Click deployment → **Functions** tab

### Blank Page on Load

**Problem**: Application shows a blank page

**Solutions**:
- Check browser console for errors
- Verify all `VITE_FIREBASE_*` environment variables are set
- Ensure the build completed successfully in Vercel

### Authentication Not Working

**Problem**: Google login fails or redirects incorrectly

**Solutions**:
- Add your Vercel domain to Firebase authorized domains
- Check Firebase configuration in Vercel environment variables
- Verify `VITE_FIREBASE_*` variables match your Firebase project

### Database Connection Errors

**Problem**: Posts not loading, errors about database connection

**Solutions**:
- Verify `DATABASE_URL` is correct in Vercel
- Check that your Neon database is active (not paused)
- Ensure database tables exist (run `npm run db:push`)

## Custom Domain (Optional)

To use a custom domain:

1. Go to Project → **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed by Vercel
4. Add the custom domain to Firebase authorized domains

## Monitoring

- **Function Logs**: Project → **Deployments** → Click deployment → **Functions**
- **Analytics**: Project → **Analytics** tab
- **Error Tracking**: Consider integrating Sentry or similar service

## Local Development

To continue developing locally:

```bash
# Start both frontend and backend
npm run dev:all

# Or run separately
npm run dev        # Frontend only
npm run dev:server # Backend only
```

The local environment uses `http://localhost:3001/api` for API calls (configured in `.env`).

## Continuous Deployment

Vercel automatically deploys:
- **Production**: Commits to `main` branch
- **Preview**: Commits to other branches and pull requests

Every push triggers a new deployment!
