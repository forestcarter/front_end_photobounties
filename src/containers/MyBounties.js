import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import "./MyBounties.css";
import { API } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";
import BountyItem from "../components/BountyItem";
import BountyItemTitle from "../components/BountyItemTitle";
import formatExpire from "../functions";

//import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";


export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            bounties: []
        };
	}
	
    async componentDidMount() {
        try {
            const bounties = await this.bounties();
            this.setState({ bounties : bounties });
        } catch (e) {
            alert(e);
        }
        this.setState({ isLoading : false });
    }

    bounties() {
        return API.get("bounties", "/bounties");
	}

	renderBounties() {
		const postedBounties = this.state.bounties.filter((bounty)=>{
			return bounty.userId===this.props.userIdToken.idToken.payload['cognito:username']
		})
		const claimedBounties = this.state.bounties.filter((bounty)=>{
			return bounty.claimer===this.props.userIdToken.idToken.payload['cognito:username']
		})
		console.log(this.state.bounties)
		return (
		  <div className="bounties">
			<PageHeader>Posted Bounties</PageHeader>
			<ListGroup>
				<ListGroupItem>
					<BountyItemTitle/>
				</ListGroupItem>
			  {!this.state.isLoading && this.renderBountiesList(postedBounties)}
			</ListGroup>
			<PageHeader>Claimed Bounties</PageHeader>
			<ListGroup>
				<ListGroupItem>
					<BountyItemTitle/>
				</ListGroupItem>
			  {!this.state.isLoading && this.renderBountiesList(claimedBounties)}
			</ListGroup>
		  </div>
		);
	  }

	  
	renderBountiesList(bounties) {

		return [{}].concat(bounties).map(
		  (bounty, i) =>
		  i !== 0 ?
			<LinkContainer
				key={bounty.bountyId}
				to={`/bounties/${bounty.userId}/${bounty.bountyId}`}
			>
			<ListGroupItem>
				<BountyItem 
					title={bounty.title}
					exp={formatExpire(bounty)}
					value={bounty.value}
					/>
              </ListGroupItem>
			</LinkContainer>
			:null
		);
	  }

    render() {
        return (
			<div className="Home">
				{this.renderBounties()}
            </div>
        );
    }
}


