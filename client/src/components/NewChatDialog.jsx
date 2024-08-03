import { Loader, MessageCirclePlus, Search, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import React, { useEffect, useRef, useState } from "react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import axios from "axios";
import { set } from "date-fns";
import { Separator } from "./ui/separator";
import NewChatDialogOpen from "./NewChatDialogOpen";
import { useAuth } from "./AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useChats } from "./ChatsContext";

function NewChatDialog() {
  const { userid } = useParams();
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { selectedChat } = useChats();
  const [search, setSearch] = useState("");
  const [fetching, setFetching] = useState(false);
  const [newChatLoading, setNewChatLoading] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [map, setMap] = useState({});
  const debounceTimer = useRef(null);
  const navigate = useNavigate();
  const handleCheckBoxChange = (result) => {
    setMap({ ...map, [result.user_id]: result.username });
    setSelectedPeople(
      selectedPeople.includes(result.user_id)
        ? selectedPeople.filter((person) => person !== result.user_id)
        : [...selectedPeople, result.user_id]
    );
    setSearchResults(
      searchResults.map((person) =>
        person.user_id === result.user_id
          ? { ...person, checked: !person.checked }
          : person
      )
    );
  };
  const handleDialogOpenChange = () => {
    setSearch("");
    setSelectedPeople([]);
    setSearchResults([]);
    setMap({});
  };
  const handleSearchChange = (e) => {
    function debounceFetchUsers() {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      debounceTimer.current = setTimeout(() => {
        setSearch(e.target.value);
      }, 500); // Adjust the delay as needed
    }
    debounceFetchUsers();
    // console.log(selectedPeople);
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  };
  const handleNewChat = (user_id, isGroup) => {
    // console.log(user);
    async function createConversation() {
      try {
        // setNewChatLoading(true);
        // const res = await axios.post(
        //   "http://localhost:5000/chats/conversation",
        //   { members: [userid], creator: user.user_id, isGroup: isGroup }
        // );
        // console.log(res.data);
        // setTimeout(() => {
        //   setNewChatLoading(false);
        // }, 1000);
        // setDialog(dialog === 1 ? 2 : 1);
        navigate(`/t/${user_id}`);
        setDialogOpen(false);
        // console.log(res.data);
      } catch (error) {
        console.error(error);
      }
    }
    createConversation();
  };
  const handleStartChat = () => {
    async function createConversation() {
      try {
        setNewChatLoading(true);
        const res = await axios.post(
          "http://localhost:5000/chats/conversation",
          { members: selectedPeople, creator: user.id }
        );
        console.log(res.data);
        setTimeout(() => {
          setNewChatLoading(false);
        }, 1000);
        navigate(`/t/${res.data.conversationId}`);
        // console.log(res.data);
      } catch (error) {
        console.error(error);
      }
    }
    createConversation();
  };
  // useEffect(() => {
  //     // if (!dialogOpen) return;
  //     setDialogOpen(true);
  //     // console.log(selectedChat);
  // }, [userid]);
  useEffect(() => {
    if (search === "") {
      setSearchResults([]);
      return;
    }
    async function fetchUsers() {
      try {
        setFetching(true);
        const res = await axios.get(
          `http://localhost:5000/chats/users?search=${search}`
        );
        console.log(res.data);
        res.data = res.data.filter((person) => person.user_id !== user.user_id);

        console.log(
          selectedPeople.includes("933130e1-0b5e-44ee-8ac4-7461ab1a8935")
        );
        setSearchResults(
          res.data.map((person) => ({
            ...person,
            checked: selectedPeople.includes(person.user_id),
          }))
        );
      } catch (error) {
        console.error(error);
      }
    }
    fetchUsers();
  }, [search]);

  useEffect(() => {
    setTimeout(() => {
      setFetching(false);
    }, 500);
    return () => {
      clearTimeout();
    };
  }, [searchResults]);
  useEffect(() => {
    handleDialogOpenChange();
  }, [dialogOpen]);

  return (
    <Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="outline">
              <MessageCirclePlus />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={5}>
          New Chat
        </TooltipContent>
      </Tooltip>
      {/* <NewChatDialogOpen/> */}
      <DialogContent className="sm:max-w-[500px] p-0">
        <Tabs defaultValue="newchat" className="relative max-w-full" onChange={() => console.log("done @@###")}>
          <TabsList className="grid w-full grid-cols-2 absolute -top-12" >
            <TabsTrigger value="newchat">New Chat</TabsTrigger>
            <TabsTrigger value="newgroup">New Group</TabsTrigger>
          </TabsList>

          <TabsContent value="newgroup">
            <DialogHeader className={"flex flex-col gap-2 px-4 pt-2"}>
              <DialogTitle className="w-max m-auto">New Group</DialogTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-bold">To : </p>
                {selectedPeople.map((person) => (
                  <div
                    key={person}
                    className="relative flex items-center justify-between gap-1 bg-secondary text-primary p-2 rounded-full overflow-hidden "
                  >
                    <Label key={person} className="max-w-40">
                      {map[person]}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search person.."
                  disabled={newChatLoading ? true : false}
                  className="pl-8"
                  onChange={(e) => handleSearchChange(e)}
                />
              </div>
            </DialogHeader>
            <Separator className="mt-4 mb-2" />

            {search === "" ? (
              <DialogDescription className="px-4 py-2 h-40 min-h-52">
                Search for people to start a chat with
              </DialogDescription>
            ) : fetching ? (
              <DialogDescription className="px-4 py-2 h-40 flex justify-center items-center">
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              </DialogDescription>
            ) : searchResults.length === 0 ? (
              <DialogDescription className="px-4 py-2 h-40 min-h-52">
                No users found
              </DialogDescription>
            ) : (
              <ScrollArea className="max-h-96 min-h-52 px-4">
                <div className="grid gap-2 py4">
                  {searchResults.map((result) =>
                    result.user_id !== user.user_id ? (
                      <div
                        key={result.user_id}
                        className="space-x-2 border p-2 rounded-lg"
                      >
                        <label
                          htmlFor={"newchat" + result.user_id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex justify-between items-center"
                        >
                          <div className="flex gap-2 items-center">
                            <Avatar>
                              <AvatarImage src={result.picture} alt="@shadcn" />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <p>{result.username}</p>
                          </div>
                          <Checkbox
                            id={"newchat" + result.user_id}
                            disabled={newChatLoading ? true : false}
                            checked={result?.checked}
                            onCheckedChange={() => handleCheckBoxChange(result)}
                          />
                        </label>
                      </div>
                    ) : null
                  )}
                </div>
              </ScrollArea>
            )}
            <DialogFooter className={"px-4 pb-4"}>
              <Button
                type="submit"
                disabled={newChatLoading ? true : false}
                variant=""
                className="border-primary w-full"
                onClick={() => handleStartChat()}
              >
                {newChatLoading ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Start Chat"
                )}
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="newchat">
            <DialogHeader className={"flex flex-col gap-2 px-4 pt-2"}>
              <DialogTitle className="w-max m-auto">New Chat</DialogTitle>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search person.."
                  disabled={newChatLoading ? true : false}
                  className="pl-8"
                  onChange={(e) => handleSearchChange(e)}
                />
              </div>
            </DialogHeader>
            <Separator className="mt-4 mb-2" />

            {search === "" ? (
              <DialogDescription className="px-4 py-2 h-40 min-h-52">
                Search for people to start a chat with
              </DialogDescription>
            ) : fetching ? (
              <DialogDescription className="px-4 py-2 h-40 flex justify-center items-center">
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              </DialogDescription>
            ) : searchResults.length === 0 ? (
              <DialogDescription className="px-4 py-2 h-40 min-h-52">
                No users found
              </DialogDescription>
            ) : (
              <ScrollArea className="max-h-96 overflow-y-auto min-h-52 px-2">
                <div className="grid gap-2 py4">
                  {searchResults.map((result) =>
                    result.user_id !== user.user_id ? (
                      <div
                        key={result.user_id}
                        className="space-x-2 border rounded-lg"
                      >
                        <Button
                          variant="ghost"
                          className="flex gap-2 items-center justify-start h-full w-full p-2"
                          onClick={() => handleNewChat(result.user_id, false)}
                        >
                          {/* <div className='flex gap-2 items-center'> */}
                          <Avatar>
                            <AvatarImage src={result.picture} alt="@shadcn" />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <p>{result.username}</p>
                          {/* </div> */}
                        </Button>
                      </div>
                    ) : null
                  )}
                  
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default NewChatDialog;
