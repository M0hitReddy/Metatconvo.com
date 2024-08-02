import addDays from "date-fns/addDays";
import addHours from "date-fns/addHours";
import format from "date-fns/format";
import nextSaturday from "date-fns/nextSaturday";

import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useChats } from "./ChatsContext";
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { set } from "date-fns";
// import { chat } from "@/components/dashboard/data"
import { useParams } from "react-router-dom";
import {
  Archive,
  ArchiveX,
  Trash2,
  Trash,
  Clock,
  Reply,
  ReplyAll,
  Forward,
  MoreVertical,
} from "lucide-react";
import { useSocket } from "./SocketContext";

export function ChatDisplay() {
  const { user } = useContext(AuthContext);
  const { user_id } = useParams();
  const { state, dispatch } = useChats();
  const {socket, sendMessage} = useSocket();
  const messagesEndRef = useRef(null);
  const [message, setMessage] = useState("");
  const [showInput, setShowInput] = useState(false);
  const today = new Date();

  useEffect(() => {
    // if (!state.selectedChat || !state.selectedChat.messages) return;
    console.log(state.messages);
    if (state.messages.length != 0) setShowInput(true);
    // else setShowInput(false);
  }, [state.selectedChat, state.messages]);

  useEffect(() => {
    console.log(user_id);
    dispatch({
      type: "SET_MESSAGES",
      payload: [],
    });
    setShowInput(false);
    
    if (!user_id) return;
    (async () => {
      try {
        // console.log("2 times/////////////@@##$%")
        const res = await axios.get(
          `http://localhost:5000/chats/conversation?p1=${user.user_id}&p2=${user_id}`
        );
        console.log(res.data);
        // dispatch({ type: 'SET_MESSAGES', payload: res.data });
        dispatch({ type: "SELECT_CHAT", payload: res.data.conversation });
      } catch (error) {
        console.error(error);
      }
    })();
  }, [state.chats, user_id]);

  useLayoutEffect(() => {
      // messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      messagesEndRef.current?.scrollIntoView({ block: 'end' });
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth', block: 'end' });
      }, 200);
      // messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [user_id, showInput]);
  useEffect(() => {

      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.messages.length]);

  useEffect(() => {
    console.log(socket);
    if (!socket) return;
    // socket.on("receive-message", (data) => {
    //   console.log("cheem tapak dam dam", data, data.sender_id == user_id);
    //   // socket.emit("message-received", data);
    //   console.log(data);
    //   if (data.sender_id !== data.receiver_id && data.sender_id == user_id) {
    //     // socket.emit("message-received", data);
    //     dispatch({ type: "ADD_MESSAGE", payload: data });
    //   }
    // });
  }, [socket]);

  useEffect(() => {
    if (!state.selectedChat || !state.selectedChat.conversation_id) {
      // dispatch({ type: "SET_MESSAGES", payload: [] });
      return
    };
    // console.log('fetching messages')
    (async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/chats/messages?conversationId=${state.selectedChat.conversation_id}`
        );
        const data = res.data.messages;
        console.log(res.data.messages);
        dispatch({
          type: "SET_MESSAGES",
          payload: data,
          // {
          //   senderId: data.sender_id,
          //   messageId: data.message_id,
          //   content: data.content,
          //   conversationId: data.conversation_id,
          //   sentAt: data.sent_at,
          // },
        });
        // if(state.messages.length == 0) setShowInput(false);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [state.selectedChat]);

  const handleStartChat = async () => {
    try {
      console.log("start chat", user_id, user.user_id);
      setShowInput(true);
      // dispatch({ type: "SET_MESSAGES", payload: [] });
      const res = await axios.post(
        "http://localhost:5000/chats/conversation",
        { members: [user.user_id, user_id] },
        { withCredentials: true }
      );
      console.log(res.data);
      dispatch({
        type: "SELECT_CHAT",
        payload: {
          ...state.selectedChat,
          conversation_id: res.data.conversation_id,
        },
      });
      // setShowInput(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      const newMessage = {
        sender_id: user.user_id,
        receiver_id: user_id,
        message_id: new Date() + Math.random() * 1000,
        content: message,
        conversation_id: state.selectedChat.conversation_id,
        sent_at: formatDate(new Date()),
        received_at: formatDate(new Date()),
        // readstatus: 0,
      };
      console.log(newMessage);
      console.log(formatDate(new Date()));
      setMessage("");
      dispatch({ type: "ADD_MESSAGE", payload: newMessage });

      // const res = await axios.post('http://localhost:5000/chats/message', newMessage)
      // console.log(res.data);
      // socket.emit("send-message", newMessage);
      sendMessage(newMessage);
      // console.log('set message')
      // messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      // messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    } catch (err) {
      console.error(err);
    }
  };
  const getTime = (time) => {
    // console.log(time);
    const date = new Date(time);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedTime = `${hours}:${
      minutes < 10 ? "0" + minutes : minutes
    } ${ampm}`;

    return formattedTime;
  };
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = `0${d.getMonth() + 1}`.slice(-2);
    const day = `0${d.getDate()}`.slice(-2);
    const hours = `0${d.getHours()}`.slice(-2);
    const minutes = `0${d.getMinutes()}`.slice(-2);
    const seconds = `0${d.getSeconds()}`.slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };
  // state.messages.map((message) => console.log(message))

  return (
    <>
      {state.selectedChat ? (
        <div className="h-screen overflow-y- relative flex flex-grow flex-col">
          <div className="flex items-start p-4">
            <div className="flex items-center gap-4 text-sm">
              <Avatar>
                <AvatarImage
                  src={state.selectedChat.picture}
                  alt={state.selectedChat.username}
                />
                <AvatarFallback>
                  {state.selectedChat?.username
                    .split(" ")
                    .map((chunk) => chunk[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-semibold ">
                  {state.selectedChat.username}
                </div>
              </div>
            </div>
            {/* {state.selectedChat.timestamp && (
              <div className="ml-auto text-xs text-muted-foreground">
                {format(new Date(state.selectedChat.timestamp), "MMM d, yyyy, h:mm a")}
              </div>
            )} */}
          </div>
          <Separator />
          {!showInput ? (
            <div className="h-full w-full flex">
              <div className="flex flex-col  gap-10 justify-center items-center w- m-auto self-center -translate-y-16 rounded-full p-10">
                <p className="text-muted-foreground tracking-wide">
                  There are no messages to be displayed
                </p>
                <Button
                  className="border border-primary rounded-full tracking-wide shadow-xl shadow-primary transition duration-150 hover:scale-105 ease-in-out"
                  onClick={() => handleStartChat()}
                >
                  Start a chat
                </Button>
              </div>
            </div>
          ) : (
            <React.Fragment>
              <div className="flex-grow"></div>
              {/* <div>hjhjvhv</div> */}
              <ScrollArea className="h-scree flex flex-col h- justify-end " >
                <div className="flex flex-col flex-grow overflow-y-auto justify-end gap-3   whitespace-pre-wrap p-4 text-sm" >
                  {/* <div className="flex-grow"/> */}
                  {state.messages.map((message, index) => (
                    <div
                      key={message.message_id}
                      className={`${
                        user.user_id === message.sender_id
                          ? "self-end border border-primary rounded-tr-none"
                          : "self-start shadow-lg bg-secondary rounded-tl-none"
                      } relative text-left min-w-16 max-w-full sm:max-w-[90%] md:max-w-[70%] break-words flex flex-col justify-end gap-1 w-auto px-3 pt-2 pb- rounded-xl `}
                    >
                      {/* <div className="flex"> */}
                      <p
                        className={`text-primary${
                          user.user_id === message.sender_id
                            ? "-background"
                            : "-background"
                        } text-md font-medium leading- tracking-wide subpixel-antialiased`}
                      >
                        {message.content}
                      </p>
                      {/* <p className="pe-14 h-1"></p> */}
                      {/* </div> */}
                      <p className="self-end w-max  text-muted-foreground text-xs leading3 tracking-tight self-end">
                        {getTime(message.sender_id == user.user_id ? message.sent_at : message.received_at)}
                      </p>
                      {/* <div ref={index + 1 === state.messages.length ? messagesEndRef : null} ></div> */}
                    </div>
                  ))}
                  <div ref={messagesEndRef} ></div>
                </div>
                <ScrollBar />
              </ScrollArea>
              <Separator className="mt-auto" />
              {/* <div ref={messagesEndRef} ></div> */}
              <div className="p-4 bottom-0 left-0 right-0 z-10 bg-background ">
                <form>
                  <div className="grid gap-4">
                    <Textarea
                      className="p-4"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={`Reply ${state.selectedChat.username}...`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                    />
                    <div className="flex items-center">
                      <Label
                        htmlFor="mute"
                        className="flex items-center gap-2 text-xs font-normal"
                      >
                        <Switch id="mute" aria-label="Mute thread" /> Mute this
                        thread
                      </Label>
                      <Button
                        disabled={message.trim() === ""}
                        onClick={(e) => handleSendMessage(e)}
                        size="sm"
                        className="ml-auto"
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </React.Fragment>
          )}
          {/* </div> */}
        </div>
      ) : (
        ""
        // <div className="p-8 text-center text-muted-foreground">
        //   No message selected
        // </div>
      )}
      {/* </div> */}
      {/* </div> */}
    </>
  );
}
