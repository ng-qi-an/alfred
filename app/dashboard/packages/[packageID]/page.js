'use client';

import { MainContext } from "@/app/layout";
import Navbar from "@/components/Navbar";
import { useContext, useEffect, useState } from "react";
import { Button } from "primereact/button";
import Icon from "@/components/Icon";
import { useRouter } from "next/navigation";
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

export default function Page({params}){
    const [_package, setPackage] = useState({})
    const [courses, setCourses] = useState([])
    const [openCreateCourse, setOpenCreateCourse] = useState(false)
    const [creating, setCreating] = useState(false)

    const router = useRouter()
    const ctx = useContext(MainContext)
    useEffect(()=>{
        ctx.socket.on("getPackage", (data)=>{
            if (data.status == 'OK'){
                setPackage(data.data)
                setCourses(data.courses)
            }
        })
        ctx.socket.emit("getPackage", {id: params.packageID})
        return ()=>{
            ctx.socket.off("getPackage")
        }
    }, [])
    return  <div className="flex flex-col items-center px-[20px]">
        <Navbar/>
        <Dialog header="Create Package" draggable={false} visible={openCreateCourse} style={{ width: '500px' }} onHide={() => {if (!openCreateCourse) return; setOpenCreateCourse(false); }}>
            <form onSubmit={(e)=>{
              var formData = new FormData(e.target);
              // output as an object
              const fdata = {...Object.fromEntries(formData)}
              fdata['token'] = window.localStorage.getItem("token")
              fdata['packageID'] = params.packageID
              setCreating(true)
              ctx.socket.emit("createCourse", fdata)
              ctx.socket.once("createCourse", (data)=>{
                if (data.status == 'OK'){
                  setCreating(false)
                  setOpenCreateCourse(false)
                  ctx.socket.emit("getPackage", {id: params.packageID})
                }
              })
              e.preventDefault()
            }} className="flex flex-col items-center w-full gap-6">
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="package_name">Name</label>
                <InputText id="package_name" name="name" required/>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="package_description">Description</label>
                <InputText id="package_description" name="description" required/>
              </div>
              <Button loading={creating} className="w-full">{!creating && <>Create <Icon icon={'add'} className={'ml-auto'}/></>}</Button>
            </form>
        </Dialog>
        <div className="mt-8 w-full max-w-[700px]">
            <div className="w-full mb-2 mt-6 flex items-center py-4 px-6 rounded-xl bg-white shadow overflow-hidden">
                <Button onClick={()=> router.push('/')} icon={<Icon icon={'chevron_left'}/>} severity="secondary" rounded className={'mr-4 bg-zinc-200 border-none text-black'}/>
                <div className="flex flex-col">
                    <h2 className="text-2xl font-bold">{_package.name}</h2>
                    <p className="text-lg mt-1 text-zinc-500">{_package.description}</p>
                </div>
            </div>
            {courses.length > 0 ? <>
                {courses.map((course)=>{
                return <div onClick={()=> router.push(`/dashboard/packages/${params.packageID}/${course.id}`)} className="cursor-pointer w-full mb-2 flex items-center py-4 px-6 rounded-xl bg-white shadow overflow-hidden">
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-bold">{course.name}</h2>
                        <p className="text-lg mt-1 text-zinc-500">{course.description}</p>
                    </div>
                    <Button label="View" className="mt-2 ml-auto"/>
                </div>
                })}
                <Button onClick={()=> setOpenCreateCourse(true)} className="w-full justify-center mt-3"><Icon icon='add' className={'mr-2'}/> Create Course</Button>
            </> : <div className="h-[300px] flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold">No Courses found</h2>
                <p className="text-lg mt-1 text-zinc-500">Create a course using the button below</p>
                <Button onClick={()=> setOpenCreateCourse(true)}  label="Create Course" size="small" icon={<Icon icon={'add'} className={'mr-1'}/>} className="mt-4"/>
            </div>
            }
        </div>
    </div>
}