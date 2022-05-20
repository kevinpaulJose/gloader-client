import React from "react";
import {
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
    // console.log("From signup");
    // console.log(this.props.user);
  }
  state = {};

  render() {
    return (
      <View
        style={{
          height: windowheight - 130 + 10,
          backgroundColor: theme.blank,
          width: windowwidth,
          marginTop: 10,
        }}
      ></View>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(LibComponent);
