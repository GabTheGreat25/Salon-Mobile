import React from "react";
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
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
}) {
  const { backgroundColor, textColor } = changeColor();
  return (
    <>
      <SafeAreaView className={`flex-1 flex-col`} style={{ backgroundColor }}>
        <View className={`flex-1 flex-col`}>
          <View
            className={`flex-1 justify-center items-start pl-6
            `}
          >
            {leftArrow && (
              <TouchableOpacity
                className={`absolute top-[85%]`}
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
              className={`text-3xl font-semibold mb-2`}
              style={{ color: textColor }}
            >
              {title}
            </Text>
            <Text
              className={`text-base font-light pr-6`}
              style={{ color: textColor }}
            >
              {description}
            </Text>
            <TouchableOpacity onPress={navigateTo}>
              <View className={`self-start mt-3 w-full`}>
                <View className={`px-6 py-2 mb-5 rounded-lg bg-primary-accent`}>
                  <Text
                    className={`text-neutral-light font-semibold text-center text-base`}
                    style={{ color: textColor }}
                  >
                    {buttonTitle}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            {rightArrow && (
              <TouchableOpacity
                className={`absolute top-[85%] left-[93.5%] translate-x-[-50%]`}
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
            <Image
              source={logo}
              className={`w-full h-full`}
              resizeMode="cover"
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
