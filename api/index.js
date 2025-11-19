// Vercel serverless function handler
import app from '../server/index.js';

// Export the Express app directly for Vercel
// Vercel's Node.js runtime can handle Express apps natively
export default app;
