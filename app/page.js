'use client';
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";

export default function Page(){
    const router = useRouter()
    return <>
        <Button onClick={()=> router.push("/class")}>Student</Button>
        <Button onClick={()=> router.push("/dashboard")}>Dashboard</Button>
    </>
}