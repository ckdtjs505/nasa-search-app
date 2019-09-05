import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Favorite from 'pages/favorite';

const App = props => (
	<Switch>
		<Route exact path={['/','/favorite']} render={() => <Favorite {...props} />} />
	</Switch>
);
export default App;