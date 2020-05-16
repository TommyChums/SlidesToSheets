const { google } = require('googleapis');

// This method looks for the GCLOUD_PROJECT and GOOGLE_APPLICATION_CREDENTIALS
// environment variables.
const GetAuthGoogle = async () => {
  const auth = new google.auth.GoogleAuth({
    // Scopes can be specified either as an array or as a single, space-delimited string.
    scopes: [
      'https://www.googleapis.com/auth/drive'
    ]
  });
  
  const authClient = await auth.getClient();
  
  google.options({
    auth: authClient,
  });

  return google;
};

module.exports = GetAuthGoogle;
