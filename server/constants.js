import { config } from 'dotenv';
config();
const googleConfig = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    authUrl: 'https://accounts.google.com/o/oauth2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    redirectUrl: process.env.REDIRECT_URL,
    clientUrl: process.env.CLIENT_URL ,
    tokenSecret: process.env.TOKEN_SECRET,
    tokenExpiration: 360000000,
    postUrl: 'https://jsonplaceholder.typicode.com/posts',
}

export default googleConfig;