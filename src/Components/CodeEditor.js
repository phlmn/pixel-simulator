import React from 'react';
import MonacoEditor from 'react-monaco-editor';

export function CodeEditor ({ code, onChange, onRun }) {
    return (
      <div className="code-editor">
        <div>
          <button type="button" onClick={onRun}>Run</button>
        </div>
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
    );
  }
