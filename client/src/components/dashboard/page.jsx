// import { cookies } from "next/headers"
// import Image from "next/image"
import Cookies from 'universal-cookie';
import io from 'socket.io-client';


// ...

const cookies = new Cookies();
// const layout = cookies.get('react-resizable-panels:layout');

import { Chats } from "@/components/chats"
import { accounts, mails } from "@/components/dashboard/data"
import { ChatsProvider, useChats } from '../ChatsContext';
import { useContext, useEffect, useMemo, useRef } from 'react';
// import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
export default function Dashboard() {
  const socket = useMemo(() => io('http://localhost:5000'), []);
  const layout = cookies.get("react-resizable-panels:layout")
  const collapsed = cookies.get("react-resizable-panels:collapsed")
  const defaultLayout = layout && layout.value ? JSON.parse(layout.value) : undefined;
  const defaultCollapsed = collapsed && collapsed.value ? JSON.parse(collapsed.value) : undefined;
  // const navigate = useNavigate();
  const { user } = useAuth();
  const { dispatch } = useChats();
  // const firstRender = useRef(true);
  // socket.on('connect', () => {

  //   console.log('Connected to the server', socket.id);
  // });
  // useEffect(() => {
  //   if(firstRender.current){
  //     firstRender.current = false;
  //     return;
  //   }
  //   if(!loggedIn){
  //     // return;
  //     navigate('/login');
  //     // window.location.assign('http://localhost:5000/auth/url')
  //   }
  // },[loggedIn]);
  useEffect(() => {
    console.log(user);
  }, [user]);
  // useEffect(() => {
  //   dispatch({ type: 'SELECT_CHAT', payload: null });
  //   console.log('selected chat')
  // }, []);
  return (
    <>

      {/* <div className="hidden flex-col md:flex"> */}
      {/* <ChatsProvider> */}
      {user && <Chats
        socket={socket}
        accounts={accounts}
        mails={mails}
        defaultLayout={defaultLayout}
        defaultCollapsed={defaultCollapsed}
        navCollapsedSize={4}
      />}
      {/* </ChatsProvider> */}
      {/* <Outlet /> */}
      {/* </div> */}
    </>
  )
}
