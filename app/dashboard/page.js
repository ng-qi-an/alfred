'use client';

import { useContext, useEffect, useState } from "react"
import { MainContext } from "../layout"
import { Button } from "primereact/button"
import { useRouter } from "next/navigation";

export default function Dashboard(){
    const router = useRouter()
    const ctx = useContext(MainContext)
    return <div>
        {Object.keys(ctx.users).map((socketID)=>{
            return socketID != ctx.socket.id && <Button onClick={()=> router.push(`/dashboard/${socketID}`)}>{socketID}</Button>
        })}
    </div>
}