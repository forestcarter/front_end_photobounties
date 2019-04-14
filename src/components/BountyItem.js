import React from "react";
import "./BountyItem.css";

function BountyItem(props) {

	const expStyle = {
		color: props.exp==="Claimed" ? "green" 
		: props.exp==="Expired" ? "red"
		: props.exp==="Disputed" ? "purple" 
		: "",
		};

return (
	<div className='bountyItemFlex'>
		<p className='title'>{props.title}</p>
		<p className='exp' style={expStyle}>{props.exp}</p>
		<p className='value'>${props.value}</p>
	</div>
)
}

export default BountyItem;
