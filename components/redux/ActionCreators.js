import { collection, getDocs, query, where } from "firebase/firestore";
import { firedb } from "../../utils/firebase/config";
import * as ActionTypes from "./ActionTypes";

export const fetchUser =
  ({ email }) =>
  async (dispatch) => {
    console.log("Fetching");
    dispatch(userLoading());
    let retData = [];
    let access = false;
    let userDoc = { test: "test" };
    // while(retData.length == 0 || !access) {
    let interval = setInterval(async () => {
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
