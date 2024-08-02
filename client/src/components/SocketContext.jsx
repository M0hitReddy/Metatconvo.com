import React, { createContext, useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { AuthContext } from "./AuthContext";
import { useChats } from "./ChatsContext";
import { useParams } from "react-router-dom";

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const { user } = useContext(AuthContext);
  const { state, dispatch } = useChats();
  const { user_id } = useParams();
  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);
    // newSocket.on("connect", () => {
    //   console.log(user.user_id, "initially connected");
    //   socket.emit("join", user.user_id);
    //   console.log("Connected to the server", socket.id);
    // });
    newSocket.on("chat message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => newSocket.close();
  }, []);
  useEffect(() => {
    if (!user) return;
    if (socket) {
      socket.emit("join", user.user_id);
    }
  }, [socket, user]);

  useEffect(() => {
    console.log("cheem tapak dam dam", user_id);
    if (socket) {
      socket.on("receive-message", (data) => {
        // console.log("cheem tapak dam dam");
        // socket.emit("message-received", data);
        console.log(data);
        // if (data.sender_id !== data.receiver_id && data.sender_id == user_id) {
        // socket.emit("message-received", data);
        if (data.conversation_id == state.selectedChat?.conversation_id) 
        dispatch({ type: "ADD_MESSAGE", payload: data });
        // }
      });
    }
  }, [socket, state.selectedChat?.conversation_id]);

  useEffect(() => {
    console.log("cheem tapak dam dam", state.selectedChat?.conversation_id);
  }, [state.selectedChat?.conversation_id]);

  const sendMessage = (message) => {
    if (socket) {
      socket.emit("send-message", message);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, messages, sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
};
const useSocket = () => useContext(SocketContext);
export { SocketContext, SocketProvider, useSocket };
