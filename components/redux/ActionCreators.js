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
import * as ActionTypes from "./ActionTypes";

export const fetchUser =
  ({ email }) =>
  async (dispatch) => {
    console.log("Fetching called");
    dispatch(userLoading());

    let access = false;
    let userDoc = { test: "test" };
    // while(retData.length == 0 || !access) {
    let interval = setInterval(async () => {
      let retData = [];
      const userRef = collection(firedb, "users");
      const q = query(userRef, where("gmail", "==", email));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        retData.push(doc.data());
        access = doc.data().access;
        userDoc = doc.data();
      });
      console.log(retData.length);
      //   console.log(access);
      if (retData.length > 0 && access) {
        clearInterval(interval);
        // console.log(userDoc);
        dispatch(addUser(retData));
      }
    }, 1000);

    // }
  };

export const removeUser =
  ({ token, og }) =>
  async (dispatch) => {
    console.log("Removing user");
    dispatch(userLoading());
    var details = {
      token: token,
    };

    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    // fetch("https://oauth2.googleapis.com/revoke?token=" + token, {
    //   method: "POST",
    // })
    //   .then((res) => {
    //     console.log("Signed out");
    //     console.log(res);
    //     let retData = [];
    //     dispatch(addUser(retData));
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //   });
    const url = "https://oauth2.googleapis.com/revoke?token=" + token;
    console.log(url);
    console.log(og[0].id);
    axios({
      method: "POST",
      url: url,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
      .then(async (res) => {
        console.log(res.status);
        const userRef = collection(firedb, "users");
        const q = query(userRef, where("id", "==", og[0].id));
        const querySnapshot = await getDocs(q);
        let docId = "";
        querySnapshot.forEach((doc) => {
          docId = doc.id;
        });
        const docRef = doc(firedb, "users", docId);
        await updateDoc(docRef, {
          access: false,
        });
        let retData = [];
        dispatch(addUser(retData));
        console.log("signed out");
      })
      .catch(async (e) => {
        dispatch(addUser(og));
        console.log(e.response.status);
        if (e.response.status == "400") {
          let retData = [];
          const userRef = collection(firedb, "users");

          const q = query(userRef, where("id", "==", og[0].id));
          const querySnapshot = await getDocs(q);
          let docId = "";
          querySnapshot.forEach((doc) => {
            docId = doc.id;
          });
          const docRef = doc(firedb, "users", docId);
          await updateDoc(docRef, {
            access: false,
          });

          dispatch(addUser(retData));
          console.log("signed out");
        } else {
          console.log("Error occured");
        }
      });

    // axios({})
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
