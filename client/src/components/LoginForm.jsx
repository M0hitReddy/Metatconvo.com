// import Link from "next/link"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"
import { useContext, useEffect } from "react"
import { AuthContext } from "./AuthContext"

export function LoginForm() {
  const navigate = useNavigate();
  const { loggedIn } = useContext(AuthContext);
  // console.log(loggedIn);
  useEffect(() => {
    if (loggedIn) {
      // console.log('logged in')
      navigate('/')
    };
  }, [loggedIn])
  const handleLoginWithGoogle = async () => {
    try {
      const res = await axios.get('http://localhost:5000/auth/url')
      // console.log(res.data.url);
      window.location.assign(res.data.url);


    }
    catch (err) {
      console.error(err)
    }
  }
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
            </div>
            <Input id="password" type="password" required />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
          <Button variant="outline" className="w-full" onClick={handleLoginWithGoogle}>
            Login with Google
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to={'/signup'} className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
    //  : <Navigate to="/" />
  )
}
