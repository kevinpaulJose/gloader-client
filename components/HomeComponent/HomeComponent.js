import React from "react";
import { Linking, Text, Touchable, TouchableOpacity, View } from "react-native";
// import * as google from "googleapis";
import * as axios from "axios";
import * as WebBrowser from "expo-web-browser";
import { connect } from "react-redux";
import { fetchUser, removeUser } from "../redux/ActionCreators";

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchUser: ({ email }) => dispatch(fetchUser({ email: email })),
  removeUser: ({ token, og }) => dispatch(removeUser({ token, og })),
});

class Home extends React.Component {
  componentDidMount() {
    // console.log("From signup");
    // console.log(this.props.user);
  }
  render() {
    return (
      <View style={{ marginTop: 100 }}>
        <TouchableOpacity>
          <Text>Homes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.props.removeUser({
              token: this.props.user.data[0].refreshToken,
              og: this.props.user.data,
            });
          }}
        >
          <Text>logout</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Home);
