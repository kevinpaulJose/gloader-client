import { View, TouchableOpacity, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
// import * as firebase from "firebase/app";
// import { fireApp } from "../utils/firebase/config";

import * as GoogleAuthentication from "expo-google-app-auth";

export default class Navigator extends React.Component {
  storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("@user_data", jsonValue);
    } catch (e) {
      console.log(e);
    }
  };

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem("@user_data");
      if (value !== null) {
        console.log(value);
      } else {
        console.log("null");
      }
    } catch (e) {
      console.log(e);
    }
  };
  deleteData = async () => {
    try {
      await AsyncStorage.removeItem("@user_data");
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const signInWithGoogle = () =>
      GoogleAuthentication.logInAsync({
        androidClientId:
          "346457672075-bhfqiseq566tt03shnnehcvbrdamdkh7.apps.googleusercontent.com",
        // androidStandaloneAppClientId: 'ANDROID_STANDALONE_APP_CLIENT_ID',
        // iosStandaloneAppClientId: 'IOS_STANDALONE_APP_CLIENT_ID',
        scopes: ["profile", "email"],
      })
        .then((logInResult) => {
          if (logInResult.type === "success") {
            const { idToken, accessToken } = logInResult;
            const credential = firebase.auth.GoogleAuthProvider.credential(
              idToken,
              accessToken
            );

            return firebase.auth().signInWithCredential(credential);
            // Successful sign in is handled by firebase.auth().onAuthStateChanged
          }
          return Promise.reject(); // Or handle user cancelation separatedly
        })
        .catch((error) => {
          // ...
        });
    return (
      <View style={{ marginTop: 20 }}>
        <TouchableOpacity
          onPress={() =>
            this.storeData({
              email: "bkevin1999@gmail.com",
              name: "kevin",
              token: "123",
            })
          }
        >
          <Text>Add Data</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.getData}>
          <Text>get Data</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.deleteData}>
          <Text>delete Data</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => signInWithGoogle()}>
          <Text>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
