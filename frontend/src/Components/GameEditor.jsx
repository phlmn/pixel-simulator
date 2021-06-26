import React, { Component } from 'react';
import SplitterLayout from 'react-splitter-layout';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import Editor from '@monaco-editor/react';
import { IoMdApps, IoMdPlay, IoMdCloudUpload } from 'react-icons/io';

import { WallPreview } from './WallPreview';
import { runCode, sendMessage } from '../code-runner';
import * as gamepad from '../gamepad';
import { client } from '../backend';
import { ErrorMessage } from './ErrorMessage';
import { WebSerial } from './WebSerial';

const initialCode = require('fs').readFileSync(
  __dirname + '/../initial_editor_content.js',
  'utf-8'
);

const WIDTH = 10;
const HEIGHT = 10;

export const initPixels = Array(HEIGHT).fill(Array(WIDTH).fill([0, 0, 0]));

const GET_GAME = gql`
  query($id: String!) {
    game(id: $id) {
      title
      code
    }
  }
`;

const UPDATE_GAME = gql`
  mutation($id: String!, $data: GameUpdate!) {
    updateGame(id: $id, data: $data) {
      _id
      title
      code
    }
  }
`;

const CREATE_GAME = gql`
  mutation($data: GameUpdate!) {
    createGame(data: $data) {
      _id
      title
      code
    }
  }
`;

export default class GameEditor extends Component {
  state = {
    pixels: initPixels,
    title: undefined,
    code: undefined,
    error: null,
  };

  code = '';
  title = '';

  buffer = initPixels;

  renderInner = game => {
    this.title = this.state.title || game.title || '';
    this.code = this.state.code || game.code || '';

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
                value={this.title}
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
              <IoMdCloudUpload onClick={this.onUploadCode} style={{ marginRight: '20px' }} />
              <IoMdPlay onClick={() => this.onRun(this.code)} id="play" />
            </div>
          </div>
          <div className="monaco" style={{ height: '100%', overflow: 'hidden' }}>
            <Editor
              language="javascript"
              theme="vs-dark"
              value={this.code}
              onChange={this.onChangeCode}
            />
          </div>
        </div>
        <div
          style={{
            height: '100%',
          }}
        >
          {this.state.error && (
            <ErrorMessage
              style={{
                position: 'absolute',
              }}
              text={this.state.error}
            />
          )}
          <WebSerial />
          <WallPreview style={{}} pixels={this.state.pixels} />
        </div>
      </SplitterLayout>
    );
  };

  render() {
    if (this.props.gameId === 'new') {
      return this.renderInner({ code: initialCode });
    } else {
      return (
        <Query
          query={GET_GAME}
          variables={{ id: this.props.gameId }}
          fetchPolicy="cache-and-network"
        >
          {({ data }) => {
            if (!data.game) return null;
            return this.renderInner(data.game);
          }}
        </Query>
      );
    }
  }

  constructor() {
    super();

    window.addEventListener('keydown', this.onKey);
    window.addEventListener('keyup', this.onKey);
    gamepad.startListening(this.onButton);
  }

  generatePreview = pixels => {
    return pixels.map(row => {
      return row.map(col => col);
    });
  };

  onUploadCode = async () => {
    if (this.props.gameId === 'new') {
      const createData = {
        title: this.title,
        code: this.code,
        preview: this.generatePreview(this.state.pixels),
      };
      const { data } = await client.mutate({
        mutation: CREATE_GAME,
        variables: { data: createData },
      });
    } else {
      const update = {
        preview: this.generatePreview(this.state.pixels),
      };
      if (this.state.title) update.title = this.state.title;
      if (this.state.code) update.code = this.state.code;

      await client.mutate({
        mutation: UPDATE_GAME,
        variables: { id: this.props.gameId, data: update },
      });
    }
  };

  onButton = e => {
    sendMessage('key' + e.type, e.button);
  };

  onKey = e => {
    if (!e.repeat && (e.path ? e.path.length < 5 : true)) {
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

  onRun = code => {
    this.clear();
    this.clearError();
    runCode(code, {
      setPixel: this.setPixel,
      clear: this.clear,
      draw: this.draw,
      onError: this.handleError,
    });
  };

  clear = () => {
    this.buffer = initPixels;
  };

  handleError = message => {
    this.setState({ error: message });
  };

  clearError = () => {
    this.setState({ error: null });
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

  arr2color(arr, transparency) {
    const min = 45;
    const max = 255;

    if (transparency) {
      return `rgb(${arr.map(v => min + v * (max - min)).join(',')}, ${this.arrBrightness(arr)})`;
    } else {
      return `rgb(${arr.map(v => min + v * (max - min)).join(',')})`;
    }
  }

  arrBrightness(arr) {
    return arr.reduce((a, b) => (a + b) / 3);
  }
}
