import React from "react";
import salonLogo from "@assets/salon-logo.png";
import salonLogoWhite from "@assets/salon-logo-white.png";
import {
  Image,
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from "react-native";
import { changeColor } from "@utils";
import { Feather } from "@expo/vector-icons";

export default function ({
  title,
  showTitle,
  name,
  showName,
  firstButton,
  navigateFirstButton,
  secondButton,
  navigateSecondButton,
  navigateBack,
  dimensionLayout,
}) {
  const { backgroundColor, textColor, colorScheme } = changeColor();
  const imageSource = colorScheme === "dark" ? salonLogoWhite : salonLogo;
  return (
    <>
      <SafeAreaView
        style={{ backgroundColor }}
        className={`flex-1 ${dimensionLayout ? "flex-col" : "flex-row"}`}
      >
        <TouchableOpacity
          className={`absolute w-full ${
            dimensionLayout ? "top-[2%]" : "top-[4.5%]"
          }`}
          onPress={navigateBack}
        >
          <Feather name="chevron-left" size={50} color={textColor} />
        </TouchableOpacity>
        <View
          className={`flex-1 ${
            dimensionLayout
              ? "justify-end items-center"
              : "justify-start items-end"
          }`}
        >
          <Image source={imageSource} resizeMode="cover" />
        </View>
        <View
          className={`items-center ${
            dimensionLayout ? "justify-start" : "justify-center"
          } flex-1`}
        >
          {showTitle && (
            <Text
              style={{ color: textColor }}
              className={`font-base mb-2 ${
                dimensionLayout ? "text-2xl mt-6" : "text-3xl mt-0"
              }`}
            >
              {title}
            </Text>
          )}
          {showName && (
            <Text
              style={{ color: textColor }}
              className={`font-semibold ${
                dimensionLayout ? "text-[28px] " : "text-[32px]"
              }`}
            >
              {name}
            </Text>
          )}
          <View className={`flex`}>
            <TouchableOpacity className={`mt-10`} onPress={navigateFirstButton}>
              <View className={`px-12 py-2 rounded-3xl bg-primary-accent`}>
                <Text
                  className={`text-neutral-light font-semibold text-center text-2xl`}
                  style={{ color: textColor }}
                >
                  {firstButton}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              className={`mt-10`}
              onPress={navigateSecondButton}
            >
              <View className={`px-12 py-2 rounded-3xl bg-primary-accent`}>
                <Text
                  className={`text-neutral-light font-semibold text-center text-2xl`}
                  style={{ color: textColor }}
                >
                  {secondButton}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
