import { View, TouchableOpacity, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import SignUp from "./SignupComponent/SignupComponent";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { fetchUser } from "./redux/ActionCreators";
import { connect } from "react-redux";
import Home from "./HomeComponent/HomeComponent";
import * as Linking from "expo-linking";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchUser: ({ email }) => dispatch(fetchUser({ email: email })),
});

class Navigator extends React.Component {
  componentDidMount() {
    // this.props.fetchUser({ email: "kpaul@flowmed.ca" });
    if (this.props.user.data.length == 0) {
      // this.props.fetchUser({ email: "kpaul@flowmed.ca" });
    }
    console.log(this.props.user);
  }

  MyTabs = () => {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    );
  };

  render() {
    const Stack = createNativeStackNavigator();
    const Tab = createMaterialTopTabNavigator();
    if (this.props.user.data.length == 0) {
      return (
        <NavigationContainer linking={[Linking.createURL("/")]}>
          <Stack.Navigator
            initialRouteName="signup"
            screenOptions={{
              headerShown: false,
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
            initialRouteName="home"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="home" component={Home} />
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
