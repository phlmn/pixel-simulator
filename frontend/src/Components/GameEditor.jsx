import React, { Component } from 'react';
import SplitterLayout from 'react-splitter-layout';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';

import { WallPreview } from './WallPreview';
import { runCode, sendMessage } from '../code-runner';
import * as gamepad from '../gamepad';

import MonacoEditor from 'react-monaco-editor';
import { IoMdApps, IoMdPlay, IoMdCloudUpload } from 'react-icons/io';
import { client } from '../backend';

const WIDTH = 10;
const HEIGHT = 10;

const initPixels = Array(HEIGHT).fill(Array(WIDTH).fill([0, 0, 0]));

const GET_GAME = gql`
  query($id: String!) {
    game(id: $id) {
      title
      code
    }
  }
`;

const UPDATE_GAME = gql`
  mutation($id:String!,$data:GameUpdate!){
    updateGame(id:$id,data:$data){
    _id
    }
  }
`

export default class GameEditor extends Component {
  state = {
    pixels: initPixels,
    title: undefined,
    code: undefined,
  };

  buffer = initPixels;

  render() {
    return (
      <Query query={GET_GAME} variables={{ id: this.props.gameId }}>
        {({ data }) => {
          if (!data.game) return null;
          return (
            <SplitterLayout horizontal percentage secondaryInitialSize={30}>
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div
                  style={{
                    flex: '0 0 50px',
                    display: 'flex',
                    alignItems: 'center',
                    color: '#fff',
                    justifyContent: 'space-between',
                    margin: '0 20px',
                    fontSize: '30px',
                  }}
                >
                  <div>
                    <IoMdApps onClick={() => this.props.viewGallery()} />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={this.state.title === undefined ? data.game.title : this.state.title}
                      onChange={v => this.setState({ title: v.currentTarget.value })}
                      placeholder="Enter Title"
                      style={{
                        color: 'inherit',
                        background: 'inherit',
                        border: 'none',
                        fontSize: 'inherit',
                        marginRight: '10px',
                        padding: '0 10px',
                        textAlign: 'center',
                      }}
                    />
                  </div>
                  <div>
                    <IoMdCloudUpload style={{ marginRight: '20px' }} />
                    <IoMdPlay onClick={this.onRun} id="play" />
                  </div>
                </div>
                <div className="monaco" style={{ height: '100%', overflow: 'hidden' }}>
                  <MonacoEditor
                    language="javascript"
                    theme="vs-dark"
                    value={this.state.code === undefined ? data.game.code : this.state.code}
                    onChange={this.onChange}
                    editorDidMount={editor => {
                      editor.focus();
                    }}
                    options={{ automaticLayout: true }}
                  />
                </div>
              </div>
              <WallPreview pixels={this.state.pixels} />
            </SplitterLayout>
          );
        }}
      </Query>
    );
  }

  constructor() {
    super();

    window.addEventListener('keydown', this.onKey);
    window.addEventListener('keyup', this.onKey);
    gamepad.startListening(this.onButton);
  }

  onUploadCode() {
    client.mutate({mutation: UPDATE_GAME})
  }

  onButton = e => {
    sendMessage('key' + e.type, e.button);
  };

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
    this.clear();
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

    if (!window.location.hash) return;
    fetch('http://localhost:8765/setpixels', {
      method: 'POST',
      body: JSON.stringify(this.buffer),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };
}
