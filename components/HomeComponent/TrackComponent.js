import React from "react";
import {
  Dimensions,
  RefreshControl,
  ScrollView,
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
import OngoingDnldComponent from "../common/Track/OngoingDnldComponent";
import { Text } from "react-native";
import PendingDnldComponent from "../common/Track/PendingDnld";
import { getAllDownloads, getAllUploads } from "../../utils/firebase/functions";
import LottieView from "lottie-react-native";

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

class TrackComponent extends React.Component {
  componentDidMount() {
    // console.log("From signup");
    // console.log(this.props.user);
    // setInterval(() => {
    this._getDownloads();
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
  };

  _getDownloads = async () => {
    console.log("---------------- Getting downloads ----------------");
    let completed = [];
    let currentStatus = "";
    let currentUpload = [];
    this.setState({ isLoading: true });
    const allDownloads = await getAllDownloads(this.props.user.data[0].id);
    const uploadData = await getAllUploads(this.props.user.data[0].id);
    let pendingDownloads = allDownloads.filter((p) => p.status == "Pending");
    // console.log(uploadData);
    let dnlding = allDownloads.filter((v) => v.status === "Downloading");
    if (dnlding.length > 0) {
      currentUpload = uploadData.filter((v) => v.downloadId === dnlding[0].id);
      currentStatus =
        currentUpload.length == 0 ? "pending" : currentUpload[0].status;
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
            dnlding = allDownloads.filter((dnld) => dnld.id == val.downloadId);
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
  };
  getPercentage = (percentage) => {
    return percentage.split(".")[0].toString() + "%";
  };
  render() {
    return (
      <ScrollView style={{ marginTop: 10 }}>
        <View
          style={{
            // height: windowheight - 130,
            backgroundColor: theme.blank,
            width: windowwidth,
          }}
        >
          {this.state.downloading.length > 0 && (
            <View>
              <View style={{ marginLeft: 20, marginTop: 20 }}>
                <Text style={{ color: theme.secondryText, fontSize: 16 }}>
                  active
                </Text>
              </View>
              {this.state.downloading.map((v, i) => {
                console.log(this.getPercentage(v.percentage));
                return (
                  <View style={{ alignSelf: "center", marginTop: 10 }}>
                    <OngoingDnldComponent
                      img={require("../../assets/images/video.png")}
                      fileName={v.fileName}
                      category={"Video"}
                      folderName={v.folderName}
                      total={v.total + " MB"}
                      completed={v.completed + " MB"}
                      isURL={false}
                      percentage={this.getPercentage(v.percentage)}
                      currentStatus={this.state.uploadStatus}
                    />
                  </View>
                );
              })}
              {/* <View style={{ alignSelf: "center", marginTop: 10 }}>
                <OngoingDnldComponent
                  img={require("../../assets/images/video.png")}
                  fileName={"Windows10_iso.7z"}
                  category={"video"}
                  folderName={"cartoons"}
                  total={"800.1 MB"}
                  completed={"220.4"}
                  isURL={false}
                  percentage={"80%"}
                  currentStatus={"Downloading"}
                />
              </View> */}

              {/* <View style={{ alignSelf: "center", marginTop: 10 }}>
                <OngoingDnldComponent
                  img={require("../../assets/images/video.png")}
                  fileName={v.fileName}
                  category={"Video"}
                  folderName={v.folderName}
                  total={v.total + " MB"}
                  completed={v.completed + " MB"}
                  isURL={false}
                  percentage={v.percentage}
                />
              </View> */}
            </View>
          )}

          {this.state.pendingDownloads.length > 0 && (
            <View>
              <View style={{ marginLeft: 20, marginTop: 20 }}>
                <Text style={{ color: theme.secondryText, fontSize: 16 }}>
                  pending
                </Text>
              </View>
              <View style={{ alignSelf: "center", marginTop: 10 }}>
                <PendingDnldComponent
                  fileName={"Windows10_iso.7z"}
                  category={"video"}
                  folderName={"cartoons"}
                  total={"800.1 MB"}
                />
              </View>
            </View>
          )}
          {this.state.pendingDownloads.length == 0 &&
          this.state.downloading.length == 0 ? (
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
      </ScrollView>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(TrackComponent);
