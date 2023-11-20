import React from "react";
import { View, Text, Dimensions } from "react-native";
import { changeColor, dimensionLayout } from "@utils";

export default function CustomCard(props) {
  const isDimensionLayout = dimensionLayout();
  const { width: deviceWidth } = Dimensions.get("window");
  const { title, icon, data, id, backgroundColor } = props;
  const { textColor, shadowColor } = changeColor();

  const customWidth = deviceWidth * (isDimensionLayout ? 0.5 : 0.25);

  return (
    <View
      style={{ width: customWidth, backgroundColor: backgroundColor }}
      className={`flex-1 mb-4 rounded-md shadow-lg`}
      key={id}
    >
      <View
        style={{ shadowColor }}
        className={`flex flex-row justify-between items-center p-4 rounded-md`}
      >
        <View className={`flex flex-col items-start`}>
          <View className={`flex flex-row gap-2`}>
            <Text
              style={{ color: textColor }}
              className={`text-lg font-semibold`}
            >
              {title}
            </Text>
            <Text style={{ color: textColor }} className={`text-2xl font-bold`}>
              {data}
            </Text>
          </View>
        </View>
        <View className={`flex items-end`}>{icon}</View>
      </View>
    </View>
  );
}
