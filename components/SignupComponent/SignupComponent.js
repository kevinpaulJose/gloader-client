import React from "react";
import { Text, Touchable, TouchableOpacity, View } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";

export default function SignUp() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "346457672075-csbs06rf0ajflnhjes9mvber1ops87h9.apps.googleusercontent.com",
    androidClientId:
      "346457672075-bhfqiseq566tt03shnnehcvbrdamdkh7.apps.googleusercontent.com",
    scopes: ["profile", "email", "https://www.googleapis.com/auth/drive"],
    redirectUri: redirectUri,
    access_type: "offline",
    accessType: "offline",
  });
  const redirectUri = makeRedirectUri({
    scheme: "com.kjcreations.gloader",
  });

  React.useEffect(() => {
    if (response == "success") {
      const [authentication] = response;
      //   console.log(response);
    } else {
      console.log(response);
    }
  }, [response]);
  return (
    <View style={{ marginTop: 100 }}>
      <TouchableOpacity onPress={() => promptAsync()}>
        <Text>Signup</Text>
      </TouchableOpacity>
    </View>
  );
}
