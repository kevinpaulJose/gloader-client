import { Image, Text } from "@rneui/base";
import React, { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { getDownloadsWithID } from "../../../utils/firebase/functions";
import { theme } from "../../theme";

const _getFileType = (fileName) => {
  let fileType = "common";
  const mediaType = ["mp4", "mkv", "mov", "wmv", "avi", "webm"];
  const archiveType = ["zip", "rar", "exe", "bin", "msi", "7z"];
  const vrType = ["3dh", "3dv", "180x180", "360_", "3D-SBS", "3d-OU"];
  let ext = fileName.split(".").pop();
  if (mediaType.includes(ext)) {
    fileType = "media";
  }
  if (archiveType.includes(ext)) {
    fileType = "archive";
  }
  vrType.forEach((v, i) => {
    if (fileName.toLowerCase().indexOf(v.toLowerCase()) !== -1) {
      fileType = "vr";
    }
  });

  // console.log(fileType);
  switch (fileType) {
    case "media":
      return require("../../../assets/images/video.png");
    case "vr":
      return require("../../../assets/images/vr.png");
    default:
      return require("../../../assets/images/default.png");
  }
};

export default FileViewComponent = (props) => {
  const [url, setUrl] = useState("nothing");
  const getImage = (downloadId) => {
    const correspondingDownload = getDownloadsWithID(downloadId).then(
      (value) => {
        setUrl(value[0].img);
      }
    );
  };
  const getFileName = () => {
    let temp = props.fileName;
    temp = temp.split("_").join(" ").replace("VRBANGERS", "").trim();

    const unwantedExtensions = [
      "mp4",
      "mkv",
      "mov",
      "wmv",
      "avi",
      "webm",
      "zip",
      "rar",
      "exe",
      "bin",
      "msi",
      "7z",
      "3dh",
      "3dv",
      "180x180",
      "360_",
      "3D-SBS",
      "3d-OU",
    ];
    for (const ex of unwantedExtensions) {
      temp = temp.replace(ex, "").replace(".", "").trim();
    }
    return temp;
  };

  getImage(props.downloadId);
  getFileName();
  return (
    <>
      <Image
        source={url == "nothing" ? _getFileType(props.fileName) : { uri: url }}
        PlaceholderContent={<ActivityIndicator />}
        style={{
          width: props.width,
          height: props.height,
          resizeMode: "cover",
        }}
      />
      <Text
        style={{
          marginTop: 3,
          fontSize: 12,
          color: theme.textforDarkBG,
          marginLeft: 10,
          marginRight: 10,
          marginTop: 5,
          textTransform: "capitalize",
        }}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {getFileName()}
      </Text>
    </>
  );
};
