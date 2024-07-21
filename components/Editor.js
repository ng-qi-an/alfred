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
import { ButtonGroup } from 'primereact/buttongroup';

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
      <SandpackLayout className='flex items-center w-full h-full' >
        {/* <SandpackFileExplorer className='h-full'/> */}
        {/* <Splitter style={{width: 'calc(100%)'}}>
          <SplitterPanel className='flex flex-col w-full' style={{height: 'calc(100vh - 20px)'}}> */}
            <CodeGetter/>
            
            <div className='h-full w-full flex items-center gap-2 p-[10px]'>
            <div className='flex flex-col items-center h-full overflow-auto min-w-[200px] gap-2 py-6 rounded-xl '>
                <h2 className='text-lg w-full px-4 font-semibold mt-2'>Files</h2>
                {Object.keys(actualFiles).map((file, i)=>{
                  return <Button size='small' key={i} onClick={()=> {setChangeActiveFile(file)}} plain className={`${actualActiveFile != file ? 'bg-transparent hover:bg-zinc-200 text-zinc-500' : 'bg-white text-black'} text-[16px] w-full font-medium border-none no-outline`} >{file.replace('/', "")}</Button>
                })}
            </div>
            <div className='w-full h-full flex items-center bg-white rounded-xl overflow-hidden'>
                <div className='w-full h-full overflow-auto'>
                  {readOnly ? <SandpackCodeViewer showTabs={false} showLineNumbers code={actualFiles[actualActiveFile] && actualFiles[actualActiveFile].code}/> : <SandpackCodeEditor showLineNumbers showTabs={false} style={{width: '100%', height: '100%'}}/>}
                </div>
            </div>
            {/* </SplitterPanel>
            <SplitterPanel className='flex items-center w-full w-[200px]'> */}
            <div className='flex items-center min-w-[400px] h-full rounded-xl overflow-hidden'>
              <Splitter layout='vertical' style={{height: '100%'}} className='w-full'>
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
            </div>
            {/* </SplitterPanel>
          </Splitter> */}
          </div>
      </SandpackLayout>
  </SandpackProvider>
}