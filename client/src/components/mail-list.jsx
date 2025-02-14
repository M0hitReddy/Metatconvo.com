// import { ComponentProps } from "react"
import formatDistanceToNow from "date-fns/formatDistanceToNow";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
// import { Mail } from "@/app/(app)/examples/mail/data"
// import { useChat } from "@/components/dashboard/use-chat.js"
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChats } from "./ChatsContext";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import { c } from "vite/dist/node/types.d-aGj9QkWt"

export function MailList({ search }) {
  // const [chat, setChat] = useChat()
  const navigate = useNavigate();
  const { state, dispatch } = useChats();
  const { user } = useContext(AuthContext);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  useEffect(() => {
    // console.log('chats')
    (async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/chats/conversations?userId=${user.user_id}`,
          { withCredentials: true }
        );
        dispatch({ type: "SET_CHATS", payload: res.data.conversations });
        console.log(res.data, "chats");
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  useEffect(() => {
    console.log(state.selectedChat);
  }, [state.selectedChat]);
  const handleChatSelect = async (conv_id, user_id) => {
    // console.log(id, "id")
    // dispatch({ type: 'SELECT_CHAT', payload: { conversationID: convId, userID: userId } })
    // console.log(state.selectedChat, "selected chat")
    navigate(`/t/${user_id}`);
    // async function settMessages() {
    //   try {
    //     const res = await axios.get('http://localhost:5000/chats/messages/' + id);
    //   } catch (error) {
    //     console.error(error)
    //   }
    // }
    // dispatch({type: 'READ_CHAT', payload: id})
    // setChat({
    //   ...chat,
    //   selected: id,
    // })
  };
  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {state.chats
          .filter((item) =>
            item.username.toLowerCase().includes(search.toLowerCase())
          )
          .map((item) => (
            <button
              key={item.user_id}
              className={cn(
                "flex items-center gap-3 rounded-lg border p-3 transition-all hover:bg-accent",
                state.selectedChat?.conversation_id === item.conversation_id &&
                  "bg-muted border-muted-foregroun border-primary"
              )}
              onClick={() =>
                handleChatSelect(item.conversation_id, item.user_id)
              }
            >
              <Avatar>
                <AvatarImage src={item.picture} alt={item.username} />
                <AvatarFallback>
                  {item?.username
                    .split(" ")
                    .map((chunk) => chunk[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-grow flex-col items-start gap-1 text-left text-sm">
                <div className="flex w-full flex-col gap-1">
                  <div className="flex items-center">
                    <div className="flex items-center gap-2 ">
                      <div className="font-semibold me-1 w-ma line-clamp-1 text-sm">
                        {item.username?.substring(0, 100) +
                          (item.username?.length <= 100 ? "" : "...")}
                      </div>
                      {/* {!item.readstatus && (
                      <span className="flex h-2 w-2 rounded-full bg-blue-60" />
                    )} */}
                    </div>
                    <div
                      className={cn(
                        "ml-auto text-xs w-max",
                        state.selectedChat?.conversation_id ===
                          item.conversation_id
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {item.last_message_time
                        ? formatDistanceToNow(
                            new Date(item.last_message_time),
                            {
                              addSuffix: true,
                              baseDate: currentTime,
                            }
                          )
                        : "_ _"}
                    </div>
                  </div>
                  {/* <div className="text-xs font-medium">{item.content}</div> */}
                </div>
                <div className="line-clamp-1 text-s text-primar text-muted-foreground break-all">
                  <span className="font-bold">
                    {item.last_message_sender_id == user.user_id ? "You: " : ""}
                  </span>
                  {(item.last_message_content &&
                    item.last_message_content?.substring(0, 300) +
                      (item.last_message_content?.length <= 300
                        ? ""
                        : "...")) ||
                    "No messages yet"}
                  {/* + "..." || "No messages yet"} */}
                </div>
              </div>
            </button>
          ))}
      </div>
    </ScrollArea>
  );
}

function getBadgeVariantFromLabel(label) {
  if (["work"].includes(label.toLowerCase())) {
    return "default";
  }

  if (["personal"].includes(label.toLowerCase())) {
    return "outline";
  }

  return "secondary";
}
