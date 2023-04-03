import { initializeApp, getApp, getApps } from "firebase/app";
import "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyADm8WkBXG0258zXOfM3lVFdtL__JM97po",
  authDomain: "publicly-app.firebaseapp.com",
  projectId: "publicly-app",
  storageBucket: "publicly-app.appspot.com",
  messagingSenderId: "139920072271",
  appId: "1:139920072271:web:dc29de077e2c7e9c7a543a",
  measurementId: "G-8Z4LDT58XT",
};

const app =
  getApps().length === 0
    ? initializeApp({ ...firebaseConfig, projectId: firebaseConfig?.projectId })
    : /*: initializeApp(
        { ...firebaseConfig, projectId: firebaseConfig?.projectId },
        "publiclyApp" + getApps().length + 1
      );*/
      getApp();
const db = getFirestore(app);

export { app, db };
