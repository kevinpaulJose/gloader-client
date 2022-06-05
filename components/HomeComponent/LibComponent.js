import React from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Linking,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
// import * as google from "googleapis";
import * as axios from "axios";
import * as WebBrowser from "expo-web-browser";
import { connect } from "react-redux";
import { fetchUser, removeUser } from "../redux/ActionCreators";
import { theme } from "../theme";
import { LinearGradient } from "expo-linear-gradient";
import HeaderTextComponent from "../common/HeaderTextComponent";
import {
  deleteFolder,
  getAllUploads,
  getDownloadsWithID,
} from "../../utils/firebase/functions";
import FolderGridComponent from "../common/Library/FolderGridComponent";
import { FlatGrid } from "react-native-super-grid";
import { Icon, Image, Input } from "@rneui/base";
import LottieView from "lottie-react-native";
import { generateAccessToken } from "../../utils/getDriveLink";
import { baseURL } from "../../utils/config";
import FileViewComponent from "../common/Library/FileViewComponent";

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

class LibComponent extends React.Component {
  componentDidMount() {
    this.getCompletedUploads();
    // this.checkForTheme();
  }
  state = {
    isLoading: false,
    folders: [],
    selectedDimension: {
      name: "medium",
      size: windowwidth / 2 - 20,
    },
    smallActive: false,
    mediumActive: true,
    largeActive: false,
    currentView: "folder",
    selectedFolder: "",
    files: [],
    actualFiles: [],
    access_token: "",
    loadingFiles: true,
  };

