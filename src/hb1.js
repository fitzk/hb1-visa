import React, { Component } from 'react';
import * as d3 from 'd3';
import styled, { injectGlobal } from 'styled-components';
import { top100 } from "data/json"
import { Row, Column } from "src/flex"
import { Hexagon } from "./hexagon"
import { Info } from "./info"

injectGlobal`
  body {
    width: 100vw;
    height: 100vh;
    padding: 0;
    margin: 0;
  }
  .hex:hover{
      fill: white;
  }
`;

const Header = styled(Column)`
  font-family: sans-serif;
  margin: 10px;
  color: white;
`
const Tooltip = styled.span`
  visibility: collapse;


&:hover {
    visibility: visible;
    color: #c00;
    text-decoration: none;
}

&:hover:after {
  visibility: visible;

    background: #111;
    background: rgba(0,0,0,.8);
    border-radius: .5em;
    bottom: 1.35em;
    color: #fff;
    content: ${props => props.content};
    display: block;
    left: 1em;
    padding: .3em 1em;
    position: absolute;
    text-shadow: 0 1px 0 #000;
    white-space: nowrap;
    z-index: 98;
}

&:hover:before {
  visibility: visible;
  border: solid;
  border-color: #111 transparent;
  border-color: rgba(0,0,0,.8) transparent;
  border-width: .4em .4em 0 .4em;
  bottom: 1em;
  content: "";
  display: block;
  left: 2em;
  position: absolute;
  z-index: 99;
}
`
const Container = styled(Column)`
  width: 100vw;
  height: 100vh;
  overflow: auto;
  background-color: black;
`;

const H3 = styled.h3`
  margin:0;
`;

export default class HB1 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      order: "descending",
      sponsor: "",
      x: 0,
      y: 0,
      xTranslate: 600,
      yTranslate: 900,
      hexagonRadiusLowerBound: 5,
      hexagonRadiusUpperBound: 450,
      spiralRadiusLowerBound: 50,
      spiralRadiusUpperBoundExtra: 500 // full upper bound is calucated with addition of radius
    }
  }

  // set selected coordinates and sponsor
  updateSelected(x, y, sponsor){
    this.setState({
      sponsor: sponsor,
      x: x,
      y: y
    });
  }

  componentDidMount() {
    let data = top100.data;
    this.setState({ data: data })
  }

  // draw hexagon svg
  drawHexagon({ x, y, r, fill, index, className, callback }) {
    return <Hexagon key={ index }
                       className={ className }
                       fill={ fill }
                       x={ x }
                       y={ y }
                       callback={ callback }
                       r={ r }/>
  }

  drawSpiral(data, scale, curve, r) {
    let angle = d3.scaleLinear()
              .domain(d3.extent(data))
              .range([1, 360])
    let spiral = d3.radialLine()
    .radius(( d, i ) => scale(d))
    .angle(( d, i ) =>  angle(d))
    .curve(curve)
    return spiral(data)
  }

  createDisjointPaths(path) {
    let paths = path.split('C').map((p, i) => {
      let _path = p
      if(i !== 0) {
        let points = p.split(',').slice(0).map(str => parseFloat(str))
        let move = `M${points[0]},${points[1]}`
         _path = move + 'C ' + p
      }
      return _path
      });
    return paths
  }
  stringToInt(d){ return parseInt(d.split(',').join('')) }

  drawHexagons(paths, data, scaleHex){

    let hexagons = []
    let c = d3.hsl("#680E4B")

    for(let path of paths) {
     let points = path.slice(1, path.length-1)
                 .split(',')
                 .map(str => parseFloat(str)),
         index = paths.indexOf(path),
         rank = parseInt(data[index].rank),
         x = points[0] + this.state.xTranslate, // translate x
         y = points[1] + this.state.yTranslate, // translate y
         className = "hex";

     let numLCA = this.stringToInt(data[index].number_of_lca);
     let r = scaleHex(numLCA);
     c.h += 1; c.s += 0.1; c.opacity = 0.8;

     let callback = this.updateSelected.bind(this, rank,
                                             data[index].number_of_lca,
                                             data[index].hb1_visa_sponsor);
     let hex = this.drawHexagon({
       x: x, y: y ,
       r:r, fill: c + "",
       index: data[index].rank,
       className: className,
       callback: callback
     });
     hexagons.push(hex);
    }
    return hexagons
  }

  drawLayout(data, width, height) {

    let curve = d3.curveCardinal.tension(0.5);

    // radius of the spiral
    let r = d3.min([ width, height ]) - 50,

        // pull lca data from set
        points = data.map(d => this.stringToInt(d.number_of_lca)),

        // get max and min lca
        extent = d3.extent(points),

        // map data to radius
        scale = d3.scaleLinear()
                  .domain(extent)
                  .range([ this.state.spiralRadiusLowerBound,
                           r ]),

        // get the full path of the spiral
        path = this.drawSpiral(points, scale, curve, r),

        // get sub paths
        paths = this.createDisjointPaths(path),

        // map # of LCA per company -> smaller range
        scaleHexagonRadius = d3.scaleLinear()
                               .domain(extent)
                               .range([ this.state.hexagonRadiusLowerBound,
                                        this.state.hexagonRadiusUpperBound ])

    return this.drawHexagons(paths, data, scaleHexagonRadius)
  }

  render() {
    let width=800, height=1600
    return this.state.data.length > 0 ? <Container>
                <Column>
                  <Header>
                    <h1>Top 100 HB1 Visa Sponsors</h1>
                  </Header>
                  <Info sponsor={this.state.sponsor} x={this.state.x} y={this.state.y}/>
               </Column>
                <svg viewBox="100 100 1500 1700" width="100%" height="100%">
                { this.drawLayout(this.state.data, width, height) }
                </svg>
           </Container> : <div>loading...</div>
  }
}
