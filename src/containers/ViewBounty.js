import React, { Component } from "react";
import { API, Storage } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./ViewBounty.css";
import formatExpire from "../functions";
import { s3Upload } from "../libs/awsLib";
import BountyItem from "../components/BountyItem";
import BountyItemTitle from "../components/BountyItemTitle";
import { ListGroup, ListGroupItem } from "react-bootstrap";

export default class ViewBounty extends Component {
    constructor(props) {
        super(props);
        this.file = null;

        this.state = {
			acceptBounty: true,
			acceptDispute: true,
            review: false,
            isPoster: false,
            isClaimer: false,
            isLoading: null,
            isDeleting: null,
            bounty: null,
            content: "",
            submissionURL: null,
            disputeThanksText: null
        };
    }
    handleOptionChange = e => {
        if (e.target.checked) {
            this.setState(prevState => ({
                acceptBounty: !prevState.acceptBounty
            }));
        }
	};
	
	handleDisputeOptionChange = e => {
        if (e.target.checked) {
            this.setState(prevState => ({
                acceptDispute: !prevState.acceptDispute
            }));
        }
    };

    handleTextChange = event => {
        this.setState({
            disputeThanksText: event.target.value
        });
    };

    async componentDidMount() {
        try {
			const bounty = await this.getBounty();
			const fakebounty= {
				bountyId: "70a5d110-597d-11e9-8e18-273e82ff726f",
				claimer: "forest.carter@gmail.com",
				claimerDispute: null,
				createdAt: 1554673090721,
				description: "6",
				expiration: 1555213090720,
				posterDispute: true,
				posterDisputeText: 'it was trash',
				submission: '1554683538738-del.jpg',
				title: "6",
				userId: "forest.carter7@gmail.com",
				value: "6"
			}
            if (bounty.submission) {
                const submissionURL = await Storage.vault.get(
                    bounty.submission
                );
                this.setState({
                    review: true,
                    submissionURL: submissionURL
				});
				
            }
            const isPoster =
                bounty.userId === this.props.userIdToken.idToken.payload.email;
            const isClaimer =
				bounty.claimer === this.props.userIdToken.idToken.payload.email;
				
				
            this.setState({
                bounty: bounty,
                isPoster,
                isClaimer,
			});
                
            console.log(bounty);
        } catch (e) {
            alert(e);
        }
    }

    getBounty() {
        return API.get(
            "bounties",
            `/bounties/${this.props.match.params.userId}/${
                this.props.match.params.bountyId
            }`
        );
    }

    attachSubmission(attachment) {
        return API.put("bounties", "/bounties", {
            body: {
                userId: this.props.userIdToken.idToken.payload.email,
                bountyId: this.props.match.params.bountyId,
                submission: attachment,
                claiming: true
            }
        });
    }
    submitText(accept, text) {
        return API.put("bounties", "/bounties", {
            body: {
                userId: this.props.userIdToken.idToken.payload.email,
                bountyId: this.props.match.params.bountyId,
                claiming: false,
                posterDispute: !accept,
                posterDisputeText: text
            }
        });
    }
    formatFilename(str) {
        return str.replace(/^\w+-/, "");
    }

    handleFileChange = event => {
        this.file = event.target.files[0];
    };

    handleSubmit = async event => {
        event.preventDefault();
        if (this.state.review) {
            this.setState({ isLoading: true });
            try {
                this.submitText(
                    this.state.acceptBounty,
                    this.state.disputeThanksText
                );
                this.props.history.push("/");
            } catch (e) {
                alert(e);
                this.setState({ isLoading: false });
            }
        } else {
            if (!this.file) {
                alert(`Please Select a File`);
                return;
            }
            if (this.file.size > config.MAX_ATTACHMENT_SIZE) {
                alert(
                    `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE /
                        1000000} MB.`
                );
                return;
            }
            this.setState({ isLoading: true });
            try {
                const attachment = this.file ? await s3Upload(this.file) : null;
                if (attachment) {
                    this.attachSubmission(attachment);
                    alert("Bounty submitted");
                } else {
                    alert("Bounty not submitted");
                }

                this.props.history.push("/");
            } catch (e) {
                alert(e);
                this.setState({ isLoading: false });
            }
        }
    };

