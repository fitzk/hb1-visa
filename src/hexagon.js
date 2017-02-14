import React, { Component } from 'react';

export class Hexagon extends Component {
	constructor(){ super() }
	// draws hexagon given starting coordinates
	// and a radius
  getCoordinates(x, y, r) {
    let n = 6;
    let path = ""
    for(let i =0; i < n; i++){
    	if(i !== 0) path = path.concat(" ")
      path = path.concat(`${ Math.abs(x + r * Math.cos(2 * Math.PI * i / n))
																 .toFixed(2)},${Math.abs(y + r * Math.sin(2 * Math.PI * i / n))
																	 									.toFixed(2)}`)
    }
    return path;
  }
	render() {
	 let { x, y, r, fill, className, callback, children } = this.props;
   let path = this.getCoordinates( x, y, r );
   return <polygon className={ className }
		 							 fill={ fill }
                   onClick={ callback }
                   points={ path }>{ children }</polygon>
								 }
}
