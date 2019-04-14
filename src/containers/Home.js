import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import "./Home.css";
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
			var filtered = bounties.filter((bounty)=>{
				return true
			});

            this.setState({ bounties : filtered });
        } catch (e) {
            alert(e);
        }
        this.setState({ isLoading : false });
    }

    bounties() {
        return API.get("bounties", "/bounties");
	}

	renderBounties() {
		return (
		  <div className="bounties">
			<PageHeader>Bounties</PageHeader>
			<ListGroup>
				<ListGroupItem>
					<BountyItemTitle/>
				</ListGroupItem>
			  {!this.state.isLoading && this.renderBountiesList(this.state.bounties)}
			</ListGroup>
		  </div>
		);
	  }

	  
	renderBountiesList(bounties) {
		console.log(bounties)
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


