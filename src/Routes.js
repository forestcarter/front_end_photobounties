import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import Login from "./containers/Login";
import NotFound from "./containers/NotFound";
import AppliedRoute from "./components/AppliedRoute";
import Signup from "./containers/Signup";
import NewBounty from "./containers/NewBounty";
import ViewBounty from "./containers/ViewBounty";
import MyBounties from "./containers/MyBounties";

//import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import Splash from "./containers/Splash";


export default ({ childProps }) =>
  <Switch>
	<Route path="/" exact component={Splash} props={childProps} />
    <Route path="/home" exact component={Home} props={childProps} />	
    <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
    <UnauthenticatedRoute path="/signup" exact component={Signup} props={childProps} />
	<Route path="/bounties/:userId/:bountyId" exact component={ViewBounty} props={childProps} />

	<AppliedRoute path="/new" exact component={NewBounty} props={childProps} />
	<AppliedRoute path="/mybounties" exact component={MyBounties} props={childProps} />

    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;