import React from "react";
import { View, Text, Dimensions } from "react-native";
import { changeColor } from "@utils";

const { width: deviceWidth } = Dimensions.get("window");

export default function (props) {
  const { title, icon, data, id, backgroundColor } = props;
  const { shadowColor, colorScheme } = changeColor();
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

  const customWidth = deviceWidth * 0.6;

  return (
    <>
      <View
        style={{ width: customWidth, backgroundColor: backgroundColor }}
        className={`flex-1 mb-4 rounded-md shadow-lg`}
        key={id}
      >
        <View
          style={{ shadowColor }}
          className={`flex flex-row justify-between items-center p-4 rounded-md`}
        >
          <View className={`flex flex-col items-center justify-center`}>
            <View className={`flex flex-row gap-2`}>
              <Text
                style={{ color: invertTextColor }}
                className={`text-lg font-semibold`}
              >
                {title}
              </Text>
              <Text
                style={{ color: invertTextColor }}
                className={`text-2xl font-bold px-1`}
              >
                {data}
              </Text>
            </View>
          </View>
          <View className={`flex items-end`}>{icon}</View>
        </View>
      </View>
    </>
  );
}
