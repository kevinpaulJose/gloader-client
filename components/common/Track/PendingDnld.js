import { Image, ScreenWidth } from "@rneui/base";
import React from "react";
import { Alert } from "react-native";
import { TouchableOpacity } from "react-native";
import { Dimensions, Text, View } from "react-native";
import { deletePending } from "../../../utils/firebase/functions";
import { theme } from "../../theme";

const windowwidth = Dimensions.get("window").width;
const windowheight = Dimensions.get("window").height;

const PendingDnldComponent = (props) => {
  const _renderRemoveActiveAlert = () =>
    Alert.alert(
      "Remove download",
      `This will remove ${props.fileName}. Continue?`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Stop", onPress: () => deletePending(props.id) },
      ]
    );
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "white",
          width: windowwidth - 40,
          height: 70,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,

          elevation: 3,
        }}
      >
        <TouchableOpacity
          onPress={_renderRemoveActiveAlert}
          style={{
            position: "absolute",
            right: 8,
            top: 8,
            width: 20,
            height: 20,
            // backgroundColor: "blue",
            alignItems: "flex-end",
            // justifyContent: "center",
            zIndex: 100,
          }}
        >
          <View
            style={{
              backgroundColor: theme.pendingOrange,
              width: 10,
              height: 3,
              borderRadius: 100,
            }}
          />
        </TouchableOpacity>
        <View
          style={{
            flex: 0.5,
            // backgroundColor: "red",
            // alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: 3,
              height: "60%",
              backgroundColor: theme.pendingOrange,
              marginLeft: 20,
              borderRadius: 20,
            }}
          ></View>
        </View>
        <View style={{ flex: 2.3, justifyContent: "center" }}>
          <View
            style={{
              width: 220,
              height: 23,
              // backgroundColor: "red",
              //   marginTop: 10,
            }}
          >
            <Text style={{ fontSize: 16, color: theme.darkText }}>
              {props.fileName}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              height: 15,
              // backgroundColor: "red",
              width: 220,
              marginTop: 3,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, color: theme.secondryText }}>
                category: {props.category}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, color: theme.secondryText }}>
                folder: {props.folderName}
              </Text>
            </View>
          </View>
        </View>
        {/* <View
          style={{
            flex: 1,
            // backgroundColor: "red",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: theme.mediumLightText, fontSize: 12 }}>
            {props.total}
          </Text>
        </View> */}
      </View>
    </View>
  );
};

export default PendingDnldComponent;
