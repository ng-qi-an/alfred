'use client';
import { 
  SandpackProvider, 
  SandpackLayout, 
  SandpackPreview, 
  SandpackCodeEditor,
  useSandpack,
  SandpackFileExplorer,
  SandpackConsole
} from "@codesandbox/sandpack-react";


import React, { useContext, useEffect } from 'react';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { MainContext } from "../layout";
import Editor from "@/components/Editor";
export default function Home(){
  const ctx = useContext(MainContext)
  return <div className="flex flex-col items-center justify-center h-screen px-[20px]">
      {/* <SandpackProvider template="static" theme={'light'} className='w-full w-full flex items-center'>
        <SandpackLayout style={{height: 'calc(100vh - 20px)', width: 'calc(100vw - 40px)'}}>
          <SandpackFileExplorer className='h-full'/>
          <Splitter style={{width: 'calc(100% - 202px)'}}>
            <SplitterPanel className='overflow-auto w-full' style={{height: 'calc(100vh - 20px)'}}>
              <CodeGetter/>
              <SandpackCodeEditor style={{width: '100%'}}/>
            </SplitterPanel>
            <SplitterPanel className='flex items-center w-full'>
              <div className='h-full w-[10px]'/>
              <Splitter layout='vertical' style={{height: '100%'}}>
                <SplitterPanel className='flex items-center flex-col'>
                  <SandpackPreview style={{width: '100%', height: '100%'}} showNavigator showRefreshButton={false} showOpenInCodeSandbox={false} />
                  <div className='w-full h-[10px]'/>
                </SplitterPanel>
                <SplitterPanel minSize={20}>
                  <SandpackConsole/>
                </SplitterPanel>
              </Splitter>
            </SplitterPanel>
          </Splitter>
        </SandpackLayout>
      </SandpackProvider> */}
      <Editor onFileChange={(file)=> ctx.socket.emit("syncSelectedFile", {activeFile: file, sender: ctx.socket.id})} onChange={(files)=> ctx.socket.emit('syncFiles', {'sender': ctx.socket.id, 'files': files})}/>
  </div>
}