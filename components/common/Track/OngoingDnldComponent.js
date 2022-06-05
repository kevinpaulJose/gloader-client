import { Image, ScreenWidth } from "@rneui/base";
import React from "react";
import { Alert } from "react-native";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { stopDownload } from "../../../utils/firebase/functions";
import { theme } from "../../theme";

const windowwidth = Dimensions.get("window").width;
const windowheight = Dimensions.get("window").height;

const OngoingDnldComponent = (props) => {
  const _renderRemoveActiveAlert = () =>
    Alert.alert(
      "Stop download",
      `This will stop downloading ${props.fileName}. Continue?`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Stop", onPress: () => stopDownload(props.id) },
      ]
    );
  const convertGB = (total, current) => {
    let correctTotal = parseFloat(total);
    let correctCurrent = parseFloat(current);
    if (parseInt(correctTotal) > 1024) {
      correctTotal = (correctTotal / 1024).toFixed(2);
      correctCurrent = (correctCurrent / 1024).toFixed(2);
      return (
        correctCurrent.toString() +
        "GB" +
        " / " +
        correctTotal.toString() +
        "GB"
      );
    }
    return (
      correctCurrent.toFixed(2).toString() +
      "MB" +
      " / " +
      correctTotal.toFixed(2).toString() +
      "MB"
    );
  };

  return (
    <View key={props.id}>
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "white",
          width: windowwidth - 40,
          height: 100,
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
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {props.isURL ? (
            <View />
          ) : (
            <Image
              source={props.img}
              style={{
                width: 80,
                height: 80,
                resizeMode: "contain",
                // backgroundColor: "red",
              }}
            />
          )}
        </View>
        {/* {props.currentStatus.toLowerCase() != "uploading" && (
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
        )} */}

        <View style={{ flex: 2.3 }}>
          <View
            style={{
              width: 220,
              height: 23,
              // backgroundColor: "red",
              marginTop: 10,
            }}
          >
            <Text style={{ fontSize: 18, color: theme.darkText }}>
              {props.fileName}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              height: 15,
              // backgroundColor: "red",
              width: 220,
              marginTop: 5,
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
          <View
            style={{
              flexDirection: "row",
              height: 15,
              // backgroundColor: "red",
              width: 220,
              marginTop: 15,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, color: theme.mediumLightText }}>
                {convertGB(props.total, props.completed)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, color: theme.mediumLightText }}>
                {"status:"} {props.currentStatus.toLowerCase()}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          backgroundColor: theme.progressGreen,
          width: props.percentage,
          height: 3,
        }}
      ></View>
    </View>
  );
};

export default OngoingDnldComponent;
