'use client';

import { useContext, useEffect } from "react";
import { MainContext } from "../layout";
import { Button } from "primereact/button";
import { useGoogleLogin } from "@react-oauth/google";

export default function Login(){
    const ctx = useContext(MainContext)
    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log(tokenResponse);
            const userInfo = await fetch(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } },
            )
            const data = await userInfo.json()
            ctx.socket.emit("login", {"email": data.email})  
        },
        onError: errorResponse => console.log(errorResponse),
    });
    useEffect(()=>{
        ctx.setLoaded(true)
        ctx.socket.on("login", (data)=>{
            if (data.status == 'OK'){
                localStorage.setItem("token", data.data.token)
                window.location.replace('/')
            } else {
                console.log("[LOGIN] Error Code 222")
            }
        })
        return ()=>{
            socket.off('login')
        }
    }, [])
    return <div className="flex flex-col items-center justify-center h-screen w-full">
        <Button onClick={googleLogin}>Login</Button>
    </div>
}