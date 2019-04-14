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
import HowItWorks from "./containers/howitworks";


export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
    <UnauthenticatedRoute path="/signup" exact component={Signup} props={childProps} />
    <UnauthenticatedRoute path="/howitworks" exact component={HowItWorks} props={childProps} />
	<AppliedRoute path="/bounties/:userId/:bountyId" exact component={ViewBounty} props={childProps} />

	<AppliedRoute path="/new" exact component={NewBounty} props={childProps} />
	<AppliedRoute path="/mybounties" exact component={MyBounties} props={childProps} />

    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;