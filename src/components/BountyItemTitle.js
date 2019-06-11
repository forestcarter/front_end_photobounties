import React from "react";
import "./BountyItem.css";

function BountyItemTitle(props) {
	return (
		<div className='bountyItemFlex' id='bountyItemTitle'>
			<p className='title'><strong>Name</strong></p>
			<div className="form-group  exp">
				<select
				name="status"
				id="statusSelect"
				defaultValue={props.statusChoice}
				onChange={props.updateStatusChoice}
				className="form-control"
				>
				<option value="Active">Active</option>
				<option value="Claimed">Claimed</option>
				<option value="Expired">Expired</option>
				<option value="Disputed">Disputed</option>
				</select>
			</div>
			<p className='value'><strong>Value</strong></p>
		</div>
	)
  }

  export default BountyItemTitle;
