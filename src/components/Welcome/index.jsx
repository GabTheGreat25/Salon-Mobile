import React from "react";
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { changeColor } from "@utils";
import { RESOURCE } from "@constants";

export default function ({
  title,
  description,
  buttonTitle,
  leftArrow,
  rightArrow,
  navigateLeft,
  navigateRight,
  navigateTo,
  logo,
  dimensionLayout,
}) {
  const { backgroundColor, textColor } = changeColor();
  return (
    <>
      <SafeAreaView
        className={`flex-1 ${dimensionLayout ? "flex-col" : "flex-row"}`}
        style={{ backgroundColor }}
      >
        <View className={`flex-1 ${dimensionLayout ? "flex-col" : "flex-row"}`}>
          <View
            className={`flex-1 justify-center items-start ${
              dimensionLayout ? "pl-6" : "pl-12"
            }`}
          >
            {leftArrow && (
              <TouchableOpacity
                className={`absolute ${
                  dimensionLayout ? "top-[85%]" : "top-[45%]"
                }`}
                onPress={navigateLeft}
              >
                <Feather
                  name="chevron-left"
                  size={RESOURCE.NUMBER.FIFTY}
                  color={textColor}
                />
              </TouchableOpacity>
            )}
            <Text
              className={`text-4xl font-semibold mb-2`}
              style={{ color: textColor }}
            >
              {title}
            </Text>
            <Text className={`text-xl font-light`} style={{ color: textColor }}>
              {description}
            </Text>
            <TouchableOpacity onPress={navigateTo}>
              <View className={`self-start mt-3 w-full`}>
                <View className={`px-6 py-2 rounded-lg bg-primary-accent`}>
                  <Text
                    className={`text-neutral-light font-semibold text-center text-lg`}
                    style={{ color: textColor }}
                  >
                    {buttonTitle}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            {rightArrow && (
              <TouchableOpacity
                className={`absolute top-[85%] ${
                  dimensionLayout
                    ? "left-[93.5%] translate-x-[-50%]"
                    : "left-[193.5%] top-[45%] translate-x-[-50%]"
                }`}
                onPress={navigateRight}
              >
                <Feather
                  name="chevron-right"
                  size={RESOURCE.NUMBER.FIFTY}
                  color={textColor}
                />
              </TouchableOpacity>
            )}
          </View>
          <View className={`flex-1 justify-center items-center z-[-1]`}>
            {dimensionLayout ? (
              <Image
                source={logo}
                className={`w-full h-full`}
                resizeMode="cover"
              />
            ) : (
              <ScrollView
                contentContainerStyle={{
                  flexGrow: RESOURCE.NUMBER.ONE,
                  alignItems: "center",
                }}
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                <Image
                  source={logo}
                  className={`w-full h-full`}
                  resizeMode="cover"
                />
              </ScrollView>
            )}
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
