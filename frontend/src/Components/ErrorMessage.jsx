import React from 'react';

export function ErrorMessage({ text, style = {} }) {
  return (
    <div
      style={{
        background: 'red',
        padding: '15px 10px',
        color: '#fff',
        width: '100%',
        zIndex: 10,
        ...style,
      }}
    >
      {text}
    </div>
  );
}
