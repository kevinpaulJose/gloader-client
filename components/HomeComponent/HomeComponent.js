import React from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Linking,
  Modal,
  ScrollView,
  StatusBar,
  Text,
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
import TrackComponent from "./TrackComponent";
import LibComponent from "./LibComponent";
import { Icon } from "@rneui/base";
import LottieView from "lottie-react-native";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { firedb } from "../../utils/firebase/config";
import { baseURL } from "../../utils/config";
import {
  getDownloadsWithID,
  getUploadsWithID,
} from "../../utils/firebase/functions";

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
const windowwidth = Dimensions.get("window").width;
const windowheight = Dimensions.get("window").height;

const mapDispatchToProps = (dispatch) => ({
  fetchUser: ({ email }) => dispatch(fetchUser({ email: email })),
  removeUser: () => dispatch(removeUser()),
});

class Home extends React.Component {
  state = {
    headerShown: false,
    currentTab: "library",
    // headerShown: true,
    // currentTab: "track",
    conStatus: "connected",
    onPressIn: false,
    logOutModalVisible: false,
    logoutLoading: false,
  };
  animatedValue = new Animated.Value(windowheight / 3 + 100);

  doAnimation = () => {
    console.log("done");
    Animated.timing(this.animatedValue, {
      toValue: windowheight / 3 - 30,
      duration: 500,
    }).start;
  };

  reverseAnimation = () => {
    Animated.timing(this.animatedValue, {
      toValue: windowheight / 3 + 100,
      duration: 500,
    }).start;
  };

  componentDidMount() {
    // this._checkRefreshToken();
  }

