
export default function formatExpire(exp) {
	
    const expDate = new Date(exp).getTime() - new Date().getTime();
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

