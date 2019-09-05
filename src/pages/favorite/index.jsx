import React from 'react';
import axios from 'axios';
import Header from '../workspace/containers/Header';
import Navi from './containers/Navi'
import Search from './containers/Search'
import style from './style.scss';

class favorite extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			userid : ""
		};

    }

	componentDidMount() {
		axios.get('/api/account/id').then(({ data }) => {
			this.setState({
				userId: data
			});
		});
	}
	
	render() {		
		return (
			<div>
				<Header />
				<h1 className={style.h1}> {this.state.userId} 님</h1>
				<Navi/>
				<Search/>
			
			</div>
		);
	}
}

export default favorite;


