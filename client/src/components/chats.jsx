import * as React from "react"
import {
  MessageCirclePlus,
  Archive,
  ArchiveX,
  Search,
  Trash2,
  Book,
  Bot,
  Code2,
  LifeBuoy,
  Settings2,
  Share,
  SquareTerminal,
  SquareUser,
  Triangle,
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
  Clock,
  Forward,
  MoreVertical,
  Reply,
  ReplyAll,
  Clock3
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { AccountSwitcher } from "@/components/account-switcher"
import { ChatDisplay } from "@/components/chat-display"
import { MailList } from "@/components/mail-list"
import { Nav } from "@/components/nav"
// import { type Mail } from "@/app/(app)/examples/mail/data"
// import { useChat } from "@/components/dashboard/use-chat.js"
import { Button } from "./ui/button"
import { Routes, Route, useNavigate, Outlet } from "react-router-dom"
import axios from "axios"
import { AuthContext } from "./AuthContext"
import { ChatsProvider, useChats } from './ChatsContext';
import { useTheme } from "./theme-provider"
// import { io } from "socket.io-client
import addDays from "date-fns/addDays"
import addHours from "date-fns/addHours"
import format from "date-fns/format"
import nextSaturday from "date-fns/nextSaturday"
import { Label } from "./ui/label"
import NewChatDialog from "./NewChatDialog"


// import {
//   DropdownMenuContent,
//   DropdownMenuItem,
// } from "@/components/ui/dropdown-menu"

// import { TooltipTrigger } from "@radix-ui/react-tooltip"



export function Chats({
  socket,
  accounts,
  mails,
  defaultLayout = [265, 440, 655],
  defaultCollapsed = false,
  navCollapsedSize,
}) {
  // const socket = React.useMemo(() => io('http://localhost:5000'), []);
  const { loggedIn, checkLoginState, user } = React.useContext(AuthContext);
  const { state, dispatch } = useChats();
  const { theme, setTheme } = useTheme();
  // const [chat] = useChat(null);
  const today = new Date()
  const navigate = useNavigate();
  // React.useEffect(() => {
  //   checkLoginState()
  // }, [checkLoginState])
  React.useEffect(() => {
    console.log(user)
    // dispatch({ type: 'SELECT_CHAT', payload: null });

    //   checkLoginState()
  }, [])
  React.useEffect(() => {
    // if (!loggedIn) navigate('/login')
    // console.log(user.)
  }, [loggedIn, checkLoginState, navigate]);
  React.useEffect(() => {
    console.log('chats')
    // if (state.user === null) return;
    async function setState() {
      try {
      
        dispatch({ type: 'SET_SOCKET', payload: socket })
   
      }
      catch (err) {
        console.error(err);
      }
    }
    setState();
  }, []);
  React.useEffect(() => {
    if(!user.user_id) return;
    socket.on('connect', () => {
      console.log(user.id, "initially connected");
      socket.emit('join', user.user_id);
      console.log('Connected to the server', socket.id);
    });
    return () => {
      socket.disconnect();
    }

  }, [user.user_id])
 
  React.useEffect(() => {
    console.log('state.selectedChat', state.selectedChat)
  }, [state.selectedChat]);

  const handleLogout = async () => {
    try {
      const res = await axios.post('http://localhost:5000/auth/logout', null, { withCredentials: true });
      checkLoginState();
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes) => {
          document.cookie = `react-resizable-panels:layout=
          ${JSON.stringify(
            sizes
          )}`
        }}
        className="h-full items-stretch"
      >
        <aside className="inset-y left-0 z-20 flex flex-col border-r">
          <div className="border-b p-2">
            <Button variant="outline" size="icon" aria-label="Home" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
              <Triangle className="size-5 fill-foreground" />
            </Button>
          </div>
          <nav className="grid gap-1 p-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg bg-muted"
                  aria-label="Playground"
                >
                  <SquareTerminal className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Playground
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg"
                  aria-label="Models"
                >
                  <Bot className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Models
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg"
                  aria-label="API"
                >
                  <Code2 className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                API
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg"
                  aria-label="Documentation"
                >
                  <Book className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Documentation
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg"
                  aria-label="Settings"
                >
                  <Settings2 className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Settings
              </TooltipContent>
            </Tooltip>
          </nav>
          <nav className="mt-auto grid fixed bottom-0 gap-1 p-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mt-auto rounded-lg"
                  aria-label="Help"
                >
                  <LifeBuoy className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Help
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <DropdownMenu>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="rounded-full">
                      <SquareUser className="h-5 w-5" />
                      <Avatar >
                        {/* <img src={"https://github.com/shadcn.png"} alt="" /> */}
                        <AvatarImage className='w-10 h-10' src={user.picture} alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <span className="sr-only">Toggle user menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <DropdownMenuContent className="w-max min-w-56">
                  <DropdownMenuLabel className='flex gap-3 items-center'>
                    <Avatar >
                      {/* <img src={"https://github.com/shadcn.png"} alt="" /> */}
                      <AvatarImage className='w-10 h-10' src={user.picture} alt="@shadcn" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <p>{user.email}</p></DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Billing</span>
                      <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                      <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Keyboard className="mr-2 h-4 w-4" />
                      <span>Keyboard shortcuts</span>
                      <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Users className="mr-2 h-4 w-4" />
                      <span>Team</span>
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <UserPlus className="mr-2 h-4 w-4" />
                        <span>Invite users</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            <span>Email</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            <span>Message</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            <span>More...</span>
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuItem>
                      <Plus className="mr-2 h-4 w-4" />
                      <span>New Team</span>
                      <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Github className="mr-2 h-4 w-4" />
                    <span>GitHub</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LifeBuoy className="mr-2 h-4 w-4" />
                    <span>Support</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    <Cloud className="mr-2 h-4 w-4" />
                    <span>API</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <Button variant="ghost" className="w-full p-0 h-max justify-start text-left" onClick={handleLogout}>Logout</Button>
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <TooltipContent side="right" sideOffset={5}>
                Account
              </TooltipContent>
            </Tooltip>
          </nav>
        </aside>

        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>

          <Tabs defaultValue="all">
            <div className="flex justify-between items-center px-4 py-2">
              <h1 className="text-xl font-bold">Inbox</h1>
              <div className="flex gap-3">
                <TabsList className="ml-auto">
                  <TabsTrigger
                    value="all"
                    className="text-zinc-600 dark:text-zinc-200"
                  >
                    All mail
                  </TabsTrigger>
                  <TabsTrigger
                    value="unread"
                    className="text-zinc-600 dark:text-zinc-200"
                  >
                    Unread
                  </TabsTrigger>
                </TabsList>
                <NewChatDialog />
              </div>
            </div>
            <Separator />
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8" />
                </div>
              </form>
            </div>
            <TabsContent value="all" className="m-0">
              <MailList items={state.chats} />
            </TabsContent>
            <TabsContent value="unread" className="m-0">
              <MailList items={state.chats.filter((item) => !item.read)} />
            </TabsContent>
          </Tabs>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={defaultLayout[2]}>
          <div className={`h-${state.selectedChat ? 'full' : 'screen'} flex flex-col`}>
            <div className="flex items-center p-2">
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={!state.selectedChat}>
                      <Archive className="h-4 w-4" />
                      <span className="sr-only">Archive</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Archive</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={!state.selectedChat}>
                      <ArchiveX className="h-4 w-4" />
                      <span className="sr-only">Move to junk</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Move to junk</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={!state.selectedChat}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Move to trash</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Move to trash</TooltipContent>
                </Tooltip>
                <Separator orientation="vertical" className="mx-1 h-6" />
                <Tooltip>
                  <Popover>
                    <PopoverTrigger asChild>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={!state.selectedChat}>
                          <Clock className="h-4 w-4" />
                          <span className="sr-only">Snooze</span>
                        </Button>
                      </TooltipTrigger>
                    </PopoverTrigger>
                    <PopoverContent className="flex w-[535px] p-0">
                      <div className="flex flex-col gap-2 border-r px-2 py-4">
                        <div className="px-4 text-sm font-medium">Snooze until</div>
                        <div className="grid min-w-[250px] gap-1">
                          <Button
                            variant="ghost"
                            className="justify-start font-normal"
                          >
                            Later today{" "}
                            <span className="ml-auto text-muted-foreground">
                              {format(addHours(today, 4), "E, h:m b")}
                            </span>
                          </Button>
                          <Button
                            variant="ghost"
                            className="justify-start font-normal"
                          >
                            Tomorrow
                            <span className="ml-auto text-muted-foreground">
                              {format(addDays(today, 1), "E, h:m b")}
                            </span>
                          </Button>
                          <Button
                            variant="ghost"
                            className="justify-start font-normal"
                          >
                            This weekend
                            <span className="ml-auto text-muted-foreground">
                              {format(nextSaturday(today), "E, h:m b")}
                            </span>
                          </Button>
                          <Button
                            variant="ghost"
                            className="justify-start font-normal"
                          >
                            Next week
                            <span className="ml-auto text-muted-foreground">
                              {format(addDays(today, 7), "E, h:m b")}
                            </span>
                          </Button>
                        </div>
                      </div>
                      <div className="p-2">
                        <Calendar />
                      </div>
                    </PopoverContent>
                  </Popover>
                  <TooltipContent>Snooze</TooltipContent>
                </Tooltip>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={!state.selectedChat}>
                      <Reply className="h-4 w-4" />
                      <span className="sr-only">Reply</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Reply</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={!state.selectedChat}>
                      <ReplyAll className="h-4 w-4" />
                      <span className="sr-only">Reply all</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Reply all</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={!state.selectedChat}>
                      <Forward className="h-4 w-4" />
                      <span className="sr-only">Forward</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Forward</TooltipContent>
                </Tooltip>
              </div>
              <Separator orientation="vertical" className="mx-2 h-6" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" disabled={!state.selectedChat}>
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">More</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Mark as unread</DropdownMenuItem>
                  <DropdownMenuItem>Star thread</DropdownMenuItem>
                  <DropdownMenuItem>Add label</DropdownMenuItem>
                  <DropdownMenuItem>Mute thread</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Separator />
            {!state.selectedChat && (
              <div className="p-8 text-center text-muted-foreground">
                No message selected
              </div>
            )}
            <Outlet />
          </div>
        </ResizablePanel>

      </ResizablePanelGroup>
    </TooltipProvider>
  )
}
