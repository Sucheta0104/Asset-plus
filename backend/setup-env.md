# Environment Setup Guide

To run the backend server, you need to create a `.env` file in the backend directory with the following variables:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/asset-management
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

## Steps to set up:

1. Create a `.env` file in the `backend` directory
2. Copy the above content into the file
3. Replace `your-super-secret-jwt-key-change-this-in-production` with a strong secret key
4. Make sure MongoDB is running on your system
5. Start the backend server with `npm start` or `node server.js`

## Important Notes:

- The JWT_SECRET should be a strong, random string in production
- The JWT_EXPIRES_IN is set to 7 days as requested
- Make sure MongoDB is installed and running
- The frontend expects the backend to run on port 3000 