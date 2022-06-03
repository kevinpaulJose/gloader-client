import React from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  RefreshControl,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// import * as google from "googleapis";
import { connect } from "react-redux";
import { fetchUser, removeUser } from "../redux/ActionCreators";
import { theme } from "../theme";
import OngoingDnldComponent from "../common/Track/OngoingDnldComponent";
import { Text } from "react-native";
import PendingDnldComponent from "../common/Track/PendingDnld";
import {
  getAllDownloads,
  getAllUploads,
  getDownloadsID,
  uploadImg,
} from "../../utils/firebase/functions";
import LottieView from "lottie-react-native";
import { URL } from "react-native-url-polyfill";
import * as Clipboard from "expo-clipboard";
import { Icon, Image } from "@rneui/base";
import hasMediaLibraryPermissionGranted from "../../utils/hasLibraryPermissionsGranted";
import { Linking } from "react-native";
import uploadImageFromDevice from "../../utils/uploadImageFromDevice";
import { baseURL } from "../../utils/config";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { firedb } from "../../utils/firebase/config";

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
const windowwidth = Dimensions.get("window").width;
const windowheight = Dimensions.get("window").height;

const mapDispatchToProps = (dispatch) => ({
  fetchUser: ({ email }) => dispatch(fetchUser({ email: email })),
  removeUser: ({ token, og }) => dispatch(removeUser({ token, og })),
});

const unsub = () => {};

class TrackComponent extends React.Component {
  componentDidMount() {
    // this.fetchCopiedText();
    // setTimeout(() => {
    //   this._getFileType(this.state.formFileName);
    // }, 1000);
    // console.log("From signup");
    // console.log(this.props.user);
    // setInterval(() => {
    // this._getDownloads();
    // }, 2000);
  }
  state = {
    allDnlds: [],
    isLoading: false,
    downloading: [],
    uploaded: [],
    uploadStatus: "",
    completed: [],
    pendingDownloads: [],
    newModalVisible: false,
    formURL: "",
    formFolderName: "gloader",
    formFileName: "",
    img: "nothing",
    onPressIn: false,
    icon: require("../../assets/images/default.png"),
    deniedPermission: false,
    localImgURI: "",
    fileNameError: false,
    URLError: false,
    runningSync: false,
    uploadingImage: false,
  };
  fetchCopiedText = async () => {
    const text = await Clipboard.getStringAsync();
    console.log(text);
    this._getFileName(text);
    this.setState({ formURL: text });
  };

  _getDownloads = async () => {
    this.setState({ isLoading: true });
    if (!this.state.runningSync) {
      this.setState({ runningSync: true });
      let interval = setInterval(async () => {
        console.log("---------------- Getting downloads ----------------");
        let completed = [];
        let currentStatus = "";
        let currentUpload = [];
        // this.setState({ isLoading: true });
        const allDownloads = await getAllDownloads(this.props.user.data[0].id);
        const uploadData = await getAllUploads(this.props.user.data[0].id);
        let pendingDownloads = allDownloads.filter(
          (p) => p.status == "Pending"
        );
        // console.log(uploadData);
        let dnlding = allDownloads.filter((v) => v.status === "Downloading");
        console.log("PendingDonwloads: " + this.state.pendingDownloads.length);
        console.log("Downloading: " + this.state.downloading.length);
        if (
          // this.state.pendingDownloads.length == 0 &&
          // this.state.downloading.length == 0 &&
          pendingDownloads.length == 0 &&
          dnlding.length == 0
        ) {
          console.log("Nothing found");
          this.setState({
            runningSync: false,
            isLoading: false,
            downloading: [],
            pendingDownloads: [],
          });
          clearInterval(interval);
        } else {
          if (dnlding.length > 0) {
            currentUpload = uploadData.filter(
              (v) => v.downloadId === dnlding[0].id
            );
            currentStatus =
              currentUpload.length == 0 ? "pending" : currentUpload[0].status;
          } else {
            this.setState({ downloading: [] });
          }

          allDownloads.forEach((v) => {
            if (v.status == "Completed") {
              let correspondingUpload = uploadData.filter(
                (vl) => vl.downloadId == v.id
              );
              // console.log("currespo:" + uploadData.length);
              correspondingUpload.forEach((val) => {
                if (val.status == "Completed") {
                  let completedDownlads = allDownloads.filter(
                    (vls) => vls.id == val.downloadId
                  );
                  completed.push(completedDownlads);
                } else {
                  currentStatus = val.status;
                  currentUpload = [val];
                  dnlding = allDownloads.filter(
                    (dnld) => dnld.id == val.downloadId
                  );
                }
              });
            }
          });
          console.log("Downloading: " + dnlding.length);
          console.log("CurrentUpload: " + currentUpload.length);
          console.log("CurrentStatis: " + currentStatus);
          console.log("Completed: " + completed.length);
          console.log("Pending: " + pendingDownloads.length);
          this.setState({
            isLoading: false,
            allDnlds: allDownloads,
            downloading: dnlding,
            uploadStatus: currentStatus,
            completed: completed,
            pendingDownloads: pendingDownloads,
          });
        }
      }, 6000);
    }
  };
  getPercentage = (percentage) => {
    return percentage.split(".")[0].toString() + "%";
  };

