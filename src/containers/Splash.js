import React from "react";
import "./Splash.css";

export default () => (
    <div className="splashDiv">
        <h2 id="splashTitle">Welcome to Photo Bounties!</h2>
        <div id="categories">
            <div className="categoryDiv" id="posterDiv">
                <h3 className="categoryTitles">Posters</h3>
                <ul className="categoryList">
                    <li>Pick a descriptive title.</li>
                    <li>Choose how much it's worth to you.</li>
                    <li>Set an expiration date.</li>
                    <li>Describe your requirements.</li>
                    <li>
                        Sit back and watch as the power of <br />
                        crowd-sourcing delivers your perfect photo.
                    </li>
                </ul>
            </div>

            <div className="categoryDiv" id="hunterDiv">
                <h3 className="categoryTitles">Hunters</h3>
                <ul className="categoryList">
                    <li>Browse the list of active bounties.</li>
                    <li>Pick one that looks interesting...</li>
                    <li>Read the requirements.</li>
                    <li>Snap and submit the photo.</li>
                    <li>Profit!</li>
                    <li>Rinse and repeat.</li>
                </ul>
            </div>
        </div>
    </div>
);
