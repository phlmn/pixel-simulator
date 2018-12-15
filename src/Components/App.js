import React, { Component } from 'react';
import SplitterLayout from 'react-splitter-layout';

import { CodeEditor } from './CodeEditor';
import { WallPreview } from './WallPreview';

const WIDTH = 10;
const HEIGHT = 20;

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      pixels: Array(HEIGHT).fill(Array(WIDTH).fill([0, 0, 0]))
    }
  }

  render() {
    return (
      <SplitterLayout horizontal percentage secondaryInitialSize={30}>
            <CodeEditor onChange={newValue => console.log(newValue)} />
            <WallPreview pixels={this.state.pixels}></WallPreview>
      </SplitterLayout>
    );
  }
}
