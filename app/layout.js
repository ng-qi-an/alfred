'use client';

import { Inter, Nunito } from "next/font/google";
import "./globals.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import { PrimeReactProvider } from 'primereact/api';
import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { ProgressBar } from "primereact/progressbar";
import { useRouter } from "next/navigation";
import { GoogleOAuthProvider } from "@react-oauth/google";

const nunito = Nunito({ subsets: ["latin"] });


export const MainContext = createContext({})

export default function RootLayout({ children }) {
  const [socket, setSocket] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [loadContent, setLoadContent] = useState(false)
  const [user, setUser] = useState({})
  const [users, setUsers] = useState({})
  const router = useRouter()
  useEffect(()=>{
    const fsocket = io("http://localhost:1734")
    setSocket(fsocket)
    setLoadContent(true)
    fsocket.on("connect", ()=>{
      if (localStorage.getItem("token")){
        fsocket.emit("getUser", {token: localStorage.getItem("token")})
      } else {
        router.replace('/login')
      }
      fsocket.emit("getUsers")
      console.log('[SOCKET] Connected')
    })
    fsocket.on("getUser", (data)=>{
      if (data.status == 'OK'){
        setUser(data.data)
        if (window.location.pathname == '/login'){
          setLoadContent(false)
          window.location.replace('/')
        } else {
          setLoaded(true)
        } 
      } else if (data.status == 'INVALID'){
        setUser({})
        router.replace('/login')
        window.localStorage.removeItem("token")
      }
    })
    fsocket.on("syncUsers", (data)=>{
        setUsers(data.data)
    })
    return ()=>{
      setSocket(null)
    }
  }, [])
  return (
    <html lang="en">
      <body>
        <PrimeReactProvider value={{ripple: true}}>
          <MainContext.Provider value={{socket, setSocket, users, setUsers, user, setUser, loaded, setLoaded}}>
            {!loaded && <div className="w-screen h-screen flex flex-col items-center justify-center fixed top-0 left-0 z-[999] bg-[#f7f7f7]">
              <h2 className="text-3xl font-bold mb-3">Alfred</h2>
              <ProgressBar mode="indeterminate" style={{ height: '6px', width: '250px' }}></ProgressBar>
            </div>}
            <GoogleOAuthProvider clientId="1019975290669-rlf4su0uh521dlgp9fvsqgm01lin5rus.apps.googleusercontent.com">
              {loadContent && children}
            </GoogleOAuthProvider>
          </MainContext.Provider>
        </PrimeReactProvider>
      </body>
    </html>
  );
}
