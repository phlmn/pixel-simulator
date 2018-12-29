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

export default function Gallery ({onSelectGame}) {
  return (
    <div style={{textAlign: "center"}}>
      <h1 style={{color: "white"}}>PIXELWALL GAME GALLERY</h1>
      <div
      style={{
        display: 'flex',
      }}
    >
      <Query query={GET_GAMES}>
        {({ data }) => {
          if (!data.games) return null;

          return [...data.games, {title: "+"}].map((app, i) => (
            <div style={{}} key={i} style={{
              width: "300px",
              height: "300px",
              backgroundColor: "#fff",
              margin: "20px",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
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
