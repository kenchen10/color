import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Slider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {}
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    let h = event.target.value;
    this.setState({h: h});
    let hsl = "hsl("+h+",100%,50%)";
    this.setState({washBackground: "-webkit-linear-gradient(top,black,transparent),"+
                "-webkit-linear-gradient(left,white,"+hsl+")"});
  }
  render() {
    return (
      <div>
        <input className="hue" type="range" min='0' max='360' onChange={this.handleChange}/>
        <Gradient washBackground={this.state.washBackground}/>
      </div>
    );
  }
}

class Display extends React.Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  render() {
    return (
      <div id='swatch' style={{background: this.props.color}}></div>
    );
  }
}

class Interpolate extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  interpolateColor(color1, color2, factor) {
    var result = color1.slice();
    for (var i = 0; i < 3; i++) {
        result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
    }
    return result;
  };

  interpolateColors(color1, color2, steps) {
    var stepFactor = 1 / (steps - 1);
    var interpolatedColorArray = [];

    color1 = color1.match(/\d+/g).map(Number);
    color2 = color2.match(/\d+/g).map(Number);

    for (var i = 0; i < steps; i++) {
        interpolatedColorArray.push(this.interpolateColor(color1, color2, stepFactor * i));
    }

    return interpolatedColorArray;
  }

  render() {
    let retArr = [];
    let color1 = "rgb(23, 172, 100)";
    let color2 = "rgb(131, 12, 22)";
    let steps = 3;
    let interpArr = this.interpolateColors(color1, color2, steps);
    let w = 200 / steps;
    // let pad = 10;
    for (let i = 0; i < steps; i++) {
      retArr.push(<div id="interpolate" key={i} style={{
        background: `rgb(${interpArr[i][0]}, ${interpArr[i][1]}, ${interpArr[i][2]})`,
        width: w,
        // marginRight: `${pad}px`,
        right: "10px"
      }}></div>)
    }
    return (
      <div id="interpDiv">{retArr}</div>
    )
  }
}

class Gradient extends React.Component {
  constructor(props) {
    super(props);

    this.state = {}
    this.pickColorHSV = this.pickColorHSV.bind(this);
    // this.myInput = React.createRef();
  }

  hslToRgb(h, s, l) {
    var r, g, b;
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      var hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      }

      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;

      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return [ r * 255, g * 255, b * 255 ];
  }

  pickColorHSV(event) {
      var t = document.querySelector(".washHSV").getBoundingClientRect()
      this.sat = Math.round(event.nativeEvent.offsetX / t.width * 100) / 100;
      var val = Math.round((event.nativeEvent.offsetY / t.height) * 100) / 100;
      this.hue =  document.querySelector(".hue").value;
      this.l = Math.round(.5*val*(2-this.sat) * 100) / 100;
      var styleStr =  "hsl(" + parseInt(this.hue, 10) + "," + parseInt(this.sat*100, 10) + "%," + parseInt(this.l*100, 10) + "%)"
      this.setState({styleStr: styleStr});
      this.rgb = this.hslToRgb(parseInt(this.hue, 10) / 360, this.sat, this.l);
  }

  render() {
    return (
      <div>
        <div className='washHSV' style={{background: this.props.washBackground}} onClick={this.pickColorHSV} />
        <Interpolate/>
        <table>
          <tbody>
            <tr>
              <td><Display color={this.state.styleStr}/></td>
              <td>
                <div className="inputs">
                  <span id="ipt"><input type="text" id="hue" defaultValue={this.hue} /></span>
                  <span id="ipt"><input type="text" id="sat" defaultValue={this.sat} /></span>
                  <span id="ipt"><input type="text" id="l" defaultValue={this.l} /></span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

class ColorPicker extends React.Component {
  render() {
    return (
      <div className="picker">
        <Slider />
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <ColorPicker />,
  document.getElementById('root')
);
