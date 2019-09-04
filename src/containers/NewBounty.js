import React, { Component } from "react";
import {
    FormGroup,
    FormControl,
    ControlLabel,
    Form,
    Col
} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./NewBounty.css";
import { API } from "aws-amplify";

export default class NewBounty extends Component {
    constructor(props) {
        super(props);

        this.file = null;

        this.state = {
            isLoading: null,
            title: "",
            description: "",
            value: "",
            hours: "",
            days: ""
        };
    }

    validateForm() {
        return this.state.description.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    handleSubmit = async event => {
        event.preventDefault();

        this.setState({ isLoading: true });
        try {
            await this.createBounty({
                title: this.state.title,
                description: this.state.description,
                value: this.state.value,
                hours: this.state.hours,
                days: this.state.days,
                email: this.props.userIdToken.idToken.payload.email,
                userId: this.props.userIdToken.idToken.payload[
                    "cognito:username"
                ]
            });
            this.props.history.push("/");
        } catch (e) {
            alert(e);
            this.setState({ isLoading: false });
        }
    };

    createBounty(bounty) {
        return API.post("bounties", "/bounties", {
            body: bounty
        });
    }

    render() {
        return (
            <div className="NewBounty">
                <Form horizontal onSubmit={this.handleSubmit}>
                    <FormGroup controlId="title">
                        <ControlLabel>Title</ControlLabel>
                        <FormControl
                            type="text"
                            onChange={this.handleChange}
                            value={this.state.title}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Col componentClass={ControlLabel} xs={2}>
                            Value
                        </Col>
                        <Col xs={2} className="colInput">
                            <FormControl
                                id="value"
                                type="number"
                                min="1"
                                className="numberInput"
                                onChange={this.handleChange}
                                value={this.state.value}
                            />
                        </Col>

                        <Col
                            className="active"
                            componentClass={ControlLabel}
                            xs={2}
                        >
                            Days Active:
                        </Col>

                        <Col xs={2} className="colInput">
                            <FormControl
                                id="days"
                                type="number"
                                min="0"
                                className="numberInput"
                                onChange={this.handleChange}
                                value={this.state.days}
                            />
                        </Col>
                        <Col
                            className="active"
                            componentClass={ControlLabel}
                            xs={2}
                        >
                            Hours Active:
                        </Col>

                        <Col xs={2} className="colInput">
                            <FormControl
                                id="hours"
                                min="0"
                                type="number"
                                className="numberInput"
                                onChange={this.handleChange}
                                value={this.state.hours}
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup controlId="description">
                        <ControlLabel>Description</ControlLabel>
                        <FormControl
                            onChange={this.handleChange}
                            value={this.state.description}
                            componentClass="textarea"
                        />
                    </FormGroup>

                    <LoaderButton
                        className="submitButton"
                        block
                        bsStyle="primary"
                        bsSize="large"
                        disabled={
                            !this.validateForm() || !this.props.isAuthenticated
                        }
                        type="submit"
                        isLoading={this.state.isLoading}
                        text={
                            this.props.isAuthenticated
                                ? "Post Bounty"
                                : "Sign in to Post Bounty"
                        }
                        loadingText="Posting..."
                    />
                </Form>
            </div>
        );
    }
}
