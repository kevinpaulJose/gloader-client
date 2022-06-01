import React from "react";
import { Text } from "@rneui/base";
import { View } from "react-native";
import { FlatGrid } from "react-native-super-grid";
import FolderViewComponent from "./FolderViewComponent";

export default FolderGridComponent = (props) => {
  return (
    <View>
      <FlatGrid
        itemDimension={130}
        data={props.folders}
        renderItem={({ item }) => <FolderViewComponent folder={item} />}
      />
    </View>
  );
};
