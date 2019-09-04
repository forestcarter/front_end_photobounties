import React, { Component, Fragment } from "react";
import { LinkContainer } from "react-router-bootstrap";
import "./App.css";
import Routes from "./Routes";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { Auth, API } from "aws-amplify";
import config from "./config";
import Email from "./components/Email"
import UserCredit from "./components/UserCredit"


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: false,
            isAuthenticating: true,
			userIdToken: null,
			attempts:1
        };
    }

    async componentDidMount() {
        this.loadFacebookSDK();
        try {
            let userIdToken = await Auth.currentSession();
            this.setUserIdToken(userIdToken);
			this.userHasAuthenticated(true);
        } catch (e) {
            if (e !== "No current user") {
                alert(e);
            }
        }
		this.setState({ isAuthenticating: false });
	}
	
	
    loadFacebookSDK() {
        window.fbAsyncInit = function() {
            window.FB.init({
                appId: config.social.FB,
                autoLogAppEvents: true,
                xfbml: true,
                version: "v3.1"
            });
        };

        (function(d, s, id) {
            var js,
                fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        })(document, "script", "facebook-jssdk");
    }

    userHasAuthenticated = (authenticated) => {
		this.setState({ isAuthenticated: authenticated });
	    };

    setUserIdToken = async userIdToken => {
		this.setState({ userIdToken: userIdToken });
		const userCredit = await API.get("bounties", "/credit");
		this.setState({ userIdToken: userIdToken, userCredit:userCredit.credit }); 
    };

    handleLogout = async event => {
        await Auth.signOut();
		this.userHasAuthenticated(false);
		this.setUserIdToken(null)
        this.props.history.push("/login");
    };

    handleNewBounty = event => {
        this.props.history.push("/new");
    };

    handleMyBounties = event => {
        this.props.history.push("/mybounties");
    };

    render() {
        const childProps = {
            isAuthenticated: this.state.isAuthenticated,
            userHasAuthenticated: this.userHasAuthenticated,
			userIdToken: this.state.userIdToken,
			setUserIdToken:this.setUserIdToken
			
		};		
        return (
            !this.state.isAuthenticating && (
                <div className="App container">
                    <Navbar fluid collapseOnSelect>
                        <Navbar.Header>
                            <Navbar.Brand>
                                <Link to="/">Bounties</Link>
                            </Navbar.Brand>
                            <Navbar.Toggle />
                        </Navbar.Header>
                        <Navbar.Collapse>
                            <Nav pullRight>
                                {this.state.isAuthenticated ? (
                                    <Fragment>
										<NavItem
											onClick={this.handleMyBounties}
										>
											<UserCredit
												userCredit={this.state.userIdToken?this.state.userCredit:''} 
											/>
										</NavItem>
                                        <NavItem
                                            onClick={this.handleMyBounties}
										>
										<Email
											email={this.state.userIdToken?this.state.userIdToken.idToken.payload.email:''}
											
										/>
										
										</NavItem>
                                        <NavItem onClick={this.handleNewBounty}>
                                            Post Bounty
                                        </NavItem>
                                        <NavItem onClick={this.handleLogout}>
                                            Logout
                                        </NavItem>
                                    </Fragment>
                                ) : (
                                    <Fragment>
                                        <LinkContainer to="/signup">
                                            <NavItem>Signup</NavItem>
                                        </LinkContainer>
                                        <LinkContainer to="/login">
                                            <NavItem>Login</NavItem>
                                        </LinkContainer>
                                    </Fragment>
                                )}
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                    <Routes childProps={childProps} />
                </div>
            )
        );
    }
}

export default withRouter(App);
