import React from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Linking,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
// import * as google from "googleapis";
import LottieView from "lottie-react-native";

import { connect } from "react-redux";
import { fetchUser, removeUser } from "../redux/ActionCreators";

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

class ListingComponent extends React.Component {
  state = {};

  render() {
    return (
      <View>
        <LottieView
          style={{
            width: windowwidth - 40,
            height: windowwidth - 40,
            alignSelf: "center",
            // marginTop: 100,
            // marginLeft: -5,
            marginTop: 20,
          }}
          source={require("../../assets/lottie/under-construction.json")}
          autoPlay
          loop={true}
          // backgroundColor={"red"}
          resizeMode="contain"
        />
      </View>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ListingComponent);
