import React from 'react';
import MonacoEditor from 'react-monaco-editor';
import { IoMdApps, IoMdPlay } from 'react-icons/io';

export function CodeEditor({ code, onChange, onRun }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        flex: '0 0 50px', 
        display: 'flex',
        alignItems: 'center',
        color: '#fff',
        justifyContent: 'space-between',  
        margin: '0 20px',
        fontSize: '30px',
      }}>
        <div>
          <IoMdApps />
        </div>
        <input type='text' />
        <div>
          <IoMdPlay onClick={onRun}></IoMdPlay>
        </div>
      </div>
      <div className="monaco" style={{ height: '100%', overflow: 'hidden' }}>
        <MonacoEditor
          language="javascript"
          theme="vs-dark"
          value={code}
          onChange={onChange}
          editorDidMount={editor => {
            editor.focus();
          }}
          options={{ automaticLayout: true }}
        />
      </div>
    </div>
  );
}
