'use client';

import { Splitter, SplitterPanel } from 'primereact/splitter';
import { 
    SandpackProvider, 
    SandpackLayout, 
    SandpackPreview, 
    SandpackCodeEditor,
    useSandpack,
    SandpackFileExplorer,
    SandpackConsole
} from "@codesandbox/sandpack-react";
import { useEffect } from "react";
import { Button } from 'primereact/button';

export default function Editor({onChange=()=>{}, files:ffiles}){
    function CodeGetter(){
        const { sandpack } = useSandpack();
        const { files, activeFile } = sandpack;
        useEffect(()=>{
          if (files){
            onChange(files)
          }
        }, [files])
        return <></>
    }
    return <SandpackProvider template="static" theme={'light'} files={ffiles} className='w-full w-full flex items-center'>
        <SandpackLayout style={{height: 'calc(100vh - 20px)', width: 'calc(100vw - 40px)'}}>
          {/* <SandpackFileExplorer className='h-full'/> */}
          <Splitter style={{width: 'calc(100%)'}}>
            <SplitterPanel className='overflow-auto w-full' style={{height: 'calc(100vh - 20px)'}}>
              <CodeGetter/>
              <SandpackCodeEditor showTabs={false} style={{width: '100%'}}/>
            </SplitterPanel>
            <SplitterPanel className='flex items-center w-full'>
              <div className='h-full w-[10px]'/>
              <Splitter layout='vertical' style={{height: '100%'}}>
                <SplitterPanel className='flex items-center flex-col'>
                  <SandpackPreview actionsChildren={<div className='flex items-center pr-4'><Button size={"small"}>Console</Button></div>} style={{width: '100%', height: '100%'}} showNavigator showRefreshButton={false} showOpenInCodeSandbox={false} />
                  <div className='w-full h-[10px]'/>
                </SplitterPanel>
                <SplitterPanel minSize={20} size={5}>
                  <SandpackConsole/>
                </SplitterPanel>
              </Splitter>
            </SplitterPanel>
          </Splitter>
        </SandpackLayout>
    </SandpackProvider>
}