import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  View,
  Text,
  Button,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Platform,
} from "react-native";
import { theme } from "../theme";

const windowwidth = Dimensions.get("window").width;
const windowheight = Dimensions.get("window").height + StatusBar.currentHeight;

const HeaderTextComponent = (props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  //   const fadeAnimText = useRef(new Animated.Value(0).current);

  const fadeIn = () => {
    // Animated.spring(fadeAnim);
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      //   useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(fadeAnim, {
      toValue: -130,
      duration: 500,
      //   useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (props.shown) {
      fadeIn();
    } else {
      fadeOut();
    }
  }, [props.shown]);

  const _checkRefreshToken = () => {
    this.setState({ googleConnectionIsChecking: true });
  };

  return (
    <View style={{ marginTop: StatusBar.currentHeight + 30 }}>
      {Platform.OS == "ios" ? (
        <View
          style={[
            {
              width: windowwidth,
              //   backgroundColor: "red",
              alignItems: "center",
              marginTop: 30,
              height: 130,
            },
          ]}
        >
          <View style={{}}>
            <Text
              style={{
                color: "white",
                fontSize: 30,
                textAlign: "center",
              }}
            >
              {"Hola,"}
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: 30,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {props.name + "!"}
            </Text>
          </View>
        </View>
      ) : (
        <View style={{ marginTop: -StatusBar.currentHeight }}>
          <Animated.View
            style={[
              {
                width: windowwidth,
                // backgroundColor: "red",
                alignItems: "center",
                // marginTop: 30,
              },
              {
                marginTop: fadeAnim,
                height: 130,
              },
            ]}
          >
            <View style={{}}>
              <Text
                style={{
                  color: "white",
                  fontSize: 30,
                  textAlign: "center",
                }}
              >
                {"Hola,"}
              </Text>
              <Text
                style={{
                  color: "white",
                  fontSize: 30,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {props.name + "!"}
              </Text>
              <Text
                style={{
                  color: theme.mainLight,
                  alignSelf: "center",
                  fontSize: 12,
                  opacity: 0.5,
                }}
              >
                google: {props.conStatus}
              </Text>
            </View>
            {/* <View style={{ padding: 60, backgroundColor: "red" }}></View> */}
          </Animated.View>
        </View>
      )}
    </View>
  );
};

export default HeaderTextComponent;
