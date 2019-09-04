import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import "./Home.css";
import { API } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";
import BountyItem from "../components/BountyItem";
import BountyItemTitle from "../components/BountyItemTitle";
import formatExpire from "../functions";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            bounties: [],
            statusChoice: "Active"
        };
    }

    updateStatusChoice = e => {
        const choice = e.target.value;
        this.setState(() => ({ statusChoice: choice }));
    };

    async componentDidMount() {
        try {
            const bounties = await this.bounties();
            const bountiesToSet = this.props.onlyUserBounties
                ? bounties.filter(bounty => {
                      return (
                          bounty.userId ===
                          this.props.userIdToken.idToken.payload[
                              "cognito:username"
                          ]
                      );
                  })
                : bounties;

            this.setState({ bounties: bountiesToSet });
        } catch (e) {
            alert(e);
        }
        this.setState({ isLoading: false });
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
                        <BountyItemTitle
                            statusChoice={this.state.statusChoice}
                            updateStatusChoice={this.updateStatusChoice}
                        />
                    </ListGroupItem>
                    {!this.state.isLoading &&
                        this.renderBountiesList(this.state.bounties)}
                </ListGroup>
            </div>
        );
    }

    renderBountiesList(bounties) {
        const checkBountyStatus = (exp, statusChoice) => {
            if (
                statusChoice === exp ||
                (statusChoice === "Active" && exp.includes("Expires"))
            ) {
                return true;
            } else {
                return false;
            }
        };
        return [{}].concat(bounties).map((bounty, i) =>
            i !== 0 &&
            checkBountyStatus(formatExpire(bounty), this.state.statusChoice) ? (
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
            ) : null
        );
    }

    render() {
        return <div className="Home">{this.renderBounties()}</div>;
    }
}
