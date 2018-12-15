import React, { Component } from 'react';
import SplitterLayout from 'react-splitter-layout';

import { CodeEditor } from './CodeEditor';
import { WallPreview } from './WallPreview';
import initial_code from '!raw-loader!../initial_editor_content.js';
import { runCode } from '../code-runner';

const WIDTH = 10;
const HEIGHT = 20;

const initPixels = Array(HEIGHT).fill(Array(WIDTH).fill([0, 0, 0]));

export default class App extends Component {
  state = {
    pixels: initPixels,
    code: initial_code,
  }

  render() {
    return (
      <SplitterLayout horizontal percentage secondaryInitialSize={30}>
        <CodeEditor code={this.state.code} onChange={this.onChangeCode} onRun={this.onRun} />
        <WallPreview pixels={this.state.pixels} />
      </SplitterLayout>
    );
  }

  onChangeCode = (code) => {
    this.setState({
      code,
    });
  }

  onRun = () => {
    runCode(this.state.code, {
      setPixel: this.onSetPixel,
      clear: this.onClear,
    });
  }

  onSetPixel = (x, y, color) => {
    this.setState({

    });
  }

  onClear = () => {
    this.setState({
      pixels: initPixels,
    });
  }

  setPixel(x, y, color) {
    this.setState({
      pixels: this.state.pixels.map((row, yi) =>
        row.map((c, xi) => (xi === x && yi === y ? color : c))
      ),
    });
  }
}
