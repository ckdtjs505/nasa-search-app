import React from 'react';
import { Nav, NavItem, NavLink} from 'reactstrap';

import style from './style.scss';

class Navi extends React.Component {

	render() {
		return (
			<div>
				<Nav tabs className={style.nav}>
					<NavItem>
						<NavLink href="https://mission-ckdtjs505-pxsod.run.goorm.io/" >Home</NavLink>
					</NavItem>
					<NavItem>
						<NavLink href="#" active>Favorite</NavLink>
					</NavItem>
				</Nav>
				
			</div>
		);
	}
}

export default Navi;


