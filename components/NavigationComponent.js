import {
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Modal,
  Dimensions,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import SignUp from "./SignupComponent/SignupComponent";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { fetchUser, removeUser } from "./redux/ActionCreators";
import { connect } from "react-redux";
import Home from "./HomeComponent/HomeComponent";
import * as Linking from "expo-linking";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ListingComponent from "./ListingComponents/ListingComponent";
import TrackComponent from "./HomeComponent/TrackComponent";
import LibComponent from "./HomeComponent/LibComponent";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getUploadsWithID } from "../utils/firebase/functions";
import { theme } from "./theme";
import { baseURL } from "../utils/config";
import { Icon } from "@rneui/base";
import LottieView from "lottie-react-native";
import { firedb } from "../utils/firebase/config";

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

class Navigator extends React.Component {
  state = {
    logoutLoading: false,
    conStatus: "connected",
    logOutModalVisible: false,
    onPressIn: false,
  };
  componentDidMount() {
    // this.props.fetchUser({ email: "kpaul@flowmed.ca" });
    if (this.props.user.data.length == 0) {
      // this.props.fetchUser({ email: "kpaul@flowmed.ca" });
    }
    console.log(this.props.user);
    this._checkRefreshToken();
  }

  MyTabs = () => {
    const Tab = createMaterialTopTabNavigator();
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: {
            fontSize: 12,
            // color: theme.mainDark,
          },
          tabBarActiveTintColor: theme.mainDark,
          // tabBarStyle: { backgroundColor: theme.mainLight },
          tabBarIndicatorStyle: { backgroundColor: theme.mainDark },
        }}
      >
        <Tab.Screen
          name="Tasks"
          options={{ tabBarLabel: "Tasks" }}
          component={TrackComponent}
        />
        <Tab.Screen name="Library" component={LibComponent} />
        <Tab.Screen name="My Drive" component={ListingComponent} />
        {/* <Tab.Screen name="Settings" component={SettingsScreen} /> */}
      </Tab.Navigator>
    );
  };
  _checkRefreshToken = async () => {
    // alert("Came here");
    let downloadId =
      this.props.user.data[0].id + "_test" + new Date().getTime().toString();
    this.setState({ conStatus: "connecting" });
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
        // alert(res.status);
        if (res.status == "200") {
          setTimeout(async () => {
            let dnldData = [];
            console.log("getting uploads with + " + downloadId);
            dnldData = await getUploadsWithID(downloadId);
            // console.log(dnldData);
            if (dnldData.length == 0) {
              this.setState({ conStatus: "disconnected" });
              this._logoutLogic();
            } else {
              this.setState({ conStatus: "connected" });
              // alert("connected");
            }
          }, 15000);
        }
      })
      .catch((e) => {
        console.log(res.data);
        console.error(e);
        alert("error");
      });
  };
  _logoutLogic = async () => {
    this.setState({ logoutLoading: true });
    if (this.props.user.data[0].gmail == "developer.kevinpaul.aws@gmail.com") {
      this.props.removeUser();
      this.setState({ logoutLoading: false });
    }
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

  logoTitle = () => {
    return this.state.conStatus == "connecting" ? (
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        <Text
          style={{
            fontSize: 14,
            color: theme.blank,
            fontWeight: "bold",
          }}
        >
          connecting
        </Text>
        <ActivityIndicator
          size={14}
          style={{ marginLeft: 5 }}
          color={theme.blank}
        />
      </View>
    ) : (
      <Text style={{ fontSize: 14, color: theme.blank, fontWeight: "bold" }}>
        Gloader
      </Text>
    );
  };

  logoutAlert = () => {
    Alert.alert(
      "Do you want to logout?",
      "This will remove our connection with your drive!",
      [
        {
          text: "cancel",
          onPress: () => {
            console.log("Cancel Pressed");
          },
          style: "cancel",
        },
        {
          text: "LOG OUT",
          onPress: () => {
            this._logoutLogic();
          },
        },
      ]
    );
  };

  headerIcon = () => {
    return (
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {/* <this._logoutModal /> */}
        <TouchableOpacity
          onPress={() => {
            // this.setState({ logOutModalVisible: true });
            // this.logoutAlert();
            Linking.openURL(
              "mailto:developer.kevinpaul@gmail.com?subject=Bug%20Report&body=<Enter the issue here>\n\nRegistered Email Address: " +
                this.props.user.data[0].gmail +
                " \n \n Thank you, \n" +
                this.props.user.data[0].name
            );
          }}
          disabled={this.state.logoutLoading}
          style={{
            // backgroundColor: "blue",
            // width: 70,
            // height: 70,
            // justifyContent: "center",
            // position: "absolute",
            // top: 0,
            // right: 10,
            // zIndex: 100,
            marginRight: 10,
          }}
        >
          <Icon
            name="bug"
            type="ionicon"
            color="white"
            size={20}
            containerStyle={{ alignSelf: "flex-end", marginRight: 5 }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.setState({ logOutModalVisible: true });
            this.logoutAlert();
          }}
          disabled={this.state.logoutLoading}
          style={
            {
              // backgroundColor: "blue",
              // width: 70,
              // height: 70,
              // justifyContent: "center",
              // position: "absolute",
              // top: 0,
              // right: 10,
              // zIndex: 100,
            }
          }
        >
          {this.state.logoutLoading ? (
            <ActivityIndicator color={theme.blank} size={15} />
          ) : (
            <Icon
              name="exit-outline"
              type="ionicon"
              color="white"
              size={20}
              containerStyle={{ alignSelf: "flex-end", marginRight: 5 }}
            />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const Stack = createNativeStackNavigator();

    if (this.props.user.data.length == 0) {
      return (
        <NavigationContainer linking={[Linking.createURL("/")]}>
          <Stack.Navigator
            initialRouteName="signup"
            screenOptions={{
              headerShown: false,
              // headerTitleAlign: "center",
            }}
          >
            <Stack.Screen name="signup" component={SignUp} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    } else if (this.props.user.data.length > 0) {
      return (
        <NavigationContainer>
          <Stack.Navigator
            // initialRouteName="home"
            screenOptions={{
              headerShown: true,
              // headerTitle: this.state.conStatus,
              headerTintColor: theme.mainDark,
              // headerStyle:
            }}
          >
            {/* <Stack.Screen
              options={{
                headerTitle: () => <this.logoTitle />,
                headerStyle: {
                  elevation: 0,
                  shadowOpacity: 0,
                  backgroundColor: theme.mainDark,
                },
                headerRight: () => <this.headerIcon />,
              }}
              name="logout"
              component={this._logoutModal}
            /> */}

            <Stack.Screen
              options={{
                headerTitle: () => <this.logoTitle />,
                headerStyle: {
                  elevation: 0,
                  shadowOpacity: 0,
                  backgroundColor: theme.mainDark,
                },
                headerRight: () => <this.headerIcon />,
              }}
              name="home"
              component={this.MyTabs}
            />
            {/* <this.MyTabs /> */}
          </Stack.Navigator>
        </NavigationContainer>
      );
    } else {
      return (
        <View>
          <Text>Nothingr</Text>
        </View>
      );
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Navigator);
