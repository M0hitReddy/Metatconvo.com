import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import authRouter from './routes/auth.js';
import cors from 'cors';
// import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import config from './constants.js';
import chatsRouter from './routes/chats.js';
import "./sockets/index.js"
import setEvents from './sockets/index.js';
// import connection from './db/db.js';
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        // origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(
    cors({
        origin: config.clientUrl,
        // origin: "*",
        credentials: true,
    }),
)

app.use(cookieParser())
app.use(express.json());


io.on('connection', (socket) => {
    setEvents(socket);
    // console.log('a user connected');


});
app.use('/auth', authRouter);
app.use('/chats', chatsRouter);
server.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});
export default io;