import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import { connect } from "react-redux";
import { fetchUser, stopFetching } from "../redux/ActionCreators";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { theme } from "../theme";
import LottieView from "lottie-react-native";
import { Icon } from "@rneui/themed";
import { baseURL } from "../../utils/config";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height + StatusBar.currentHeight;

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchUser: ({ email }) => dispatch(fetchUser({ email: email })),
  stopFetching: () => dispatch(stopFetching()),
});

class SignUp extends React.Component {
  state = {
    fontsLoaded: true,
    email: "",
    error: false,
  };

  componentDidMount() {}
  _isValidEmail(email) {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  _handlePressButtonAsync = async () => {
    let valid = this._isValidEmail(this.state.email);
    if (!valid) {
      this.setState({ error: true });
    } else {
      if (this.state.email == "developer.kevinpaul.aws@gmail.com") {
        this.props.fetchUser({ email: this.state.email.toLowerCase() });
      } else {
        this.props.fetchUser({ email: this.state.email.toLowerCase() });
        Linking.openURL(
          baseURL.web_uri + "/?email=" + this.state.email.toLowerCase()
        );
      }
    }
  };
  render() {
    return this.state.fontsLoaded ? (
      <ScrollView>
        <KeyboardAwareScrollView>
          <View
            style={{
              width: windowWidth,
              height: windowHeight,
              backgroundColor: theme.blank,
              flexDirection: "column",
            }}
          >
            <View
              style={{
                flex: 1.5,
                backgroundColor: theme.blank,
                // backgroundColor: "blue",
              }}
            >
              <View
                style={{
                  alignSelf: "center",
                  marginTop: -20,
                }}
              >
                <Image
                  source={require("../../assets/images/landing.png")}
                  style={{ width: windowWidth - 140, height: windowHeight / 2 }}
                  resizeMode={"contain"}
                />
              </View>
              <LottieView
                style={{
                  width: 120,
                  height: 120,
                  alignSelf: "center",
                  marginTop: -30,
                  marginLeft: -5,
                }}
                source={require("../../assets/lottie/google-logo.json")}
                autoPlay
                // loop={false}
                // backgroundColor={"red"}
                resizeMode="contain"
              />
              {/* </View> */}
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: "white",
                margin: 10,
                borderRadius: 30,
              }}
            >
              <View
                style={{
                  width: 80,
                  height: 10,
                  // backgroundColor: "yellow",
                  alignSelf: "center",
                  flexDirection: "row",
                  marginTop: 20,
                }}
              >
                <View
                  style={{
                    flex: 5,
                    backgroundColor: theme.mainDark,
                    borderRadius: 50,
                  }}
                ></View>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: theme.mainLight,
                    marginLeft: 3,
                    borderRadius: 100,
                  }}
                ></View>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: theme.mainLight,
                    marginLeft: 3,
                    borderRadius: 100,
                  }}
                ></View>
              </View>
              <View style={{ alignSelf: "center", marginTop: 40 }}>
                <Text
                  style={{
                    fontSize: 27,
                    fontWeight: "bold",
                  }}
                >
                  Straight into the drive
                </Text>
              </View>

              <View style={{ alignSelf: "center", marginTop: 15 }}>
                <TextInput
                  style={{
                    fontSize: 16,
                    color: this.state.error ? "red" : "black",
                  }}
                  placeholder="your google account"
                  placeholderTextColor={
                    this.state.error ? "red" : theme.secondryText
                  }
                  value={this.state.email}
                  onChangeText={(v) =>
                    this.setState({ email: v, error: false })
                  }
                  keyboardType="email-address"
                />
              </View>
              {!this.props.user.isLoading && (
                <View
                  activeOpacity={0.8}
                  style={{
                    alignSelf: "center",
                    marginTop: 15,
                    // display: "none",
                  }}
                >
                  <Text
                    style={{
                      color: theme.mainDark,
                      fontSize: 14,
                      // fontWeight: "bold",
                    }}
                  ></Text>
                </View>
              )}
              {this.props.user.isLoading && (
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ email: "" });
                    this.props.stopFetching();
                  }}
                  activeOpacity={0.8}
                  style={{
                    alignSelf: "center",
                    marginTop: 15,
                    // display: "none",a
                  }}
                >
                  <Text
                    style={{
                      color: theme.mainDark,
                      fontSize: 14,
                      // fontWeight: "bold",
                    }}
                  >
                    Change Gmail ID?
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                disabled={this.props.user.isLoading}
                onPress={() => this._handlePressButtonAsync()}
                activeOpacity={0.8}
                style={{
                  width: 70,
                  height: 70,
                  backgroundColor: theme.mainDark,
                  alignSelf: "center",
                  marginTop: 20,
                  borderRadius: 20,

                  shadowColor: theme.mainDark,
                  shadowOffset: {
                    width: 0,
                    height: 10,
                  },
                  shadowOpacity: 0.34,
                  shadowRadius: 6.27,

                  elevation: 10,
                  justifyContent: "center",
                }}
              >
                {this.props.user.isLoading ? (
                  <View>
                    <ActivityIndicator color={"white"} />
                  </View>
                ) : (
                  <Icon
                    name="chevron-forward-outline"
                    type="ionicon"
                    color="white"
                    size={30}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
    ) : (
      <ActivityIndicator color={theme.mainDark} />
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
