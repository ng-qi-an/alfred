'use client';

import { MainContext } from "@/app/layout"
import Editor from "@/components/Editor";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react"

export default function Viewing({params}){
    const ctx = useContext(MainContext)
    const router = useRouter()
    const [user, setUser] = useState({})
    useEffect(()=>{
        ctx.socket.on("syncFiles", (data)=>{
            console.log(data)
            if (data.data.sender == params.socketID){
                setUser({"files": data.data.files})
            }
        })
    }, [])
    useEffect(()=>{
        if (ctx.users[params.socketID]){
            setUser(ctx.users[params.socketID])
        } else {
            router.replace('/dashboard')
        }
    }, [])
    return <div className="flex flex-col items-center justify-center h-screen px-[20px] pointer-events-none">
        {user.files && <Editor files={user.files} readOnly={true} />}
    </div>
}