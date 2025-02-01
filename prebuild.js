const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Path to your app.json file
const appJsonPath = path.join(__dirname, 'app.json');

// Read the app.json file
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));

// Merge environment variables into the existing `extra` object
appJson.expo.extra = {
  ...appJson.expo.extra, // Preserve existing `extra` fields
  firebase: {
    apiKey: process.env.EXPO_PUBLIC_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_APP_ID,
    measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID,
  },
};

// Write the updated app.json file
fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));

console.log('Environment variables injected into app.json');