import { Text } from "@rneui/base";
import React from "react";
import { View } from "react-native";

export default FolderViewComponent = (props) => {
  return (
    <View
      style={{
        backgroundColor: "red",
        height: 100,
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      <Text style={{}}>{props.folder.folderName}</Text>
    </View>
  );
};
