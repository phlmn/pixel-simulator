import React from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';

const GET_GAMES = gql`
  {
    games {
      _id
      title
    }
  }
`;

export default function Gallery({ onSelectGame }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ color: 'white', margin: '3rem 0', textTransform: 'uppercase' }}>
        Pixelwall Game Gallery
      </h1>
      <div
        style={{
          display: 'flex',
          marginTop: '-20px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <Query query={GET_GAMES} fetchPolicy="cache-and-network">
          {({ data }) => {
            if (!data.games) return null;

            return [...data.games, { title: '+', _id: 'new' }].map((app, i) => (
              <div
                style={{}}
                key={i}
                style={{
                  width: '300px',
                  color: '#fff',
                  height: '300px',
                  backgroundColor: '#444',
                  margin: '20px',
                  textAlign: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  cursor: 'pointer',
                }}
                onClick={() => onSelectGame(app._id)}
              >
                <h1>{app.title}</h1>
              </div>
            ));
          }}
        </Query>
      </div>
    </div>
  );
}
