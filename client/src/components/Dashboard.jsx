import React, { useContext, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { Button } from './ui/button';
import axios from 'axios';
import {
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
    Tooltip,
    TooltipProvider,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

export default function Dashboard() {
    const { loggedIn, checkLoginState, user } = useContext(AuthContext);
    const navigate = useNavigate();
    useEffect(() => {
        checkLoginState()
    }, [checkLoginState])
    useEffect(() => {
        if (!loggedIn) navigate('/login')
    }, [loggedIn, checkLoginState, navigate]);
    // console.log(loggedIn);
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
        <>

            <TooltipProvider>
                <div className="grid h-screen w-full pl-[56px]">
                    <aside className="inset-y fixed  left-0 z-20 flex h-full flex-col border-r">
                        <div className="border-b p-2">
                            <Button variant="outline" size="icon" aria-label="Home">
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
                        <nav className="mt-auto grid gap-1 p-2">
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
                                {/* <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline">Open</Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
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
                                </DropdownMenu> */}
                                <TooltipContent side="right" sideOffset={5}>
                                    Account
                                </TooltipContent>
                            </Tooltip>
                        </nav>
                    </aside>
                    <div className="flex flex-col">
                        <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
                            <h1 className="text-xl font-semibold">Playground</h1>
                            <Button
                                variant="outline"
                                size="sm"
                                className="ml-auto gap-1.5 text-sm"
                            >
                                <Share className="size-3.5" />
                                Share
                            </Button>
                        </header>

                    </div>
                </div>
                <Outlet />
            </TooltipProvider>

        </>

    )
}
