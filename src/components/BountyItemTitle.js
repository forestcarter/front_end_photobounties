import React from "react";
import "./BountyItem.css";

function BountyItemTitle() {
	return (
		<div className='bountyItemFlex' id='bountyItemTitle'>
			<p className='title'><strong>Name</strong></p>
			<p className='exp'><strong>Expires in</strong></p>
			<p className='value'><strong>Value</strong></p>
		</div>
	)
  }

  export default BountyItemTitle;
