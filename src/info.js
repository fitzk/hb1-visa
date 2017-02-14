import React, { Component } from 'react';
import styled from "styled-components"

const Container = styled.div`
	height: 100px;
`;

const Sub = styled.div`
	color: white;
	font-family: sans-serif;
`;
const Company = styled(Sub)`
	font-size: 2rem;
	color: yellow;
`;
class Info extends Component {
	constructor(){ super() }

	render(){
		return <Container>
			   <Company>{ this.props.sponsor }</Company>
				 <Sub>{`RANK ${this.props.x} | TOTAL LCA ${this.props.y}`}</Sub>
	 </Container>
	 }
}

export { Info }