  _checkRefreshToken = async () => {
    let downloadId =
      this.props.user.data[0].id + "_test" + new Date().getTime().toString();
    this.setState({ conStatus: "checking..." });
    fetch(baseURL.api_uri + "/cloudSave", {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: "https://firebasestorage.googleapis.com/v0/b/gloader-a5426.appspot.com/o/icon.jpg?alt=media&token=c1ef251e-b1fe-433f-91d7-e0802cc55162",
        filename: "._cache",
        id: downloadId,
        folderName: "._gloader_cache",
        token: this.props.user.data[0].refreshToken,
        img: "nothing",
        userId: this.props.user.data[0].id + "_cache",
      }),
    })
      .then((res) => {
        if (res.status == "200") {
          setTimeout(async () => {
            let dnldData = [];
            console.log("getting uploads with + " + downloadId);
            dnldData = await getUploadsWithID(downloadId);
            // console.log(dnldData);
            if (dnldData.length == 0) {
              this.setState({ conStatus: "disconnected" });
            } else {
              this.setState({ conStatus: "connected" });
            }
          }, 15000);
        }
      })
      .catch((e) => {
        console.log(res.data);
        console.error(e);
      });
  };
  _logoutLogic = async () => {
    this.setState({ logoutLoading: true });
    var details = {
      token: this.props.user.data[0].refreshToken,
    };

    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    const url =
      "https://oauth2.googleapis.com/revoke?token=" +
      this.props.user.data[0].refreshToken;
    console.log(url);
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
      .then(async (res) => {
        // alert(res.status);
        if (res.status == "200") {
          const userRef = collection(firedb, "users");
          const q = query(
            userRef,
            where("id", "==", this.props.user.data[0].id)
          );
          const querySnapshot = await getDocs(q);
          let docId = "";
          querySnapshot.forEach((doc) => {
            docId = doc.id;
          });
          const docRef = doc(firedb, "users", docId);
          await updateDoc(docRef, {
            access: false,
          });
          this.setState({ logoutLoading: false });
          this.props.removeUser();
        } else if (res.status == "400") {
          console.log("came here");
          this.setState({ logoutLoading: false });
          this.props.removeUser();
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  _logoutModal = () => {
    return (
      // <View style={{ marginTop: 200 }}>
      <Modal
        visible={this.state.logOutModalVisible}
        animationType={"slide"}
        transparent={true}
      >
        <View
          style={{
            width: windowwidth,
            height: windowheight,
            backgroundColor: theme.blank,
          }}
        >
          <LottieView
            style={{
              width: windowwidth / 2 + 100,
              height: windowwidth / 2 + 100,
              alignSelf: "center",
              // marginTop: 100,
              // marginLeft: -5,
              marginTop: windowwidth - (windowwidth / 2 + 100),
            }}
            source={require("../../assets/lottie/logout.json")}
            autoPlay
            loop={false}
            // backgroundColor={"red"}
            resizeMode="contain"
          />
          <View
            style={{
              alignSelf: "center",
              marginTop: 80,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: theme.mediumLightText,
                fontSize: 14,
              }}
            >
              account: {this.props.user.data[0].gmail}
            </Text>
            <Text
              style={{
                textAlign: "center",
                marginTop: 5,
                color: theme.mediumLightText,
                fontSize: 14,
              }}
            >
              name: {this.props.user.data[0].name}
            </Text>
            <View style={{ flexDirection: "row", marginTop: 20 }}>
              <Text
                style={{
                  textAlign:
                    this.state.conStatus == "connected" ? "right" : "center",
                  // marginTop: 20,
                  color: theme.mediumLightText,
                  flex: 2,
                  fontSize: 14,
                }}
              >
                status: {this.state.conStatus}
              </Text>
              {this.state.conStatus == "connected" &&
                (this.state.logoutLoading ? (
                  <ActivityIndicator
                    style={{ marginLeft: 5 }}
                    color={theme.mainDark}
                  />
                ) : (
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      marginLeft: 5,
                      justifyContent: "flex-end",
                    }}
                    onPress={() => this._logoutLogic()}
                    activeOpacity={1}
                  >
                    <Text
                      style={{
                        textAlign: "left",
                        // marginTop: 10,
                        color: theme.mediumLightText,
                        // marginLeft: 5,
                        color: theme.mainDark,
                        fontSize: 10,
                        fontWeight: "bold",
                        textDecorationLine: "underline",
                      }}
                    >
                      {"revoke?"}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
            {this.state.conStatus == "disconnected" && (
              <TouchableOpacity
                style={{
                  marginTop: 10,
                }}
                onPress={() => {
                  this.props.fetchUser({
                    email: this.props.user.data[0].gmail.toLowerCase(),
                  });
                  Linking.openURL(
                    baseURL.web_uri +
                      "/?email=" +
                      this.props.user.data[0].gmail.toLowerCase()
                  );
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    // marginTop: 10,
                    color: theme.mediumLightText,
                    color: theme.mainDark,
                    fontSize: 18,
                    fontWeight: "bold",
                    textDecorationLine: "underline",
                  }}
                >
                  {"re-connect"}
                </Text>
              </TouchableOpacity>
            )}
            {this.state.conStatus == "connected" && (
              <TouchableOpacity
                style={{
                  marginTop: 10,
                }}
                onPress={() => {
                  this._checkRefreshToken();
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    // marginTop: 10,
                    color: theme.mediumLightText,
                    color: theme.mainDark,
                    fontSize: 14,
                    fontWeight: "normal",
                  }}
                >
                  {"re-check"}
                </Text>
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
              setTimeout(() => {
                this.setState({ logOutModalVisible: false });
              }, 100);
              // this.props.removeUser({token: this.props.user.data[0].token, og: this.props.user.data})
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
                go back
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
      // </View>
    );
  };

  _tabComponent = () => {
    return (
      <View
        style={{
          width: windowwidth - 40,
          alignSelf: "center",
          height: 50,
          backgroundColor: theme.blank,
          marginTop: 0,
          flexDirection: "row",
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor:
              this.state.currentTab === "track" ? theme.mainLight : theme.blank,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor:
                this.state.currentTab === "track"
                  ? theme.mainDark
                  : theme.blank,
              height: 50,
              marginTop: this.state.currentTab === "track" ? -5 : 0,
              marginRight: this.state.currentTab === "track" ? 5 : 0,
              marginLeft: this.state.currentTab === "track" ? -5 : 0,
              alignItems: "center",
              justifyContent: "center",
            }}
            activeOpacity={1}
            onPress={() => {
              this.setState({ currentTab: "track", headerShown: true });
              this.reverseAnimation();
            }}
          >
            <Text
              style={{
                color:
                  this.state.currentTab === "track"
                    ? theme.blank
                    : theme.mainDark,
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              Track
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor:
              this.state.currentTab === "library"
                ? theme.mainLight
                : theme.blank,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor:
                this.state.currentTab === "library"
                  ? theme.mainDark
                  : theme.blank,
              height: 50,
              marginTop: this.state.currentTab === "library" ? -5 : 0,
              marginRight: this.state.currentTab === "library" ? 5 : 0,
              marginLeft: this.state.currentTab === "library" ? -5 : 0,
              alignItems: "center",
              justifyContent: "center",
            }}
            activeOpacity={1}
            onPress={() => {
              this.setState({ currentTab: "library", headerShown: false });
              this.doAnimation();
            }}
          >
            <Text
              style={{
                color:
                  this.state.currentTab === "library"
                    ? theme.blank
                    : theme.mainDark,
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              Library
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  _logoutIcon = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({ logOutModalVisible: true });
        }}
        style={{
          // backgroundColor: "blue",
          width: 70,
          height: 70,
          justifyContent: "center",
          position: "absolute",
          top: 0,
          right: 10,
          zIndex: 100,
        }}
      >
        <Icon
          name="exit-outline"
          type="ionicon"
          color="white"
          size={25}
          containerStyle={{ alignSelf: "flex-end", marginRight: 5 }}
        />
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={{ height: windowheight }}>
        <LinearGradient
          colors={[theme.mainDark, theme.forLinearGradientLight]}
          style={{ height: windowheight / 3 - 30 }}
        >
          {this.state.currentTab == "track" && <this._logoutIcon />}

          <HeaderTextComponent
            name={this.props.user.data[0].name}
            shown={this.state.headerShown}
            conStatus={this.state.conStatus}
          />
          <this._tabComponent />
          {this.state.currentTab === "track" ? (
            <View style={{ position: "absolute", top: windowheight / 3 - 30 }}>
              <TrackComponent />
            </View>
          ) : (
            <View style={{ position: "absolute", top: windowheight / 3 - 30 }}>
              <LibComponent />
            </View>
          )}
        </LinearGradient>
        {/* {this.state.currentTab == "track" && <this._NewTaskIcon />} */}
        <this._logoutModal />

        <StatusBar backgroundColor={theme.mainDark} />
      </View>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Home);
