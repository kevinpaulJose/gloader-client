import { collection, getDocs, query, where } from "firebase/firestore";
import { firedb } from "./config";

export const getAllDownloads = async (uid) => {
  console.log("getting data with = " + uid);
  const downloadRef = collection(firedb, "downloads");
  const q = query(downloadRef, where("userId", "==", uid));
  const querySnapshot = await getDocs(q);
  const retData = [];
  querySnapshot.forEach((doc) => {
    retData.push(doc.data());
  });
  //   console.log(retData);
  return retData;
};
export const getDownloadsWithID = async (did) => {
  console.log("getting data with = " + did);
  const downloadRef = collection(firedb, "downloads");
  const q = query(downloadRef, where("id", "==", did));
  const querySnapshot = await getDocs(q);
  const retData = [];
  querySnapshot.forEach((doc) => {
    retData.push(doc.data());
  });
  //   console.log(retData);
  return retData;
};

export const getUploadsWithID = async (did) => {
  // console.log("getting data with = " + did);
  const downloadRef = collection(firedb, "uploads");
  const q = query(downloadRef, where("downloadId", "==", did));
  const querySnapshot = await getDocs(q);
  const retData = [];
  querySnapshot.forEach((doc) => {
    // console.log(doc.id + "===");
    // console.log(doc.data());
    if (doc.data().status == "Completed") {
      retData.push(doc.data());
      return retData;
    }
  });
  return retData;
  //   console.log(retData);
};

export const getAllUploads = async (uid) => {
  console.log("getting upload with = " + uid);
  const downloadRef = collection(firedb, "uploads");
  const q = query(downloadRef, where("userId", "==", uid));
  const querySnapshot = await getDocs(q);
  const retData = [];
  querySnapshot.forEach((doc) => {
    retData.push(doc.data());
  });
  //   console.log(retData);
  return retData;
};
