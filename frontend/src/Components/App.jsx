import React from 'react';
import { gql } from 'apollo-boost';
import nanoid from 'nanoid';

import GameEditor from './GameEditor';
import Gallery from './Gallery';
import { client } from '../backend';

const CREATE_USER = gql`
  mutation($username: String!, $password: String!) {
    register(username: $username, password: $password) {
      _id
    }
  }
`;

const LOGIN_USER = gql`
  mutation($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      accessToken
    }
  }
`;

export default class App extends React.Component {
  state = {
    selectedGame: null,
  };

  async componentDidMount() {
    let username = localStorage.getItem('username');
    let password = localStorage.getItem('password');

    if (!username || !password) {
      username = nanoid(10);
      password = nanoid(20);
      localStorage.setItem('username', username);
      localStorage.setItem('password', password);

      if (!localStorage.getItem('token')) {
        await client.mutate({ mutation: CREATE_USER, variables: { username, password } });
      }
    }

    await client
      .mutate({ mutation: LOGIN_USER, variables: { username, password } })
      .then(({ data }) => {
        localStorage.setItem('accessToken', data.login.accessToken);
      });
  }

  render() {
    if (this.state.selectedGame != null) {
      return (
        <GameEditor
          viewGallery={() => this.setState({ selectedGame: null })}
          gameId={this.state.selectedGame}
        />
      );
    } else {
      return <Gallery onSelectGame={id => this.setState({ selectedGame: id })} />;
    }
  }
}
