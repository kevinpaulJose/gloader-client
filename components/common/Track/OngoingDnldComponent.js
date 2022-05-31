import { Image, ScreenWidth } from "@rneui/base";
import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../../theme";

const windowwidth = Dimensions.get("window").width;
const windowheight = Dimensions.get("window").height;

const OngoingDnldComponent = (props) => {
  // alert(props.currentStatus);
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
        <TouchableOpacity
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
          ></View>
        </TouchableOpacity>

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
                {props.completed} / {props.total}
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
