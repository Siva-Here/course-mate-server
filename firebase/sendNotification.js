const { JWT } = require('google-auth-library');
const axios = require('axios');
const SCOPES = ["https://www.googleapis.com/auth/firebase.messaging"];

const client = new JWT({
  email: process.env.JWT_CLIENT_EMAIL,
  key: process.env.JWT_CLIENT_KEY,
  scopes: SCOPES

});

let cachedAccessToken = null;

async function getAccessToken() {
  if (cachedAccessToken) {
    return cachedAccessToken;
  }

  try {
    const tokens = await client.authorize();
    console.log("\n" + tokens.access_token);
    cachedAccessToken = tokens.access_token;
    return cachedAccessToken;
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw error; // Handle or rethrow the error as needed
  }
}

async function sendFcmMessage(tokens, title, body) {
  const accessToken = await getAccessToken();
  const url = `https://fcm.googleapis.com/v1/projects/test-project-push-1efd3/messages:send`;
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json; UTF-8"
  };

  // Prepare an array of message requests for each token
  const messageRequests = tokens.map(token => ({
    message: {
      token: token,
      notification: {
        title: title,
        body: body
      }
    }
  }));

  // Send multiple FCM messages in parallel
  const promises = messageRequests.map(messageRequest =>
    axios.post(url, messageRequest, { headers })
  );

  try {
    const responses = await Promise.all(promises);
    const success = responses.every(response => response.status === 200);
    if (success) {
      console.log("Notifications sent successfully");
      return true;
    } else {
      console.error("Failed to send some notifications");
      return false;
    }
  } catch (error) {
    console.error("Error sending FCM messages:", error.response ? error.response.data : error.message);
    return false;
  }
}

module.exports = { sendFcmMessage };
