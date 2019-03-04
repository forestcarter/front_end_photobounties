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
import {ListGroup, ListGroupItem } from "react-bootstrap";

export default class ViewBounty extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      isDeleting: null,
      bounty: null,
      content: ""
    };
  }

  async componentDidMount() {
    try {
      const bounty = await this.getBounty();
      this.setState({
        bounty:bounty,
	  });
    } catch (e) {
      alert(e);
    }
  }

  getBounty() {
    return API.get("bounties", `/bounties/${this.props.match.params.userId}/${this.props.match.params.bountyId}`);
  }
  
  formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }
  
  
  
  handleFileChange = event => {
    this.file = event.target.files[0];
  }
  
  handleSubmit = async event => {
	event.preventDefault();
	
	if (!this.file) {
		alert(`Please Select a File`);
		return;
	  }

    if (this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`);
      return;
    }

    this.setState({ isLoading: true });

    try {
      const attachment = this.file
        ? await s3Upload(this.file)
		: null;
	if (attachment){
		alert("Photo Submitted")
	}else{
		alert("Photo not submitted")
	}

      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }
  
  render() {
    return (
      <div className="bounties">
        {this.state.bounty &&
          <form onSubmit={this.handleSubmit}>
			<FormGroup controlId="content">
			<ListGroup>
				<ListGroupItem>
					<BountyItemTitle />
				</ListGroupItem>
				<ListGroupItem>
					<BountyItem 
						title={this.state.bounty.title}
						exp={formatExpire(this.state.bounty.expiration)}
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
		  
		  <FormGroup controlId="file">
		  <ControlLabel>Photo</ControlLabel>
		  <FormControl onChange={this.handleFileChange} type="file" />
		</FormGroup>
            
            <LoaderButton
              block
              bsStyle="primary"
              bsSize="large"
              type="submit"
			  isLoading={this.state.isLoading}
			  disabled={!this.props.isAuthenticated}
              text={this.props.isAuthenticated?"Claim Bounty":"Sign in to Claim Bounty"}
              loadingText="Submitting Claim..."
            />
            
          </form>}
      </div>
    );
  }
}