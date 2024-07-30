// import socket from "../index.js";
// console.log("io", io);
import io from "../index.js";
import { dummyMessages, dummyUsers } from "./users.js";
import { postMessage } from "../controllers/chats.js";
const users = {};
// io.on('connection', (socket) => {
const setEvents = (socket) => {
  console.log("####user", socket.id, users);
  socket.on("join", (user) => {
    console.log("##user_id", user);
    users[user] = socket.id;
    console.log("a user joinedd", users);
    // const activeUsers = dummyUsers.map((useritem) => user.id === useritem.id );
    // io.emit('all-users', activeUsers);
  });
  socket.on(
    "send-message",
    ({ sender_id, conversation_id, content, sent_at, receiver_id }) => {
      console.log(
        "socket on send message",
        sender_id,
        conversation_id,
        content,
        sent_at,
        receiver_id
      );
      postMessage({ sender_id, conversation_id, content, sent_at });
      if (users[receiver_id]) {
        console.log("@ll USERS", users);
        console.log(users[receiver_id], "socket on send message");
        io.to(users[receiver_id]).emit("receive-message", {
          sender_id,
          receiver_id,
          message_id: new Date() + Math.random() * 1000,
          content,
          conversation_id,
          sent_at,
          received_at: new Date(),
        });
      }
    }
  );
  socket.on("get-users", () => {
    socket.emit("all-users", dummyUsers);
  });
  socket.on("disconnect", () => {
    delete users[socket.id];
    console.log("a user disconnected", socket.id);
  });

  // console.log('a user connected', socket.id);
  // });
};

export default setEvents;
