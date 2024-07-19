'use client';

import { Splitter, SplitterPanel } from 'primereact/splitter';
import { 
    SandpackProvider, 
    SandpackLayout, 
    SandpackPreview, 
    SandpackCodeEditor,
    useSandpack,
    SandpackCodeViewer,
    SandpackConsole
} from "@codesandbox/sandpack-react";


import { TabView, TabPanel } from 'primereact/tabview';

import { useEffect, useRef, useState } from "react";
import { Button } from 'primereact/button';

export default function Editor({onChange=()=>{}, onFileChange=()=>{}, readOnly, files:ffiles}){
  const [actualFiles, setActualFiles] = useState({})
  const [actualActiveFile, setActualActiveFile] = useState(null)
  const [changeActiveFile, setChangeActiveFile] = useState("")
  const [openConsole, setOpenConsole] = useState(true)
  // const codemirrorInstance = useRef(null);
  // useEffect(()=>{
  //   const cmInstance = codemirrorInstance.current.getCodemirror();
 
  //   if (!cmInstance) return;
  //   cmInstance.state.readOnly = true
  // })
  function CodeGetter(){
      const { sandpack } = useSandpack();
      const { files, activeFile, setActiveFile } = sandpack;

      useEffect(()=>{
        if (files){
          setActualFiles(files)
          onChange(files)
        }
      }, [files])
      useEffect(()=>{
        if (activeFile){
          console.log(activeFile)
          onFileChange(activeFile)
          setActualActiveFile(activeFile)
        }
      }, [activeFile])
      useEffect(()=>{
        if (changeActiveFile){
          setActiveFile(changeActiveFile)
          setActualActiveFile(changeActiveFile)
        
        }
      }, [changeActiveFile])
      return <></>
  }
  function Preview(){
    return <>
      
    </>
  }
  return <SandpackProvider template="static" theme={'light'} files={ffiles} className='w-full w-full flex items-center'>
      <SandpackLayout style={{height: 'calc(100vh - 20px)', width: 'calc(100vw - 40px)'}}>
        {/* <SandpackFileExplorer className='h-full'/> */}
        <Splitter style={{width: 'calc(100%)'}}>
          <SplitterPanel className='flex flex-col w-full' style={{height: 'calc(100vh - 20px)'}}>
            <CodeGetter/>
            <div className='w-full h-full flex flex-col items-center'>
              <div className='flex items-center gap-2 w-full overflow-x-auto h-[80px] px-4 border-b-2 border-b-zinc-100'>
                {Object.keys(actualFiles).map((file, i)=>{
                  return <Button size='small' severity={actualActiveFile != file && 'secondary'} rounded text={actualActiveFile != file} key={i} onClick={()=> {setChangeActiveFile(file)}} className={`${actualActiveFile != file && 'bg-zinc-100'} text-[16px]`}>{file}</Button>
                })}
              </div>
              <div className='w-full h-full overflow-auto'>
                {readOnly ? <SandpackCodeViewer showTabs={false} showLineNumbers code={actualFiles[actualActiveFile] && actualFiles[actualActiveFile].code}/> : <SandpackCodeEditor showLineNumbers showTabs={false} style={{width: '100%'}}/>}
              </div>
            </div>
          </SplitterPanel>
          <SplitterPanel className='flex items-center w-full'>
            <div className='h-full w-[10px]'/>
            <Splitter layout='vertical' style={{height: '100%'}}>
              <SplitterPanel className='flex items-center flex-col'>
                <SandpackPreview style={{width: '100%', height: '100%'}} showNavigator showRefreshButton={false} showOpenInCodeSandbox={false} />
                <div className='w-full h-[10px]'/>
              </SplitterPanel>
              <SplitterPanel minSize={20} size={5}>
                <div className='w-full py-3 flex items-center px-4 border-y-2 border-zinc-100 bg-zinc-50'>
                  <p className='font-medium text-[17px]'>Console</p>
                </div>
                <SandpackConsole className='bg-zinc-50'/>
              </SplitterPanel>
            </Splitter>
          </SplitterPanel>
        </Splitter>
      </SandpackLayout>
  </SandpackProvider>
}