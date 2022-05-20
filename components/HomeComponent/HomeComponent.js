import React from "react";
import {
  Animated,
  Dimensions,
  Linking,
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

class Home extends React.Component {
  state = {
    headerShown: true,
    currentTab: "track",
    conStatus: true,
    animatedTrack: new Animated.Value(windowwidth),
    animatedLib: new Animated.Value(0),
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

  animatedTrack = () => {
    Animated.timing;
  };
  render() {
    return (
      <View style={{ height: windowheight }}>
        <LinearGradient
          colors={[theme.mainDark, theme.mainLight]}
          style={{ height: windowheight }}
        >
          <HeaderTextComponent
            name={this.props.user.data[0].name}
            shown={this.state.headerShown}
            conStatus={this.state.conStatus}
          />
          <this._tabComponent />
          {this.state.currentTab === "track" ? (
            <TrackComponent />
          ) : (
            <LibComponent />
          )}
        </LinearGradient>
        <StatusBar backgroundColor={theme.mainDark} />
      </View>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Home);
