import Home from "../containers/Home";
import React from "react";

	function MyBounties(props) {
		return <Home
			onlyUserBounties={true}
			userIdToken={props.userIdToken}
		/>;
}

export default MyBounties;