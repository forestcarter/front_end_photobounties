import React from "react";

function StaffRuling(props) {



return (
	<div >
	{props.ruledForPoster==null?
		<p>Our staff is reviewing the dispute</p>:
		props.ruledForPoster===true?
			<div>
				<h6>Our staff has ruled that the submission was invalid and bounty will be canceled</h6>
				<p>{props.staffText}</p>
			</div>	
			:
			<div>
				<h6>Our staff ruled that the submission was valid. The bounty will go to the claimer</h6>
				<p>{props.staffText}</p>
			</div>
	}
		
	</div>
)
}

export default StaffRuling;
