// import { async } from "@firebase/util";
import axios from "axios";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { firedb } from "../../utils/firebase/config";
import { setUserId } from "../../utils/firebase/functions";
import * as ActionTypes from "./ActionTypes";

let interval;
export const fetchUser =
  ({ email }) =>
  async (dispatch) => {
    console.log("Fetching called");
    dispatch(userLoading());

    let access = false;
    let userDoc = { test: "test" };
    // while(retData.length == 0 || !access) {
    let count = 0;
    interval = setInterval(async () => {
      count++;
      let retData = [];
      const userRef = collection(firedb, "users");
      const q = query(userRef, where("gmail", "==", email));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (doc) => {
        let userData = doc.data();
        if (userData.used == undefined) {
          await setUserId(userData.gmail);
          userData.used = 0;
          userData.updated = new Date();
        }
        retData.push(userData);
        access = doc.data().access;
        userDoc = doc.data();
      });
      console.log(retData.length + "from here");
      //   console.log(access);
      if (retData.length > 0 && access) {
        clearInterval(interval);
        // console.log(userDoc);
        dispatch(addUser(retData));
      }
      console.log("Count: " + count);
      if (count == 80) {
        clearInterval(interval);
        dispatch(addUser(retData));
      }
    }, 1000);

    // }
  };
export const stopFetching = () => (dispatch) => {
  clearInterval(interval);
  let retData = [];
  dispatch(addUser(retData));
};

export const removeUser = () => async (dispatch) => {
  console.log("Removing user");
  let retData = [];
  dispatch(addUser(retData));
};

export const userLoading = () => ({
  type: ActionTypes.USER_LOADING,
  payload: true,
});
export const addUser = (data) => ({
  type: ActionTypes.USER_UPDATE,
  payload: data,
});
export const userError = () => ({
  type: ActionTypes.USER_ERROR,
  payload: true,
});