    render() {
        return (
            <div className="bounties">
                {this.state.bounty && (
                    <form onSubmit={this.handleSubmit}>
                        <FormGroup controlId="content">
                            <ListGroup>
                                <ListGroupItem>
                                    <BountyItemTitle />
                                </ListGroupItem>
                                <ListGroupItem>
                                    <BountyItem
                                        title={this.state.bounty.title}
                                        exp={formatExpire(this.state.bounty)}
                                        value={this.state.bounty.value}
                                    />
                                </ListGroupItem>
                            </ListGroup>
                        </FormGroup>
                        <FormGroup controlId="description">
                            <ControlLabel>Description</ControlLabel>
                            <FormControl
                                value={this.state.bounty.description}
                                componentClass="textarea"
                                readOnly={true}
                            />
                        </FormGroup>

                        {this.state.review === false ? (
                            <div>
                                <FormGroup controlId="file">
                                    <ControlLabel>Photo</ControlLabel>
                                    <FormControl
                                        onChange={this.handleFileChange}
                                        type="file"
                                    />
                                </FormGroup>

                                <LoaderButton
                                    block
                                    bsStyle="primary"
                                    bsSize="large"
                                    type="submit"
                                    isLoading={this.state.isLoading}
                                    disabled={
                                        !(
                                            this.props.isAuthenticated && !this.state.isPoster &&
                                            formatExpire(
                                                this.state.bounty
                                            ).includes(" ")
                                        )
                                    }
                                    text={
                                        this.props.isAuthenticated
                                            ? "Claim Bounty"
                                            : "Sign in to Claim Bounty"
                                    }
                                    loadingText="Submitting Claim..."
                                />
                            </div>
                        ) : (
                            <div>
                                <FormGroup>
                                    <ControlLabel>Submitted Photo</ControlLabel>
                                    <FormControl.Static>
                                        <a
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href={this.state.submissionURL}
                                        >
                                            {this.formatFilename(
                                                this.state.bounty.submission
                                            )}
                                        </a>
                                    </FormControl.Static>
                                </FormGroup>
                                {this.state.isPoster && (
									<div>
                                    {this.state.bounty.posterDispute ===
											null && (
											<div>
												<div className="form-check">
													<label>
														<input
															type="radio"
															name="react-tips"
															value="option1"
															checked={
																this.state
																	.acceptBounty ===
																true
															}
															className="form-check-input"
															onChange={
																this
																	.handleOptionChange
															}
														/>
														Accept Bounty
													</label>
												</div>

												<div className="form-check">
													<label>
														<input
															type="radio"
															name="react-tips"
															value="option2"
															className="form-check-input"
															checked={
																this.state
																	.acceptBounty ===
																false
															}
															onChange={
																this
																	.handleOptionChange
															}
														/>
														Dispute Bounty
													</label>
												</div>

												<FormGroup controlId="description">
													<ControlLabel />
													<FormControl
														onChange={
															this.handleTextChange
														}
														componentClass="textarea"
														placeholder={
															this.state.acceptBounty
																? "Thank you note"
																: "Describe why you are disputing the submitted bounty"
														}
													/>
												</FormGroup>

												<LoaderButton
													block
													bsStyle="primary"
													bsSize="large"
													type="submit"
													isLoading={this.state.isLoading}
													text={
														this.state.acceptBounty
															? "Accept Bounty"
															: "Dispute Bounty"
													}
													loadingText="Submitting ..."
												/>
											</div>
										)}
									

									{this.state.bounty.posterDispute ===
											false && (
											<div>
												<h1>Accepted</h1>
											</div>
										)}

									{ this.state.bounty.posterDispute ===
											true && (
											<div>
												<h1>Disputed</h1>
											</div>
										)}
									</div>
								)}								
                                {this.state.isClaimer && (
									<div>

									<FormGroup controlId="description">
										<ControlLabel>Poster's Comments</ControlLabel>
									<FormControl
											componentClass="textarea"
											value={this.state.bounty.posterDisputeText}
											readOnly
										/>
									</FormGroup>
 
                                        {this.state.bounty.claimerDispute ===
                                            null && (
                                            <div>
                                                <div className="form-check">
                                                    <label>
                                                        <input
                                                            type="radio"
                                                            name="react-tips"
                                                            value="option1"
                                                            checked={
                                                                this.state
                                                                    .acceptDispute ===
                                                                true
                                                            }
                                                            className="form-check-input"
                                                            onChange={
                                                                this.handleDisputeOptionChange
                                                            }
                                                        />
                                                        Accept Dispute
                                                    </label>
                                                </div>

                                                <div className="form-check">
                                                    <label>
                                                        <input
                                                            type="radio"
                                                            name="react-tips"
                                                            value="option2"
                                                            className="form-check-input"
                                                            checked={
                                                                this.state
                                                                    .acceptDispute ===
                                                                false
                                                            }
                                                            onChange={
                                                                this.handleDisputeOptionChange
                                                            }
                                                        />
                                                        Reject Dispute
                                                    </label>
                                                </div>

                                                <FormGroup controlId="description">
                                                    <ControlLabel />
                                                    <FormControl
                                                        onChange={
                                                            this
                                                                .handleTextChange
                                                        }
                                                        componentClass="textarea"
                                                        placeholder={
                                                            this.state
                                                                .acceptBounty
                                                                ? "Comments"
                                                                : "Describe why you are rejecting the dispute"
                                                        }
                                                    />
                                                </FormGroup>

                                                <LoaderButton
                                                    block
                                                    bsStyle="primary"
                                                    bsSize="large"
                                                    type="submit"
                                                    isLoading={
                                                        this.state.isLoading
                                                    }
                                                    text={
                                                        this.state.acceptDispute
                                                            ? "Accept Dispute"
                                                            : "Reject Dispute"
                                                    }
                                                    loadingText="Submitting ..."
                                                />
                                            </div>
                                        )}

                                        {this.state.bounty.claimerDispute ===
                                            false && (
                                            <div>
                                                <h1>Dispute Accepted</h1>
                                            </div>
                                        )}

                                        {this.state.bounty.claimerDispute ===
                                            true && (
                                            <div>
                                                <h1>Dispute Rejected</h1>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </form>
                )}
            </div>
        );
    }
}
