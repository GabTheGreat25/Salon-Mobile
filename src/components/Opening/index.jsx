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
        className={`relative flex-1 ${
          dimensionLayout ? "flex-col" : "flex-row"
        }`}
      >
        <View className={`absolute top-3 z-[1000]`}>
          <TouchableOpacity onPress={navigateBack}>
            <Feather name="chevron-left" size={50} color={textColor} />
          </TouchableOpacity>
        </View>
        <View
          className={`flex-1 ${
            dimensionLayout
              ? "justify-end items-center"
              : "justify-start items-end"
          }`}
        >
          <Image
            source={imageSource}
            className={`flex-1 w-full h-full ${
              dimensionLayout ? "mb-0" : "mb-5"
            }`}
            resizeMode="contain"
          />
        </View>
        <View
          className={`items-center ${
            dimensionLayout ? "justify-start" : "justify-center"
          } flex-1`}
        >
          {showTitle && (
            <Text
              style={{ color: textColor }}
              className={`font-base mb-2 text-2xl ${
                dimensionLayout ? "mt-6" : "mt-0"
              }`}
            >
              {title}
            </Text>
          )}
          {showName && (
            <Text
              style={{ color: textColor }}
              className={`font-semibold text-[28px]`}
            >
              {name}
            </Text>
          )}
          <View className={`flex`}>
            <TouchableOpacity className={`mt-5`} onPress={navigateFirstButton}>
              <View className={`px-12 py-2 rounded-3xl bg-primary-accent`}>
                <Text
                  className={`text-neutral-light font-semibold text-center text-lg`}
                  style={{ color: textColor }}
                >
                  {firstButton}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className={`mt-8`} onPress={navigateSecondButton}>
              <View className={`px-12 py-2 rounded-3xl bg-primary-accent`}>
                <Text
                  className={`text-neutral-light font-semibold text-center text-lg`}
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
