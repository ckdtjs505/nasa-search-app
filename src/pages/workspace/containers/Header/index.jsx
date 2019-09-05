import React from 'react';
import { DropdownToggle, UncontrolledDropdown, DropdownMenu, DropdownItem, InputGroup,Input } from 'reactstrap';
import axios from 'axios';
import style from './style.scss';

class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			userId: ''
		};
	}

	componentDidMount() {
		axios.get('/api/account/id').then(({ data }) => {
			this.setState({
				userId: data
			});
		});
	}

	signOut = () => {
		window.location.href = '/api/account/signout';
		alert('로그아웃 되었습니다');
	};
	
	favorites = () => {
		window.location.href = '/favorite';		
	};

	signin = () => {
		window.location.href = '/signin';
	};

 	render() {
		const { userId } = this.state;
		return (
			<div className={style.Header}>
				<div className={style.Dropdown}>
					<UncontrolledDropdown >
					<DropdownToggle caret tag="a" className={style.Header__dropdown}>
						{userId}
					</DropdownToggle>
					{
						userId == '' ?
						<DropdownMenu right>
							<DropdownItem onClick={this.signin}> 로그인</DropdownItem>
						</DropdownMenu>
						:
						<DropdownMenu right>
							<DropdownItem onClick={this.favorites}> 즐겨찾기</DropdownItem>
							<DropdownItem onClick={this.signOut}>로그아웃</DropdownItem>
						</DropdownMenu>
					}
					
				</UncontrolledDropdown>
				</div>
			</div>
		);
	}
}

export default Header;