import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { firedb, storage } from "./config";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
  uploadString,
} from "firebase/storage";

export const getAllDownloads = async (uid) => {
  // console.log("getting data with = " + uid);
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
  // console.log("getting data with = " + did);
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

export const getDownloadsID = async (did) => {
  // console.log("getting data with = " + did);
  const downloadRef = collection(firedb, "downloads");
  const q = query(downloadRef, where("id", "==", did));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    alert(doc.id);
  });
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
  // console.log("getting upload with = " + uid);
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
  // console.log(uri);
  // console.log("Uploading");
  const storageRef = ref(storage, fileName);
  const response = await fetch(uri);

  const blob = await response.blob();

  const uploadTask = await uploadBytesResumable(storageRef, blob);
  return await getDownloadURL(uploadTask.ref);
};

export const stopDownload = async (id) => {
  const downloadRef = collection(firedb, "downloads");
  const q = query(downloadRef, where("id", "==", id));
  const querySnapshot = await getDocs(q);
  let docId = "";
  querySnapshot.forEach((doc) => {
    docId = doc.id;
  });

  const docRef = doc(firedb, "downloads", docId);
  await updateDoc(docRef, {
    stopped: true,
  });
};

export const deletePending = async (id) => {
  const downloadRef = collection(firedb, "downloads");
  const q = query(downloadRef, where("id", "==", id));
  const querySnapshot = await getDocs(q);
  let docId = "";
  querySnapshot.forEach((doc) => {
    docId = doc.id;
  });
  await deleteDoc(doc(firedb, "downloads", docId));
};

export const deleteFolder = async (folderName) => {
  const downloadRef = collection(firedb, "downloads");
  const uploadRef = collection(firedb, "uploads");
  const q = query(downloadRef, where("folderName", "==", folderName));
  const querySnapshot = await getDocs(q);

  let docId = [];
  querySnapshot.forEach((doc) => {
    docId[docId.length] = doc.id;
  });

  const qu = query(uploadRef, where("path", "==", folderName));
  const querySnapshotu = await getDocs(qu);
  let uploadId = [];
  querySnapshotu.forEach((doc) => {
    uploadId[uploadId.length] = doc.id;
  });
  for (const id of docId) {
    await deleteDoc(doc(firedb, "downloads", id));
  }
  for (const id of uploadId) {
    await deleteDoc(doc(firedb, "uploads", id));
  }
  return true;
};
