'use client';
import Icon from "@/components/Icon";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { TabMenu } from 'primereact/tabmenu';
import { useContext, useEffect, useState } from "react";
import { MainContext } from "./layout";
import { Dialog } from 'primereact/dialog';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';

export default function Page(){
    const router = useRouter()
    const [selectedItem, setSelectedItem] = useState(null)
    const [packages, setPackges] = useState([])
    const [openCreatePackage, setOpenCreatePackage] = useState(false)
    const [openCreateUser, setOpenCreateUser] = useState(false)
    const [creating, setCreating] = useState(false)
    const ctx = useContext(MainContext)
    useEffect(()=>{
      console.log(ctx.user)
      if (ctx.user.rank > 1){
        setSelectedItem("packages")
      } else {
        setSelectedItem('assignments')
      }
      ctx.socket.on("getPackages", (data)=>{
        if (data.status == 'OK'){
          setPackges(data.data)
        }
      })
      return ()=>{
        ctx.socket.off("getPackages")
      }
    }, [ctx.user])
    useEffect(()=>{
      if (selectedItem == 'packages'){
        ctx.socket.emit("getPackages")
      }
    }, [selectedItem])
    return <div className="flex flex-col items-center px-[20px]">
      <Navbar/>
      <div className="w-full max-w-[700px] flex flex-col items-center overflow-auto">
        <Dialog header="Create Package" draggable={false} visible={openCreatePackage} style={{ width: '500px' }} onHide={() => {if (!openCreatePackage) return; setOpenCreatePackage(false); }}>
            <form onSubmit={(e)=>{
              var formData = new FormData(e.target);
              // output as an object
              const fdata = {...Object.fromEntries(formData)}
              fdata['token'] = window.localStorage.getItem("token")
              setCreating(true)
              ctx.socket.emit("createPackage", fdata)
              ctx.socket.once("createPackage", (data)=>{
                if (data.status == 'OK'){
                  setCreating(false)
                  setOpenCreatePackage(false)
                  ctx.socket.emit("getPackages")
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
        <div className="w-full flex flex-col items-center px-2 rounded-lg mt-3">
          <TabMenu pt={{menu: {className: 'bg-transparent w-full'}, menuitem: {className: 'bg-transparent w-full justify-center'}}} model={[{label: "Packages", icon: <Icon icon={"package_2"} className={'mr-2'}/>, command: ()=> setSelectedItem("packages")}, {label: 'Users', icon: <Icon icon={'group'} className={'mr-2'}/>, command: ()=> setSelectedItem("users")}]} className="rounded-xl w-full bg-transparent mb-8"/>
          {selectedItem == 'packages' ? packages.length > 0 ? <>
            {packages.map((_package)=>{
              return <div onClick={()=> router.push(`/dashboard/packages/${_package.id}`)} className="cursor-pointer w-full mb-2 flex items-center py-4 px-6 rounded-xl bg-white shadow overflow-hidden">
                <div className="flex flex-col">
                  <h2 className="text-2xl font-bold">{_package.name}</h2>
                  <p className="text-lg mt-1 text-zinc-500">{_package.description}</p>
                </div>
                <Button label="View" className="mt-2 ml-auto"/>
              </div>
            })}
            <Button onClick={()=> setOpenCreatePackage(true)} className="w-full justify-center mt-3"><Icon icon='add' className={'mr-2'}/> Create Package</Button>
          </> : <div className="h-[300px] flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold">No Packages found</h2>
            <p className="text-lg mt-1 text-zinc-500">Create a package using the button below</p>
            <Button onClick={()=> setOpenCreatePackage(true)}  label="Create Package" size="small" icon={<Icon icon={'add'} className={'mr-1'}/>} className="mt-4"/>
          </div>
          : selectedItem == 'users' && <div className="w-full flex flex-col items-center">
            <Button label="Create User" className="mt-2"/>
          </div>
          }
        </div>
      </div>
    </div>
}