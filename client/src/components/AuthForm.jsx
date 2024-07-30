import * as React from "react"
import { cn } from "@/lib/utils"
import { Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "./AuthContext"
import axios from "axios"


export function AuthForm({ className, ...props }) {
    const [isLoading, setIsLoading] = React.useState(false)
    const navigate = useNavigate();
    const { loggedIn } = React.useContext(AuthContext);
    // console.log(loggedIn);
    React.useEffect(() => {
        if (loggedIn) {
            console.log('logged in')
            navigate('/')
        };
    }, [loggedIn])
    const handleLoginWithGoogle = async () => {
        setIsLoading(true)
        try {
            const res = await axios.get('http://localhost:5000/auth/url')
            // console.log(res.data.url);
            window.location.assign(res.data.url);
        }
        catch (err) {
            console.error(err)
        }
        setTimeout(() => {
            setIsLoading(false)
        }, 1000)
    }
    async function onSubmit(event) {
        event.preventDefault()
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
        }, 1000)
    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <form onSubmit={onSubmit}>
                <div className="grid gap-2">
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="email">
                            Email
                        </Label>
                        <Input
                            id="email"
                            placeholder="name@example.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading}
                        />
                    </div>
                    <Button disabled={isLoading}>
                        {isLoading && (
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Sign In with Email
                    </Button>
                </div>
            </form>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>

            <Button variant="outline" type="button" onClick={handleLoginWithGoogle} disabled={isLoading}>
                {isLoading ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    ''
                )}{" "}
                Google
            </Button>
        </div>
    )
}