import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Chat from '../components/Chat';
import Login from '../components/Login';
import Logon from '../components/Logon';

function Routes() {
  return(
		<Router>
			<Switch>
				<Route exact path="/">
					<Chat />
				</Route>

				<Route exact path="/login">
					<Login />
				</Route>

				<Route exact path="/logon">
					<Logon />
				</Route>
			</Switch>
		</Router>
	);
}

export default Routes;