  getCompletedUploads = async () => {
    this.setState({ isLoading: true });
    const allUploads = await getAllUploads(this.props.user.data[0].id);
    const completedUploads = allUploads.filter((v) => v.status == "Completed");
    let uniqueFolders = [];
    completedUploads.forEach((v, i) => {
      let folderProp = {
        folderId: v.folderId,
        folderName: v.path,
        files: [
          {
            fileName: v.fileName,
            downloadId: v.downloadId,
            url: "nothing",
            driveURL: "",
            folderId: v.folderId,
            downlaodDate: "",
          },
        ],
        id: v.id,
      };
      const foundIndex = uniqueFolders.findIndex(
        (e) => e.folderId == v.folderId
      );
      if (foundIndex == -1) {
        uniqueFolders.push(folderProp);
      } else {
        let files = uniqueFolders[foundIndex].files;
        files.push(folderProp.files[0]);
        folderProp.files = files;
        uniqueFolders[foundIndex] = folderProp;
      }
    });
    // console.log(uniqueFolders);
    fetch(
      `https://oauth2.googleapis.com/token?client_secret=${baseURL.client_secret}&grant_type=refresh_token&refresh_token=${this.props.user.data[0].refreshToken}&client_id=${baseURL.client_id}`,
      {
        method: "POST",
        headers: {
          Accept: "*/*",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("got access");
        this.setState({
          access_token: data.access_token,
          isLoading: false,
          folders: uniqueFolders,
        });
        // console.log(uniqueFolders);
      });
  };
  getGridImage = (size) => {
    switch (size) {
      case "small":
        return require("../../assets/images/grid/small.png");
      case "medium":
        return require("../../assets/images/grid/medium.png");
      case "large":
        return require("../../assets/images/grid/large.png");
    }
  };

  setFiles = (folderId) => {
    const selectedFolder = this.state.folders.filter(
      (e) => e.folderId == folderId
    );
    // console.log(folderId);
    // this.state.folders.forEach((e) => console.log(e));
    if (selectedFolder.length > 0) {
      const files = selectedFolder[0].files;
      this.setState({ currentView: "file", files: files, actualFiles: files });
      this.getFileImage(files);
    } else {
      this.setState({ currentView: "folder" });
    }
  };
  searchData = (txt) => {
    const searchData = this.state.actualFiles.filter((v) =>
      v.fileName.toLowerCase().includes(txt.toLowerCase())
    );
    this.setState({ files: searchData });
  };
  _getFileType = (fileName) => {
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

    // console.log(fileType);
    switch (fileType) {
      case "media":
        return require("../../assets/images/video.png");
      case "vr":
        return require("../../assets/images/vr.png");
      default:
        return require("../../assets/images/default.png");
    }
  };

  getFileImage = async (files) => {
    this.setState({ loadingFiles: true });
    let filesWithImg = files;
    for (const file of files) {
      const correspondingDownload = await getDownloadsWithID(file.downloadId);
      fetch(
        `https://www.googleapis.com/drive/v3/files/?q="${file.folderId}"+in+parents&key=${baseURL.api_key}&access_token=${this.state.access_token}`,
        {
          method: "GET",
        }
      )
        .then((res) => res.json())
        .then((data) => {
          const fileFromDrive = data.files.filter(
            (e) => e.name == file.fileName
          );
          const index = files.findIndex((e) => e.downloadId == file.downloadId);
          filesWithImg[index].url = correspondingDownload[0].img;
          filesWithImg[
            index
          ].driveURL = `https://drive.google.com/file/d/${fileFromDrive[0].id}/view?usp=sharing`;
          // console.log(correspondingDownload[0].added.seconds);
          filesWithImg[index].downlaodDate =
            correspondingDownload[0].added.toDate();
        });
    }
    filesWithImg.sort((a, b) => a.downlaodDate - b.downlaodDate);
    this.setState({ files: filesWithImg, loadingFiles: false });
  };

  deleteAlert = async (folderName) => {
    return Alert.alert(
      "Delete " + folderName + "?",
      "This will NOT delete the folder from Google Drive",
      [
        {
          text: "Cancel",
          onPress: () => {
            console.log("Cancel Pressed");
          },
          style: "cancel",
        },
        {
          text: "DELETE",
          onPress: async () => {
            this.setState({ isLoading: true });
            const res = await deleteFolder(folderName);
            this.getCompletedUploads();
          },
        },
      ]
    );
  };

  render() {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            onRefresh={() => {
              this.getCompletedUploads();
            }}
            refreshing={this.state.isLoading}
          />
        }
        style={{
          height: windowheight - 130 + 50,
          backgroundColor:
            // !this.state.isLoading &&
            this.state.files.length != 0 || this.state.folders.length != 0
              ? theme.blank
              : theme.blank,
          width: windowwidth,
          // marginTop: -100,
        }}
      >
        <Text
          style={{
            position: "absolute",
            alignSelf: "center",
            fontSize: 12,
            color: theme.secondryText,
            marginTop: 5,
          }}
        >
          swipe down to refresh
        </Text>
        {!this.state.isLoading &&
          this.state.files.length == 0 &&
          this.state.folders.length == 0 && (
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
          )}
        {!this.state.isLoading && this.state.currentView != "folder" && (
          <TouchableOpacity
            style={{ position: "absolute", left: 20, top: 10, zIndex: 200 }}
            activeOpacity={1}
            onPress={() => this.setFiles("abc")}
          >
            <Icon
              name="return-down-back"
              type="ionicon"
              color={theme.mainDark}
              size={25}
              containerStyle={{ alignSelf: "flex-end", marginRight: 5 }}
            />
          </TouchableOpacity>
        )}
        {this.state.isLoading && (
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
        )}
        {this.state.folders.length > 0 && !this.state.isLoading && (
          <View>
            <View
              style={{
                width: windowwidth,
                alignItems: "flex-end",
              }}
            >
              <FlatGrid
                style={{
                  marginRight: 0,
                }}
                itemDimension={25}
                data={[
                  { name: "small", size: 110 },
                  { name: "medium", size: windowwidth / 2 - 20 },
                  { name: "large", size: windowwidth - 40 },
                ]}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => this.setState({ selectedDimension: item })}
                    style={{
                      backgroundColor:
                        this.state.selectedDimension.name == item.name
                          ? theme.mainLight
                          : theme.blank,
                      alignItems: "center",
                      borderRadius: 10,
                    }}
                  >
                    <View style={{ padding: 5 }}>
                      <Image
                        source={this.getGridImage(item.name)}
                        style={{ width: 20, height: 20 }}
                      />
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
            {this.state.folders.length > 0 &&
              !this.state.isLoading &&
              this.state.currentView != "folder" && (
                <View
                  style={{
                    backgroundColor: theme.veryLightBG,
                  }}
                >
                  <TextInput
                    type="text"
                    style={{
                      padding: 8,
                      textAlign: "center",
                      fontSize: 14,
                      color: theme.mainDark,
                    }}
                    onChangeText={(text) => this.searchData(text)}
                    placeholder="search for files"
                    placeholderTextColor={theme.secondryText}
                  />
                </View>
              )}
            {!this.state.isLoading && this.state.currentView == "folder" ? (
              <FlatGrid
                itemDimension={this.state.selectedDimension.size}
                data={this.state.folders}
                style={{ paddingBottom: 100 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    activeOpacity={1}
                    onLongPress={() => this.deleteAlert(item.folderName)}
                    onPress={() => {
                      this.setFiles(item.folderId);
                      // console.log("done");
                    }}
                    style={{
                      height: this.state.selectedDimension.size,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      source={require("../../assets/images/folder.png")}
                      style={{
                        width: this.state.selectedDimension.size - 40,
                        height: this.state.selectedDimension.size - 40,
                      }}
                    />
                    <Text
                      style={{
                        marginTop: 3,
                        fontSize: 12,
                        color: theme.mainDark,
                      }}
                    >
                      {item.folderName}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            ) : this.state.loadingFiles ? (
              <ActivityIndicator
                color={theme.blank}
                style={{ marginTop: 20 }}
              />
            ) : (
              <FlatGrid
                itemDimension={this.state.selectedDimension.size}
                data={this.state.files}
                style={{ paddingBottom: 100 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                      if (item.driveURL != "") {
                        Linking.openURL(item.driveURL);
                      }
                    }}
                    style={{
                      height: this.state.selectedDimension.size,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: theme.blank,
                      borderRadius: 5,
                    }}
                  >
                    {/* <View></View> */}
                    <FileViewComponent
                      fileName={item.fileName}
                      width={
                        item.url == "nothing"
                          ? this.state.selectedDimension.size - 60
                          : this.state.selectedDimension.size
                      }
                      height={
                        item.url == "nothing"
                          ? this.state.selectedDimension.size - 60
                          : this.state.selectedDimension.name == "large"
                          ? this.state.selectedDimension.size - 100
                          : this.state.selectedDimension.name == "medium"
                          ? this.state.selectedDimension.size - 60
                          : this.state.selectedDimension.size - 40
                      }
                      downloadId={item.downloadId}
                    />
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        )}
      </ScrollView>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(LibComponent);
