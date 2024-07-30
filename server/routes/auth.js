import Express from 'express';
import cookieParser from 'cookie-parser';
import { loggedIn, logout, token, url } from '../controllers/auth.js';
Express().use(cookieParser())
const authRouter = Express.Router();
// dotenv.googleConfig();
authRouter.get('/logged_in', loggedIn)
authRouter.get('/url', url);

authRouter.get('/token', token);

authRouter.post('/logout', logout);

export default authRouter;