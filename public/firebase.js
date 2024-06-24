// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";


// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyDpR0oLGwvfGNKDzgvviP--kvq-td2x2vc",

  authDomain: "verify-4e82c.firebaseapp.com",

  projectId: "verify-4e82c",

  storageBucket: "verify-4e82c.appspot.com",

  messagingSenderId: "951433489051",

  appId: "1:951433489051:web:859232860c4b6f4cf9343e",

  measurementId: "G-9SEH3F1YDN"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

// const analytics = getAnalytics(app);
export default app;