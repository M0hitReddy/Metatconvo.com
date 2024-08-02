// import socket from "../index.js";
// console.log("io", io);
// import io from "../index.js";
import { dummyMessages, dummyUsers } from "./users.js";
import { postMessage } from "../controllers/chats.js";
const users = {};
// io.on('connection', (socket) => {
const setEvents = (socket, io) => {
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
    async ({ sender_id, conversation_id, content, sent_at, receiver_id }) => {
      console.log("socket on send message", {
        sender_id,
        conversation_id,
        content,
        sent_at,
        receiver_id,
      });

      // Logging users object
      console.log("Current users:", users);

      // Post the message
      await postMessage({ sender_id, conversation_id, content, sent_at });

      // Check if the receiver is connected
      if (users[receiver_id]) {
        console.log("Receiver is connected", users[receiver_id]);

        // Emit the message to the receiver
        
        socket.to(users[receiver_id]).emit("receive-message", {
          sender_id,
          receiver_id,
          message_id:
            new Date().toISOString() + Math.random().toString(36).substring(2),
          content,
          conversation_id,
          sent_at,
          received_at: new Date().toISOString(),
        });
      } else {
        console.log("Receiver is not connected", receiver_id, users);
      }
    }
  );

  
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    // Optionally remove user from users object
    for (let user_id in users) {
      if (users[user_id] === socket.id) {
        delete users[user_id];
        break;
      }
    }
  });

  // console.log('a user connected', socket.id);
  // });
};

export default setEvents;
