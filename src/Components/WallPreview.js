import React, { Component } from 'react';
import ReactResizeDetector from 'react-resize-detector';

export class WallPreview extends Component {
  render() {
    const { pixels } = this.props;
    const aspectratio = pixels.length / pixels[0].length;

    return (
      <ReactResizeDetector handleWidth handleHeight>
        {(width, height) => (
          <div style={{ backgroundColor: '#1E1E1E', height: '100%', width: '100%' }}>
            <table
              style={{
                width: '100%',
                height: '100%',
                padding: '10px',

                maxWidth: `${height / aspectratio}px`,
                maxHeight: `${width * aspectratio}px`,

                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <tbody>
                {pixels.map(row => (
                  <tr>
                    {row.map(cell => (
                      <td
                        style={{
                          backgroundColor: `rgb(${cell.map(v => v * 255).join(',')})`,
                          border: `2px solid`,
                          borderColor: '#a0522d',
                          borderRadius: '3px',
                          boxShadow: 'inset 0px 0px 25px -3px rgba(10,10,10,.5)',
                        }}
                      />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ReactResizeDetector>
    );
  }
}
