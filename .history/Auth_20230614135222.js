console.log(`%c Auth.js started`, "color: #f94144");

//! Dropbox credentials
const dropboxClientId = "n14p112tw7ajvwj"; // API key
const clientSecret = "iac9xvqrbqipafg"; // API secret
const redirectHomeUrl = "http://127.0.0.1:5501/index.html"; // your redirect URI http://localhost:3000/testRoute/index.html

// Get token from local storage
let accessToken = localStorage.getItem("massDL");

// Stores token right after verification from the dashboard page
if (accessToken === "null") {
    const hashParams = new URLSearchParams(window.location.hash.substr(1)); // extracts everything after "#" in the URL
    accessToken = hashParams.get("access_token"); // save token to variable from URL
    localStorage.setItem("massDL", accessToken); // Save the new token to local storage
    console.log(`%c Token stored to localStorage`, "color: #a7c957");
}


//!Extract the token from the URL when redirected from Dropbox
console.log('redirectHomeUrl', redirectHomeUrl)
if (window.location.pathname === redirectHomeUrl) {
    const hashParams = new URLSearchParams(window.location.hash.substr(1));// extracts everything after "#" in the URL
    const newAccessToken = hashParams.get("access_token");// save token to variable from URL
    localStorage.setItem("massDL", newAccessToken);    // Save the new token to local storage
    console.log(`%c Token stored to localStorage`, "color: #a7c957");
}



// DBX object
const dbx = new Dropbox.Dropbox({
    clientId: dropboxClientId,
    clientSecret: clientSecret,
    accessToken: accessToken,
});

checkToken(dbx);

//! Step 1: Check token validity
async function checkToken(dbx) {

    try {
        console.log(`%c Checking token`, "color: #f078c0");
        await dbx.usersGetCurrentAccount();
        console.log(`%c Access token is still valid`, "color: #7cb518");
    } catch (error) {
        console.log(error)
        console.log(`%c Access token expired or is invalid`, "color: #f94144");
        const getToken = confirm(`
    Tokens only last 4 hours. 
    This token might have expired. 
    Or the authentication was interrupted.
    
    Proceeding to "Auth" to get a new token?.
    `);

        if (getToken) {
            localStorage.setItem("massDL", null);
            auth2Flow(); //! If token is invalid, get a new one (Step 2)
        }
    }
}

//! Step 2: If needed, get access
function auth2Flow() {
    console.log(`%c Auth2Flow`, "color: red");

    // Remove the token from the URL
    history.replaceState({}, document.title, window.location.href.split("#")[0]);

    // Redirect the user to the authorization URL
    const authUrl = "https://www.dropbox.com/oauth2/authorize" +
        "?response_type=token" +
        "&client_id=" +
        dropboxClientId +
        "&redirect_uri=" +
        encodeURIComponent(redirectHomeUrl);
    window.location.href = authUrl;
}


console.log(`%c Auth.js ended`, "color: #f94144");