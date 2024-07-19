'use client';
import { Button } from 'primereact/button';
import Editor from '@monaco-editor/react';
import { 
  SandpackProvider, 
  SandpackLayout, 
  SandpackPreview, 
  SandpackCodeEditor,
  useSandpack,
  SandpackFileExplorer,
  SandpackConsole
} from "@codesandbox/sandpack-react";


import React, { useEffect } from 'react';
import { Splitter, SplitterPanel } from 'primereact/splitter';
export default function Home(){
  function CodeGetter(){
    const { sandpack } = useSandpack();
    const { files, activeFile } = sandpack;
    useEffect(()=>{
      if (files[activeFile].code){
        console.log(files[activeFile].code)
      }
    }, [files[activeFile].code])
    return <></>
  }
  return <div className="flex flex-col items-center justify-center h-screen px-[20px]">
      <SandpackProvider template="static" theme={'light'} className='w-full w-full flex items-center'>
        <SandpackLayout style={{height: 'calc(100vh - 20px)', width: 'calc(100vw - 40px)'}}>
          <SandpackFileExplorer className='h-full'/>
          <Splitter style={{width: 'calc(100% - 202px)'}}>
            <SplitterPanel className='overflow-auto w-full'>
              <CodeGetter/>
              <SandpackCodeEditor style={{width: '100%'}}/>
            </SplitterPanel>
            <SplitterPanel className='flex items-center w-full'>
              <div className='h-full w-[10px]'/>
              <Splitter layout='vertical' style={{height: '100%'}}>
                <SplitterPanel className='flex items-center flex-col'>
                  <SandpackPreview style={{width: '100%', height: '100%'}} showNavigator showRefreshButton={false} showOpenInCodeSandbox={false} />
                  <div className='w-full h-[10px] bg-blue-500'/>
                </SplitterPanel>
                <SplitterPanel minSize={20}>
                  <SandpackConsole/>
                </SplitterPanel>
              </Splitter>
            </SplitterPanel>
          </Splitter>
        </SandpackLayout>
      </SandpackProvider>
  </div>
}