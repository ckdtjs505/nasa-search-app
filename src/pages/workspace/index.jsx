import React from 'react';
import Header from './containers/Header';
import Search from './containers/Search';
import { Input, InputGroup, Container, Row, Col } from 'reactstrap';
import axios from 'axios';

import style from './style.scss';

class Workspace extends React.Component {

	render() {
		
		return (
			<div>
				<Header />
				<Search />
				
			</div>
		);
	}
}

export default Workspace;