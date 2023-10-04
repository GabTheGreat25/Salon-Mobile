import React from "react";
import { View, ScrollView, Text, Image } from "react-native";
import { changeColor } from "@utils";

export default function ({ viewWidth, imageSource, imageName, imageRole }) {
  const { textColor } = changeColor();
  return (
    <>
      <ScrollView>
        <View
          style={{
            width: { viewWidth },
            borderBottomColor: textColor,
          }}
          className="items-center justify-center my-5 border-b-[1px]"
        >
          <Image
            source={imageSource}
            className="w-[150px] rounded-full h-[150px]"
          />
          <Text
            style={{
              color: textColor,
            }}
            className="mt-2 text-2xl font-bold"
          >
            {imageName}
          </Text>
          <Text
            style={{
              color: textColor,
            }}
            className="mb-2 text-sm"
          >
            {imageRole}
          </Text>
        </View>
      </ScrollView>
    </>
  );
}