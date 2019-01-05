import React, { Component } from 'react';
import ReactResizeDetector from 'react-resize-detector';

export class WallPreview extends Component {
  render() {
    const { pixels } = this.props;
    const aspectratio = pixels.length / pixels[0].length;

    return (
      <ReactResizeDetector handleWidth handleHeight>
        {(width, height) => (
          <div
            style={{
              backgroundColor: '#1E1E1E',
              height: '100%',
              width: '100%',
              ...this.props.style,
            }}
          >
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
                {pixels.map((row, y) => (
                  <tr key={y}>
                    {row.map((cell, x) => (
                      <td
                        key={x}
                        style={{
                          backgroundColor: this.arr2color(cell),
                          borderRadius: '3px',
                          boxShadow: `inset 0px 0px 25px -3px rgba(10,10,10,${this.arrBrightness(
                            cell
                          ) *
                            0.6 +
                            0.2}),
                            0 0 10px -1px ${this.arr2color(cell, true)}`,
                        }}
                        title={`(${x} , ${y})`}
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
