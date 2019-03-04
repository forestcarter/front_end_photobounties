import React from "react";

function BountyItem(props) {
return (
	<div className='bountyItemFlex'>
		<p className='title'>{props.title}</p>
		<p className='exp'>{props.exp}</p>
		<p className='value'>${props.value}</p>
	</div>
)
}

export default BountyItem;
