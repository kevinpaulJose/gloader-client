import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  // apiKey: "AIzaSyDbS0yH5CfFPlbBEHEJm_I_uA3BjzOv4ms",
  // authDomain: "gloader-349706.firebaseapp.com",
  // projectId: "gloader-349706",
  // storageBucket: "gloader-349706.appspot.com",
  // messagingSenderId: "346457672075",
  // appId: "1:346457672075:web:1409c5c7616ed50573878e",
  // measurementId: "G-YJ0W5EV3VR",
  apiKey: "AIzaSyBeTXzC4jdPo9UQ7WCwC9SE0AVlt0prhF0",
  authDomain: "gloader-a5426.firebaseapp.com",
  projectId: "gloader-a5426",
  storageBucket: "gloader-a5426.appspot.com",
  messagingSenderId: "451755974190",
  appId: "1:451755974190:web:95b508c8a1664528b989bf",
};

const fireApp = initializeApp(firebaseConfig);
export const storage = getStorage(fireApp);
export const firedb = getFirestore(fireApp);
