import React from 'react';
import MonacoEditor from 'react-monaco-editor';

export function CodeEditor({ code, onChange, onRun }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: '0 0 50px' }}>
        <button type="button" onClick={onRun}>
          Run
        </button>
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
