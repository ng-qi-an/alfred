'use client';

import Navbar from "@/components/Navbar";
import { useContext, useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { MainContext } from "@/app/layout";
import Icon from "@/components/Icon";
import '@mdxeditor/editor/style.css'
import {
    headingsPlugin,
    listsPlugin,
    quotePlugin,
    thematicBreakPlugin,
    markdownShortcutPlugin,
    MDXEditor,
    toolbarPlugin,
    UndoRedo, BoldItalicUnderlineToggles, Separator, BlockTypeSelect, ChangeCodeMirrorLanguage, CodeToggle, CreateLink, InsertCodeBlock, InsertImage, InsertSandpack, InsertTable, InsertThematicBreak, ListsToggle,
    linkDialogPlugin,
    imagePlugin,
    sandpackPlugin,
    tablePlugin,

    
  } from '@mdxeditor/editor'

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { InputText } from 'primereact/inputtext';
import Editor from "@/components/Editor";
import { useRouter } from "next/navigation";

export default function Page({params}){
    const [course, setCourse] = useState({})
    const [tasks, setTasks] = useState([])
    const [openTaskEditor, setOpenTaskEditor] = useState(false)
    const [taskEditorTitle, setTaskEditorTitle] = useState("")
    const [isCreatingTask, setIsCreatingTask] = useState(false)
    const [selectedTask, setSelectedTask] = useState({})
    const [loading, setLoading] = useState(false)
    var files = {}
    const nameRef = useRef(null)
    const markdownRef = useRef(null)

    const ctx = useContext(MainContext)
    const router = useRouter()

    useEffect(()=>{
        ctx.socket.on("getCourse", (data)=>{
            if (data.status == 'OK'){
                setCourse(data.data)
                setTasks(data.tasks)
            }
        })
        ctx.socket.emit("getCourse", {id: params.courseID})
        return ()=>{
            ctx.socket.off("getCourse")
        }
    }, [])
    function TaskEditor(){
        return <>
            {/* <Dialog closeOnEscape={false} header={taskEditorTitle} draggable={false} visible={openTaskEditor} maximized onHide={() => {if (!openTaskEditor) return; setOpenTaskEditor(false); }}> */}
                
        </>
    }
    return <div className="flex flex-col items-center px-[20px]">
        <Navbar/>
        
        <div className="w-full max-w-full flex mt-8 gap-4">
            <div className="cursor-pointer min-w-[400px] h-max mb-2 flex flex-col py-8 px-6 rounded-xl bg-white shadow overflow-hidden sticky top-8">
                <div className="flex flex-col">
                  <h2 className="text-2xl font-bold">{course.name}</h2>
                  <p className="text-lg mt-1 text-zinc-500">{course.description}</p>
                </div>
                <Button label="Host" className="mt-6"/>
            </div>
            {openTaskEditor ? <div className="flex flex-col w-full gap-6 bg-white rounded-lg py-4 px-6">
                    <div className="w-full flex items-center">
                        <Button onClick={()=> setOpenTaskEditor(false)} icon={<Icon icon={'chevron_left'}/>} severity="secondary" rounded className={'mr-4 bg-zinc-100 border-none text-black'}/>
                        <h1 className="text-2xl font-bold">{taskEditorTitle}</h1>
                    </div>
                    <div className="w-full max-w-[500px] gap-1">
                        <p className="text-xl font-semibold">Task name</p>
                        <p className="text-zinc-500 mb-3">Choose a short and sweet name to identifty your task</p>
                        <InputText ref={nameRef} id="package_name" name="name" className="w-full" required/>
                    </div>
                    <div className="flex flex-col w-full h-[500px]">
                        <p className="text-xl font-semibold">Task content</p>
                        <p className="text-zinc-500 mb-3">Describe what is to be done to complete this task. You can use any markdown features.</p>
                        <div className="w-full h-full overflow-auto border border-zinc-300 rounded-lg">
                            <MDXEditor
                                ref={markdownRef}
                                plugins={[
                                    // Example Plugin Usage
                                    headingsPlugin(),
                                    listsPlugin(),
                                    quotePlugin(),
                                    thematicBreakPlugin(),
                                    markdownShortcutPlugin(),
                                    linkDialogPlugin(),
                                    imagePlugin(),
                                    tablePlugin(),
                                    thematicBreakPlugin(),
                                    toolbarPlugin({
                                        toolbarContents: () => (
                                        <>
                                            {' '}
                                            <UndoRedo />
                                            <BoldItalicUnderlineToggles />
                                            <CodeToggle />
                                            <Separator />
                                            <ListsToggle />
                                            <BlockTypeSelect/>
                                            <Separator />
                                            <InsertImage/>
                                            <Separator />
                                            <InsertTable/>
                                            <InsertThematicBreak/>
                                        </>
                                        )
                                    }),
                                    
                                ]}
                                markdown=""
                                placeholder="# Hello World!"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col w-full">
                        <p className="text-xl font-semibold">Task material</p>
                        <p className="text-zinc-500 mb-3">The starting materials that students will have. You can see the preview on the right.</p>
                        <div className="h-[600px] bg-[#f7f7f7]">
                            <Editor files={selectedTask.id ? selectedTask.files : {}} onChange={(e)=> {console.log(e); files = e}}/>
                        </div>
                    </div>
                    <Button onClick={()=>{
                        if (nameRef.current.value == "" || markdownRef.current.getMarkdown() == "") return
                        const fdata = {name: nameRef.current.value, token: window.localStorage.getItem("token"), courseID: params.courseID, content: markdownRef.current.getMarkdown(), files: files}
                        console.log(fdata)
                        setLoading(true)
                        if (isCreatingTask){
                            ctx.socket.emit("createTask", fdata)
                            ctx.socket.once("createTask", (data)=>{
                                if (data.status == 'OK'){
                                    setLoading(false)
                                    setIsCreatingTask(false)
                                    setOpenTaskEditor(false)
                                    ctx.socket.emit("getCourse", {id: params.courseID})
                                }
                            })
                        } else {
                            fdata['id'] = selectedTask.id
                            ctx.socket.emit("updateTask", fdata)
                            ctx.socket.once("updateTask", (data)=>{
                                if (data.status == 'OK'){
                                    setLoading(false)
                                    setIsCreatingTask(false)
                                    setOpenTaskEditor(false)
                                    ctx.socket.emit("getCourse", {id: params.courseID})
                                }
                            })
                        }
                    }} loading={loading} className="w-max ml-auto" >{isCreatingTask ? 'Create' : 'Update'}</Button>
                </div> : 
                <DragDropContext onDragEnd={(result)=>{
                    var tasksCopy = [...tasks]
                    var beforeSplice = tasksCopy[result.source.index]
                    tasksCopy.splice(result.source.index, 1)
                    tasksCopy.splice(result.destination.index, 0, beforeSplice)
                    setTasks(tasksCopy)
                    ctx.socket.emit("reorderTasks", {courseID: params.courseID, tasks: tasksCopy, token: window.localStorage.getItem('token')})
                    ctx.socket.on("reorderTasks", (data)=>{
                        if (data.status == 'OK'){
                            ctx.socket.emit("getCourse", {id: params.courseID})
                        }
                    })
                }}>
                    <Droppable droppableId="tasksDroppable">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="w-full flex flex-col items-center gap-2 overflow-auto h-full">
                            <div className="w-full flex items-center justify-between mb-4 py-3 px-5 bg-white shadow rounded-xl">
                                <p className="text-xl font-bold">Tasks</p>
                                <Button onClick={()=> {setIsCreatingTask(true); setTaskEditorTitle("Creating Task"); setOpenTaskEditor(true)}}  icon={<Icon icon={'add'} className={''}/>}  className="rounded-xl w-[50px]"></Button>
                            </div>
                            {tasks.length > 0 ? tasks.map((task, index)=>{
                                return <Draggable index={index} key={task.id} draggableId={task.id}>
                                    {(provided) => (
                                        <div ref={provided.innerRef} {...provided.draggableProps} className="w-full mb-2 flex items-center py-3 px-5 rounded-xl bg-white shadow overflow-hidden">
                                            <div className="h-full flex items-center mr-2" {...provided.dragHandleProps}><Icon icon={'drag_indicator'} className={'text-zinc-300'}/></div>
                                            <div className="flex flex-col">
                                                <h2 className="text-xl"><b>Task {task.index + 1}</b> - {task.name}</h2>
                                            </div>
                                            <Button onClick={()=> {
                                                setIsCreatingTask(false);
                                                setTaskEditorTitle(`Editing Task ${task.index + 1} - ${task.name}`)
                                                setOpenTaskEditor(true)
                                                files = task.files
                                                setTimeout(()=>{
                                                    nameRef.current.value = task.name
                                                    markdownRef.current.setMarkdown(task.content)
                                                    setSelectedTask(task)
                                                }, 100)
                                            }
                                            } label="Edit" text className="ml-auto"/>
                                        </div>
                                    )}
                                </Draggable>
                        })
                            :
                                <div className="h-[300px] flex flex-col items-center justify-center">
                                    <h2 className="text-2xl font-bold">No Tasks found</h2>
                                    <p className="text-lg mt-1 text-zinc-500">Create a task using the button below</p>
                                    <Button onClick={()=> {setIsCreatingTask(true); setTaskEditorTitle("Creating Task"); setOpenTaskEditor(true)}} label="Create Task" size="small" icon={<Icon icon={'add'} className={'mr-1'}/>} className="mt-4"/>
                                </div> 
                            }
                            {provided.placeholder}
                        </div>
                    )}
                    </Droppable>
            </DragDropContext>
            }
        </div>
    </div>
}