import { useContext, useEffect, useRef, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useParams,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "@/components/theme-provider.jsx";
import { LoginForm } from "./components/LoginForm";
import { SignupForm } from "./components/SignupForm";
import {
  AuthContext,
  AuthContextProvider,
  useAuth,
} from "./components/AuthContext";
// import Dashboard from './components/Dashboard'
import Dashboard from "./components/dashboard/page";
import Callback from "./components/Callback";
import AuthenticationPage from "./components/authentication/page";
import { Chats } from "./components/chats";
import { ChatDisplay } from "./components/chat-display";
import { ChatsProvider } from "./components/ChatsContext";
import { SocketProvider } from "./components/SocketContext";

// const Home = () => {
//   const { loggedIn } = useContext(AuthContext)
//   if (loggedIn === true) return <Dashboard AuthContext={AuthContext} />
//   if (loggedIn === false) return <LoginForm />
//   return <></>
// }
function App() {
  // const [count, setCount] = useState(0)
  // const {loggedIn, checkLoginState, user} = useContext(AuthContext);
  const { chat } = useParams();
  console.log(chat);
  return (
    <>
      <AuthContextProvider>
        <ChatsProvider>
          <SocketProvider>
            <ThemeProvider storageKey="vite-ui-theme">
              <div className="">
                <Router>
                  <Routes>
                    <Route
                      path="/auth/google/callback"
                      element={<Callback />}
                    />
                    <Route
                      path="/login"
                      element={<AuthenticationPage type={"login"} />}
                    />
                    <Route
                      path="/signup"
                      element={<AuthenticationPage type={"signup"} />}
                    />
                    <Route path="/about" element={<h1>About</h1>} />
                    <Route path="/contact" element={<h1>Contact</h1>} />
                    {/* <ChatsProvider> */}
                    {/* <Route path="/inbox" element={<ProtectedRoute element={<Dashboard />} />} /> */}
                    <Route
                      path="/"
                      element={<ProtectedRoute element={<Dashboard />} />}
                    >
                      <Route path="t/:user_id" element={<ChatDisplay />} />
                    </Route>
                    {/* </ChatsProvider> */}
                    <Route path="*" element={"not found"} />
                  </Routes>
                </Router>
              </div>
            </ThemeProvider>
          </SocketProvider>
        </ChatsProvider>
      </AuthContextProvider>
    </>
  );
}

const ProtectedRoute = ({ element }) => {
  const { loggedIn } = useAuth();
  const navigate = useNavigate();
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!loggedIn) {
      // return;
      navigate("/login");
      // window.location.assign('http://localhost:5000/auth/url')
    }
  }, [loggedIn]);
  // return <ChatsProvider>{element}</ChatsProvider>;
  return <>{element}</>;
};

export default App;
