import React from "react";
import { Linking, Text, Touchable, TouchableOpacity, View } from "react-native";
// import * as google from "googleapis";
import * as axios from "axios";
import * as WebBrowser from "expo-web-browser";
import { connect } from "react-redux";
import { fetchUser } from "../redux/ActionCreators";

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchUser: ({ email }) => dispatch(fetchUser({ email: email })),
});

class SignUp extends React.Component {
  componentDidMount() {
    // console.log("From signup");
    // console.log(this.props.user);
  }
  render() {
    const _handlePressButtonAsync = async () => {
      this.props.fetchUser({ email: "developer.kevinpaul@gmail.com" });
      Linking.openURL(
        "https://melodious-crepe-791dff.netlify.app/?email=developer.kevinpaul@gmail.com"
      );
    };
    return (
      <View style={{ marginTop: 100 }}>
        <TouchableOpacity
          onPress={() => {
            _handlePressButtonAsync();
          }}
        >
          <Text>Signup {this.props.user.isLoading && " Loading..."}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
