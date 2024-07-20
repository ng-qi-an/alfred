'use client';

import { Inter, Nunito } from "next/font/google";
import "./globals.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import { PrimeReactProvider } from 'primereact/api';
import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const nunito = Nunito({ subsets: ["latin"] });


export const MainContext = createContext({})

export default function RootLayout({ children }) {
  const [socket, setSocket] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [users, setUsers] = useState({})
  useEffect(()=>{
    const fsocket = io("http://localhost:1734")
    setSocket(fsocket)
    fsocket.on("connect", ()=>{
      setLoaded(true)
      fsocket.emit("getUsers")
      console.log('[SOCKET] Connected')
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
          <MainContext.Provider value={{socket, setSocket, users, setUsers}}>
            {loaded && children}
          </MainContext.Provider>
        </PrimeReactProvider>
      </body>
    </html>
  );
}
