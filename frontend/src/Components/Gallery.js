import React, { Component } from 'react';

export default class App extends Component {
  state = {
    apps: []
  };

  render() {
    return (
      <div
        style={{
          display: 'flex'
        }}
      >
        {this.state.apps.forEach(app => (
          <div
            style={{
              
            }}
          >
            <h1>app.name</h1>
          </div>
        ))}
      </div>
    );
  }
}
