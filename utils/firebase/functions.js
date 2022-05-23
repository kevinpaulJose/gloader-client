import { collection, getDocs, query, where } from "firebase/firestore";
import { firedb, storage } from "./config";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
  uploadString,
} from "firebase/storage";

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

export const uploadImg = async (fileName, uri) => {
  console.log(uri);
  console.log("Uploading");
  const storageRef = ref(storage, fileName);
  const response = await fetch(uri);

  const blob = await response.blob();

  const uploadTask = await uploadBytesResumable(storageRef, blob);
  return await getDownloadURL(uploadTask.ref);
  // uploadTask.on(
  //   "state_changed",
  //   (snapshot) => {
  //     // Observe state change events such as progress, pause, and resume
  //     // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
  //     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //     console.log("Upload is " + progress + "% done");
  //     switch (snapshot.state) {
  //       case "paused":
  //         console.log("Upload is paused");
  //         break;
  //       case "running":
  //         console.log("Upload is running");
  //         break;
  //     }
  //   },
  //   (error) => {
  //     // Handle unsuccessful uploads
  //   },
  //   () => {
  //     // Handle successful uploads on complete
  //     // For instance, get the download URL: https://firebasestorage.googleapis.com/...
  //     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  //       return downloadURL;
  //     });
  //   }
  // );
};
