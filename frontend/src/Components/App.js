import React, { Component } from 'react';
import SplitterLayout from 'react-splitter-layout';

import { CodeEditor } from './CodeEditor';
import { WallPreview } from './WallPreview';
import initial_code from '!raw-loader!../initial_editor_content.js';
import { runCode, sendMessage } from '../code-runner';
import * as gamepad from '../gamepad';

const WIDTH = 10;
const HEIGHT = 20;

const initPixels = Array(HEIGHT).fill(Array(WIDTH).fill([0, 0, 0]));

export default class App extends Component {
  state = {
    pixels: initPixels,
    code: initial_code,
  };

  buffer = initPixels;

  render() {
    return (
      <SplitterLayout horizontal percentage secondaryInitialSize={30}>
        <CodeEditor code={this.state.code} onChange={this.onChangeCode} onRun={this.onRun} />
        <WallPreview pixels={this.state.pixels} />
      </SplitterLayout>
    );
  }

  constructor() {
    super();

    window.addEventListener('keydown', this.onKey);
    window.addEventListener('keyup', this.onKey);
    gamepad.startListening(this.onButton);
  }

  onButton = e => {
    sendMessage("key" + e.type, e.button);
  }

  onKey = e => {
    if (!e.repeat && e.path.length < 5) {
      // the target is not the code editor
      const match = e.code.match(/Arrow(.*)/g);
      if (match) sendMessage(e.type, match[0].replace('Arrow', '').toLowerCase());
    }
  };

  onChangeCode = code => {
    this.setState({
      code,
    });
  };

  onRun = () => {
    runCode(this.state.code, {
      setPixel: this.setPixel,
      clear: this.clear,
      draw: this.draw,
    });
  };

  clear = () => {
    this.buffer = initPixels;
  };

  setPixel = (x, y, color) => {
    this.buffer = this.buffer.map((row, yi) =>
      row.map((c, xi) => (xi === x && yi === y ? color : c))
    );
  };

  draw = () => {
    this.setState({
      pixels: this.buffer,
    });

    fetch('localhost:8765/setpixels', {
      method: 'POST',
      body: JSON.stringify(this.buffer),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  };
}
