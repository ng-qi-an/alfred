import { Avatar } from 'primereact/avatar';
import Icon from './Icon';
import { Menu } from 'primereact/menu';
import { useRef } from 'react';

export default function Navbar(){
    const menuRef = useRef(null)
    return <div className="w-full flex flex-col pt-[10px] items-center justify-center shadow overflow-hidden">
            <div className="w-full bg-white flex items-center rounded-xl py-4 px-8">
                <p className="text-xl font-bold">Alfred</p>
                <div className="flex-1"/>
                <Avatar onClick={(e)=> menuRef.current.toggle(e)} icon={<Icon icon={'account_circle'}/>} size="large" shape="circle" className='bg-zinc-100 hover:bg-zinc-200 cursor-pointer' />
                <Menu ref={menuRef} popup model={[{label: 'Sign Out', icon: <Icon icon={'logout'} className={'mr-2'}/>, command: ()=>{
                    window.localStorage.removeItem("token")
                    window.location.replace('/login')
                }}]} />
            </div>
        </div>
}