import React from "react";
import { View, ScrollView, Text, Image } from "react-native";
import { changeColor } from "@utils";

export default function ({ viewWidth, imageSource, imageName, imageRole }) {
  const { textColor } = changeColor();
  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            width: { viewWidth },
            borderBottomColor: textColor,
          }}
          className="items-center justify-center my-5 border-b-[1px]"
        >
          <Image
            source={imageSource}
            headers={{
              Accept: "*/*",
            }}
            className="w-[200px] rounded-full h-[200px]"
          />
          <Text
            style={{
              color: textColor,
            }}
            className="my-2 text-2xl font-bold"
          >
            {imageName}
          </Text>
          <Text
            style={{
              color: textColor,
            }}
            className="mb-2 text-lg font-semibold"
          >
            {imageRole}
          </Text>
        </View>
      </ScrollView>
    </>
  );
}