  _getFileName = (url) => {
    // url = "http://www.myblog.com/filename.php?year=2019#06";
    let filename = "";
    try {
      filename = new URL(url).pathname.split("/").pop();
      this.setState({ formFileName: filename });
      this._getFileType(filename);
    } catch (e) {
      console.log(e);
    }

    // console.log(`filename: ${filename}`);
  };
  _getImageFromDevice = async () => {
    let hasPermission = await hasMediaLibraryPermissionGranted();
    if (!hasPermission) {
      this.setState({ deniedPermission: true });
    } else {
      let imgURI = await uploadImageFromDevice();
      if (imgURI != null) {
        // console.log(imgURI);
        // let ext = imgURI.split(".").pop();
        // console.log(ext);
        // const file = await FileSystem.readAsStringAsync(imgURI, {
        //   encoding: FileSystem.EncodingType.Base64,
        // });
        // console.log(file);
        // this.setState({localImgURI: file})
        // console.log("done");
        // console.log(file);
        // // console.log(blob);
        // console.log(imgURI);
        this.setState({ localImgURI: imgURI });
      }
    }
    console.log(hasPermission);
  };
  _uploadImage = async () => {
    this.setState({ uploadingImage: true, onPressIn: true });
    let fileNameError = false;
    let URLError = false;
    if (this.state.formFileName == "") {
      fileNameError = true;
      this.setState({ fileNameError: fileNameError });
    }
    if (this.state.formURL == "") {
      URLError = true;
      this.setState({ URLError: URLError });
    }
    if (fileNameError || URLError) {
      console.log("error");
      this.setState({ uploadingImage: false, onPressIn: false });
    } else {
      let downloadId =
        this.props.user.data[0].id + "_" + new Date().getTime().toString();
      let imgURL = "nothing";
      if (this.state.localImgURI == "") {
        imgURL = "nothing";
      } else {
        const downloadURL = await uploadImg(
          this.props.user.data[0].id +
            "/" +
            downloadId +
            "_" +
            this.state.formFileName.replace(" ", "_"),
          this.state.localImgURI
        );
        imgURL = downloadURL;
      }
      let data = {
        url: this.state.formURL,
        filename: this.state.formFileName.replace(" ", "_"),
        id: downloadId,
        folderName: this.state.formFolderName,
        token: this.props.user.data[0].refreshToken,
        img: imgURL,
        userId: this.props.user.data[0].id,
      };
      fetch(baseURL.api_uri + "/cloudSave", {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => {
          console.log("Download added");
          this.setState({
            uploadingImage: false,
            onPressIn: false,
            newModalVisible: false,
          });
          this._getDownloads();
          // if (this.state.downloading.length > 0) {
          //   let temp = this.state.pendingDownloads;
          //   temp.push(data);
          //   this.setState({ pendingDownloads: temp });
          // } else {
          //   this._listenChanges(data);
          // }
        })
        .catch((e) => {
          console.error(e);
        });
    }
  };

  componentDidMount() {
    this._getDownloads();
  }

  _getPermissionAlert = () => {
    if (!this.state.deniedPermission) {
      this._getImageFromDevice();
    } else {
      return Alert.alert("Allow permissions to gallery", "", [
        {
          text: "Deny",
          onPress: () => {
            console.log("Cancel Pressed");
          },
          style: "cancel",
        },
        {
          text: "Allow",
          onPress: () => {
            if (this.state.deniedPermission) {
              Linking.openSettings().then(() =>
                this.setState({ deniedPermission: false })
              );
            } else {
              this._getImageFromDevice();
            }
          },
        },
      ]);
    }
  };

  _getFileType = (fileName) => {
    if (fileName == "") {
      this.setState({ icon: require("../../assets/images/video.png") });
    }

    let fileType = "common";
    const mediaType = ["mp4", "mkv", "mov", "wmv", "avi", "webm"];
    const archiveType = ["zip", "rar", "exe", "bin", "msi", "7z"];
    const vrType = ["3dh", "3dv", "180x180", "360_", "3D-SBS", "3d-OU"];
    let ext = fileName.split(".").pop();
    if (mediaType.includes(ext)) {
      fileType = "media";
    }
    if (archiveType.includes(ext)) {
      fileType = "archive";
    }
    vrType.forEach((v, i) => {
      if (fileName.toLowerCase().indexOf(v.toLowerCase()) !== -1) {
        fileType = "vr";
      }
    });

    console.log(fileType);
    switch (fileType) {
      case "media":
        this.setState({ icon: require("../../assets/images/video.png") });
        break;
      case "vr":
        this.setState({ icon: require("../../assets/images/vr.png") });
        break;
      default:
        this.setState({ icon: require("../../assets/images/default.png") });
        break;
    }
  };

  _getFileTypeForCard = (fileName) => {
    let fileType = "common";

    const mediaType = ["mp4", "mkv", "mov", "wmv", "avi", "webm"];
    const archiveType = ["zip", "rar", "exe", "bin", "msi", "7z"];
    const vrType = ["3dh", "3dv", "180x180", "360_", "3D-SBS", "3d-OU"];
    let ext = fileName.split(".").pop();
    if (mediaType.includes(ext)) {
      fileType = "media";
    }
    if (archiveType.includes(ext)) {
      fileType = "archive";
    }
    vrType.forEach((v, i) => {
      if (fileName.toLowerCase().indexOf(v.toLowerCase()) !== -1) {
        fileType = "vr";
      }
    });

    console.log(fileType);
    switch (fileType) {
      case "media":
        return {
          icon: require("../../assets/images/video.png"),
          type: fileType,
        };
      case "vr":
        return {
          icon: require("../../assets/images/vr.png"),
          type: fileType,
        };
      default:
        return {
          icon: require("../../assets/images/default.png"),
          type: fileType,
        };
    }
  };
  _newtModal = () => {
    return (
      // <View style={{ marginTop: 200 }}>
      <Modal
        visible={this.state.newModalVisible}
        animationType={"slide"}
        transparent={true}
      >
        <TouchableOpacity
          onPress={() => {
            this.setState({ newModalVisible: false });
          }}
          style={{
            // backgroundColor: "blue",
            // width: 70,
            // height: 70,
            justifyContent: "center",
            position: "absolute",
            top: 20,
            left: 20,
            zIndex: 100,
          }}
        >
          <Icon
            name="close-outline"
            type="ionicon"
            color={theme.mediumLightText}
            size={25}
            containerStyle={{ alignSelf: "flex-end", marginRight: 5 }}
          />
        </TouchableOpacity>
        <View
          style={{
            width: windowwidth,
            height: windowheight,
            backgroundColor: theme.blank,
          }}
        >
          <LottieView
            style={{
              width: windowwidth / 2 + 20,
              height: windowwidth / 2 + 20,
              alignSelf: "center",
              // marginTop: 100,
              // marginLeft: -5,
              marginTop: 20,
            }}
            source={require("../../assets/lottie/cloud.json")}
            autoPlay
            loop={true}
            // backgroundColor={"red"}
            resizeMode="contain"
          />
          <View
            style={{
              alignSelf: "center",
              marginTop: 60,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                // backgroundColor: "red",
                width: windowwidth - 40,
                height: 30,
              }}
            >
              <View style={{ flex: 1, justifyContent: "flex-end" }}>
                <Text style={{ color: theme.darkText, fontSize: 16 }}>
                  URL:
                </Text>
              </View>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: theme.secondryText,
                  // width: "100%",
                  alignItems: "center",
                  // paddingBottom: 5,
                  flex: 3,
                  // backgroundColor: "blue",
                }}
              >
                <TextInput
                  value={this.state.formURL}
                  placeholder={"https://download.com/avengers.mp4"}
                  style={{ fontSize: 12, color: theme.darkText }}
                  onChangeText={(v) => {
                    this.setState({ formURL: v });
                  }}
                  placeholderTextColor={
                    this.state.URLError ? "red" : theme.secondryText
                  }
                  onBlur={() => {
                    this._getFileName(this.state.formURL);
                    // this._getFileType(this.state.formFileName)
                  }}
                  selectTextOnFocus
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                // backgroundColor: "red",
                width: windowwidth - 40,
                height: 30,
                marginTop: 20,
              }}
            >
              <View style={{ flex: 1, justifyContent: "flex-end" }}>
                <Text style={{ color: theme.darkText, fontSize: 14 }}>
                  File Name:
                </Text>
              </View>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: theme.secondryText,
                  // width: "100%",
                  alignItems: "center",
                  // paddingBottom: 5,
                  flex: 3,
                  // backgroundColor: "blue",
                }}
              >
                <TextInput
                  value={this.state.formFileName}
                  placeholder={"avengers.mp4"}
                  style={{ fontSize: 12, color: theme.darkText }}
                  onChangeText={(v) => {
                    this.setState({ formFileName: v });
                  }}
                  placeholderTextColor={
                    this.state.fileNameError ? "red" : theme.secondryText
                  }
                  onBlur={() => this._getFileType(this.state.formFileName)}
                  selectTextOnFocus
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                // backgroundColor: "red",
                width: windowwidth - 40,
                height: 30,
                marginTop: 20,
              }}
            >
              <View style={{ flex: 1, justifyContent: "flex-end" }}>
                <Text style={{ color: theme.darkText, fontSize: 12 }}>
                  Folder Name:
                </Text>
              </View>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: theme.secondryText,
                  // width: "100%",
                  alignItems: "center",
                  // paddingBottom: 5,
                  flex: 3,
                  // backgroundColor: "blue",
                }}
              >
                <TextInput
                  value={
                    this.state.formFolderName == "gloader"
                      ? ""
                      : this.state.formFolderName
                  }
                  placeholder={"gloader"}
                  style={{ fontSize: 12, color: theme.darkText }}
                  onChangeText={(v) => {
                    this.setState({ formFolderName: v });
                  }}
                  selectTextOnFocus
                />
              </View>
            </View>
            <View
              style={{
                // backgroundColor: "red",
                marginTop: 20,
                alignSelf: "center",
              }}
            >
              <Text style={{ fontSize: 14, color: theme.mediumLightText }}>
                Cover Image
              </Text>
            </View>
            {this.state.localImgURI == "" ? (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  this._getPermissionAlert();
                }}
                style={{
                  width: 100,
                  height: 100,
                  // backgroundColor: "red",
                  marginTop: 10,
                  alignSelf: "center",
                  borderRadius: 10,
                }}
              >
                <Image
                  source={this.state.icon}
                  style={{ width: 100, height: 100, resizeMode: "contain" }}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  this._getPermissionAlert();
                }}
                style={{
                  width: 200,
                  height: 150,
                  // backgroundColor: "red",
                  marginTop: 10,
                  alignSelf: "center",
                  borderRadius: 10,
                }}
              >
                <Image
                  source={{ uri: this.state.localImgURI }}
                  style={{
                    width: 200,
                    height: 150,
                    resizeMode: "center",
                    borderRadius: 10,
                  }}
                />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={{
              width: windowwidth / 2 - 40,
              backgroundColor: theme.mainLight,
              alignItems: "center",
              justifyContent: "center",
              height: 40,
              marginTop: 10,
              marginLeft: 10,
              zIndex: 10,
              position: "absolute",
              // top: windowheight / 2 + 70,
              alignSelf: "center",
              bottom: 40,
            }}
            activeOpacity={1}
            onPressIn={() => this.setState({ onPressIn: true })}
            onPressOut={() => {
              this.setState({ onPressIn: false });
              this._uploadImage();
              // setTimeout(() => {
              //   this.setState({ newModalVisible: false });
              // }, 100);
              // this.props.removeUser({token: this.props.user.data[0].token, og: this.props.user.data})
            }}
          >
            <View
              style={{
                width: windowwidth / 2 - 40,
                backgroundColor: this.state.uploadingImage
                  ? theme.mainLight
                  : theme.mainDark,
                alignItems: "center",
                justifyContent: "center",
                height: 40,
                marginTop: this.state.onPressIn ? 0 : -10,
                marginLeft: this.state.onPressIn ? 0 : -10,
              }}
            >
              <Text
                style={{ fontWeight: "bold", fontSize: 16, color: theme.blank }}
              >
                {this.state.uploadingImage ? "..." : "add"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
      // </View>
    );
  };
  _NewTaskIcon = () => {
    return (
      <TouchableOpacity
        style={{
          width: windowwidth / 2 - 40,
          backgroundColor: theme.mainLight,
          alignItems: "center",
          justifyContent: "center",
          height: 40,
          marginTop: 10,
          marginLeft: 10,
          zIndex: 10,
          position: "absolute",
          // top: windowheight / 2 + 70,
          alignSelf: "center",
          bottom: 10,
        }}
        disabled={this.state.isLoading}
        activeOpacity={1}
        onPressIn={() => this.setState({ onPressIn: true })}
        onPressOut={() => {
          this.setState({ onPressIn: false, newModalVisible: true });
          this.fetchCopiedText();
          // setTimeout(() => {
          //   this._getFileType(this.state.formFileName);
          // }, 1000);
        }}
      >
        <View
          style={{
            width: windowwidth / 2 - 40,
            backgroundColor: theme.mainDark,
            alignItems: "center",
            justifyContent: "center",
            height: 40,
            marginTop: this.state.onPressIn ? 0 : -10,
            marginLeft: this.state.onPressIn ? 0 : -10,
          }}
        >
          <Text
            style={{ fontWeight: "bold", fontSize: 16, color: theme.blank }}
          >
            + URL
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={{ marginTop: 10, height: windowheight - 130 }}>
        <this._NewTaskIcon />
        <this._newtModal />
        <View
          style={{
            // height: windowheight - 130,
            backgroundColor: theme.blank,
            width: windowwidth,
          }}
        >
          {this.state.isLoading ? (
            <View>
              <LottieView
                style={{
                  width: windowwidth / 2 + 20,
                  height: windowwidth / 2 + 20,
                  alignSelf: "center",
                  // marginTop: 100,
                  // marginLeft: -5,
                  marginTop: 20,
                }}
                source={require("../../assets/lottie/loading.json")}
                autoPlay
                loop={true}
                // backgroundColor={"red"}
                resizeMode="contain"
              />
            </View>
          ) : (
            <></>
          )}
          {this.state.downloading.length > 0 && !this.state.isLoading && (
            <View>
              <View style={{ marginLeft: 20, marginTop: 20 }}>
                <Text style={{ color: theme.secondryText, fontSize: 16 }}>
                  active
                </Text>
              </View>
              {this.state.downloading.map((v, i) => {
                // console.log(this.getPercentage(v.percentage));
                return (
                  <View style={{ alignSelf: "center", marginTop: 10 }}>
                    <OngoingDnldComponent
                      img={this._getFileTypeForCard(v.fileName).icon}
                      fileName={v.fileName}
                      category={this._getFileTypeForCard(v.fileName).type}
                      folderName={v.folderName}
                      total={v.total + " MB"}
                      completed={v.completed}
                      isURL={false}
                      percentage={this.getPercentage(v.percentage)}
                      currentStatus={this.state.uploadStatus}
                      id={v.id}
                    />
                  </View>
                );
              })}
            </View>
          )}

          {/* <View>
            <View style={{ marginLeft: 20, marginTop: 20 }}>
              <Text style={{ color: theme.secondryText, fontSize: 16 }}>
                active
              </Text>
            </View>

            <View style={{ alignSelf: "center", marginTop: 10 }}>
              <OngoingDnldComponent
                img={this._getFileTypeForCard("test.mp4").icon}
                fileName={"test.mp4"}
                category={this._getFileTypeForCard("test.mp4").type}
                folderName={"gloader"}
                total={"100"}
                completed={"50" + " MB"}
                isURL={false}
                percentage={this.getPercentage("50.0%")}
                currentStatus={"pending"}
                id={"2"}
              />
            </View>
          </View>

          <ScrollView style={{ height: windowheight / 3 + 30, marginTop: 20 }}>
            <View style={{ marginLeft: 20 }}>
              <Text style={{ color: theme.secondryText, fontSize: 16 }}>
                pending
              </Text>
            </View>

            <View style={{ alignSelf: "center", marginTop: 10 }}>
              <PendingDnldComponent
                fileName={"test.mp4"}
                category={this._getFileTypeForCard("test.mp4").type}
                folderName={"test.mp4"}
                total={"0"}
              />
            </View>
            <View style={{ alignSelf: "center", marginTop: 10 }}>
              <PendingDnldComponent
                fileName={"test.mp4"}
                category={this._getFileTypeForCard("test.mp4").type}
                folderName={"test.mp4"}
                total={"0"}
              />
            </View>
            <View style={{ alignSelf: "center", marginTop: 10 }}>
              <PendingDnldComponent
                fileName={"test.mp4"}
                category={this._getFileTypeForCard("test.mp4").type}
                folderName={"test.mp4"}
                total={"0"}
              />
            </View>
            <View style={{ alignSelf: "center", marginTop: 10 }}>
              <PendingDnldComponent
                fileName={"test.mp4"}
                category={this._getFileTypeForCard("test.mp4").type}
                folderName={"test.mp4"}
                total={"0"}
              />
            </View>
            <View style={{ alignSelf: "center", marginTop: 10 }}>
              <PendingDnldComponent
                fileName={"test.mp4"}
                category={this._getFileTypeForCard("test.mp4").type}
                folderName={"test.mp4"}
                total={"0"}
              />
            </View>
          </ScrollView> */}

          {this.state.pendingDownloads.length > 0 && !this.state.isLoading && (
            <ScrollView style={{ height: windowheight / 3, marginTop: 20 }}>
              <View style={{ marginLeft: 20 }}>
                <Text style={{ color: theme.secondryText, fontSize: 16 }}>
                  pending
                </Text>
              </View>
              {this.state.pendingDownloads.map((v, i) => {
                // console.log("Pending" + JSON.stringify(v));
                return (
                  <View style={{ alignSelf: "center", marginTop: 10 }}>
                    <PendingDnldComponent
                      fileName={v.fileName}
                      category={this._getFileTypeForCard(v.fileName).type}
                      folderName={v.folderName}
                      total={v.total}
                      id={v.id}
                    />
                  </View>
                );
              })}
            </ScrollView>
          )}
          {this.state.pendingDownloads.length == 0 &&
          this.state.downloading.length == 0 &&
          !this.state.isLoading ? (
            <LottieView
              style={{
                width: windowwidth / 2,
                height: windowwidth / 2,
                alignSelf: "center",
                marginTop: 30,
                marginLeft: -5,
              }}
              source={require("../../assets/lottie/no-downloads.json")}
              autoPlay
              // loop={false}
              // backgroundColor={"red"}
              resizeMode="contain"
            />
          ) : (
            <View />
          )}
        </View>
      </View>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(TrackComponent);
