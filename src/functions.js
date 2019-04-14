
export default function formatExpire(bounty) {
	if(bounty.posterDispute===false){
		return "Accepted"
	} 
	if(bounty.posterDispute===true){
		return "Disputed"
	}
	if(bounty.submission){
		return "Claimed"
	} 
	
    const expDate = new Date(bounty.expiration).getTime() - new Date().getTime();
    const days = Math.round(expDate / (24 * 60 * 60 * 1000));
    const hours = Math.round(
        (expDate % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
    );
    const minutes = Math.round(
        ((expDate % (24 * 60 * 60 * 1000)) % (60 * 60 * 1000)) / (60 * 1000)
	);
	
    const dateTimeDisplay =
        days > 1
            ? `${days} Days`
            : hours > 1
            ? `${hours} Hours`
            : minutes > 0
            ? `${minutes} Minutes`
            : "Expired";
    return dateTimeDisplay;
}

