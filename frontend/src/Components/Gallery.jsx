import React from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import { WallPreview, WallPreviewInner } from './WallPreview';
import { initPixels } from './GameEditor';

const GET_GAMES = gql`
  {
    games {
      _id
      title
      preview
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

            return [{ title: '+', _id: 'new' }, ...data.games].map((app, i) => (
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
                  position: 'relative',
                }}
                onClick={() => onSelectGame(app._id)}
              >
                <h1 style={{position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: '100%', margin: 0}}>{app.title}</h1>
                <WallPreviewInner pixels={app.preview || initPixels} style={{width: '100%', height: '100%'}}/>
              </div>
            ));
          }}
        </Query>
      </div>
    </div>
  );
}
