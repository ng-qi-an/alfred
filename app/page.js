'use client';
import { Button } from 'primereact/button';
import Editor from '@monaco-editor/react';
import { 
  SandpackProvider, 
  SandpackLayout, 
  SandpackPreview, 
  SandpackCodeEditor,
  useSandpack
} from "@codesandbox/sandpack-react";
import React, { useEffect, useRef } from 'react';
export default function Home(){
  function CodeGetter(){
    const { sandpack } = useSandpack();
    const { files, activeFile } = sandpack;
    useEffect(()=>{
      if (files[activeFile].code){
        console.log(files[activeFile].code)
      }
      return ()=>{
      }
    }, [files[activeFile].code])
    return <>e</>
  }
  return <div className="flex flex-col items-center justify-center h-screen">
      {/* <Editor
          
          height="90vh"
          theme="light"
          options={{
            "acceptSuggestionOnCommitCharacter": true,
            "acceptSuggestionOnEnter": "on",
            "accessibilitySupport": "auto",
            "autoIndent": false,
            "automaticLayout": true,
            "codeLens": true,
            "colorDecorators": true,
            "contextmenu": true,
            "cursorBlinking": "blink",
            "cursorSmoothCaretAnimation": true,
            "cursorStyle": "line",
            "disableLayerHinting": false,
            "disableMonospaceOptimizations": false,
            "dragAndDrop": false,
            "fixedOverflowWidgets": false,
            "folding": true,
            "foldingStrategy": "auto",
            "fontLigatures": false,
            "formatOnPaste": false,
            "formatOnType": false,
            "hideCursorInOverviewRuler": false,
            "highlightActiveIndentGuide": true,
            "links": true,
            "mouseWheelZoom": false,
            "multiCursorMergeOverlapping": true,
            "multiCursorModifier": "alt",
            "overviewRulerBorder": true,
            "overviewRulerLanes": 2,
            "quickSuggestions": true,
            "quickSuggestionsDelay": 100,
            "readOnly": false,
            "renderControlCharacters": false,
            "renderFinalNewline": true,
            "renderIndentGuides": true,
            "renderLineHighlight": "all",
            "renderWhitespace": "none",
            "revealHorizontalRightPadding": 30,
            "roundedSelection": true,
            "rulers": [],
            "scrollBeyondLastColumn": 5,
            "scrollBeyondLastLine": true,
            "selectOnLineNumbers": true,
            "selectionClipboard": true,
            "selectionHighlight": true,
            "showFoldingControls": "mouseover",
            "smoothScrolling": true,
            "suggestOnTriggerCharacters": true,
            "wordBasedSuggestions": true,
            "wordSeparators": "~!@#$%^&*()-=+[{]}|;:'\",.<>/?",
            "wordWrap": "off",
            "wordWrapBreakAfterCharacters": "\t})]?|&,;",
            "wordWrapBreakBeforeCharacters": "{([+",
            "wordWrapBreakObtrusiveCharacters": ".",
            "wordWrapColumn": 80,
            "wordWrapMinified": true,
            "wrappingIndent": "none"
          }}
          defaultLanguage="html"
          defaultValue="<h1>hello</h1>"
          onMount={(editor, monaco) => {
            editorRef.current = editor;
            editor.onKeyDown((event) => {
              // select enabled languages
              const enabledLanguages = ["html", "markdown", "javascript", "typescript"]; // enable js & ts for jsx & tsx
          
              const model = editor.getModel();
              if (!enabledLanguages.includes(model.getLanguageId())) {
                return;
              }
          
              const isSelfClosing = (tag) =>
                [
                  "area",
                  "base",
                  "br",
                  "col",
                  "command",
                  "embed",
                  "hr",
                  "img",
                  "input",
                  "keygen",
                  "link",
                  "meta",
                  "param",
                  "source",
                  "track",
                  "wbr",
                  "circle",
                  "ellipse",
                  "line",
                  "path",
                  "polygon",
                  "polyline",
                  "rect",
                  "stop",
                  "use",
                ].includes(tag);
          
              // when the user enters '>'
              if (event.browserEvent.key === ">") {
                const currentSelections = editor.getSelections();
          
                const edits = [];
                const newSelections = [];
                // potentially insert the ending tag at each of the selections
                for (const selection of currentSelections) {
                  // shift the selection over by one to account for the new character
                  newSelections.push(
                    new monaco.Selection(
                      selection.selectionStartLineNumber,
                      selection.selectionStartColumn + 1,
                      selection.endLineNumber,
                      selection.endColumn + 1,
                    ),
                  );
                  // grab the content before the cursor
                  const contentBeforeChange = model.getValueInRange({
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: selection.endLineNumber,
                    endColumn: selection.endColumn,
                  });
          
                  // if ends with a HTML tag we are currently closing
                  const match = contentBeforeChange.match(/<([\w-]+)(?![^>]*\/>)[^>]*$/);
                  if (!match) {
                    continue;
                  }
          
                  const [fullMatch, tag] = match;
          
                  // skip self-closing tags like <br> or <img>
                  if (isSelfClosing(tag) || fullMatch.trim().endsWith("/")) {
                    continue;
                  }
          
                  // add in the closing tag
                  edits.push({
                    range: {
                      startLineNumber: selection.endLineNumber,
                      startColumn: selection.endColumn + 1, // add 1 to offset for the inserting '>' character
                      endLineNumber: selection.endLineNumber,
                      endColumn: selection.endColumn + 1,
                    },
                    text: `</${tag}>`,
                  });
                }
          
                // wait for next tick to avoid it being an invalid operation
                setTimeout(() => {
                  editor.executeEdits(model.getValue(), edits, newSelections);
                }, 0);
              }
            });
          }}
      /> */}
      <SandpackProvider template="static" theme={'light'}>
        <SandpackLayout>
          <CodeGetter/>
          <SandpackCodeEditor/>
          <SandpackPreview/>
        </SandpackLayout>
      </SandpackProvider>
  </div>
}