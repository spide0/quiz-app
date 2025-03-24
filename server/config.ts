import dotenv from 'dotenv';
dotenv.config();

export const config = {
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz',
  },
  session: {
    secret: process.env.SESSION_SECRET
  }
};
