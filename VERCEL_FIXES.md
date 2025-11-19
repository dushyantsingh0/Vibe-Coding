# Vercel Deployment Fixes

## Issue: CORS Errors and API Not Working

### Problem
After deploying to Vercel, the application couldn't load posts or create new posts due to CORS errors.

### Root Cause
The serverless function handler wasn't properly configured to handle CORS headers in Vercel's environment.

### Fixes Applied

1. **Updated `api/index.js`** - Wrapped Express app with proper CORS headers for Vercel
2. **Updated `server/index.ts`** - Enhanced CORS configuration with dynamic origin checking

### Files Changed
- `api/index.js` - Added CORS headers and OPTIONS handling
- `server/index.ts` - Improved CORS configuration

### Next Steps
1. Commit and push changes:
   ```bash
   git add .
   git commit -m "Fix CORS issues for Vercel deployment"
   git push
   ```

2. Vercel will automatically redeploy

3. Test the application after deployment

### If Issues Persist
- Check Vercel function logs for errors
- Verify DATABASE_URL is set in Vercel environment variables
- Ensure all VITE_FIREBASE_* variables are configured
