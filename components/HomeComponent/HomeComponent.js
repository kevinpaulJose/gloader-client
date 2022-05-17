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

class Home extends React.Component {
  componentDidMount() {
    // console.log("From signup");
    // console.log(this.props.user);
  }
  render() {
    const _handlePressButtonAsync = async () => {
      Linking.openURL(
        "https://melodious-crepe-791dff.netlify.app/?email=bkevin1999@gmail.com"
      );
    };
    return (
      <View style={{ marginTop: 100 }}>
        <TouchableOpacity
          onPress={() => {
            _handlePressButtonAsync();
          }}
        >
          <Text>Homes</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Home);
