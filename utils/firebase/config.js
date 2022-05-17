import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDbS0yH5CfFPlbBEHEJm_I_uA3BjzOv4ms",
  authDomain: "gloader-349706.firebaseapp.com",
  projectId: "gloader-349706",
  storageBucket: "gloader-349706.appspot.com",
  messagingSenderId: "346457672075",
  appId: "1:346457672075:web:1409c5c7616ed50573878e",
  measurementId: "G-YJ0W5EV3VR",
};

const fireApp = initializeApp(firebaseConfig);
export const firedb = getFirestore(fireApp);
