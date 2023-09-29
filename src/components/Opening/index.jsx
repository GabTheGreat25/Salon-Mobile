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
        className={`flex-1 flex-column`}
      >
        <TouchableOpacity
          className={`absolute ${dimensionLayout ? "top-[2%]" : "top-[2%]"}`}
          onPress={navigateBack}
        >
          <Feather name="chevron-left" size={50} color={textColor} />
        </TouchableOpacity>
        <View className={`items-center justify-end flex-1`}>
          <Image source={imageSource} resizeMode="cover" />
        </View>
        <View className={`items-center justify-start flex-1`}>
          {showTitle && (
            <Text
              style={{ color: textColor }}
              className={`text-2xl font-base mt-6 mb-2`}
            >
              {title}
            </Text>
          )}
          {showName && (
            <Text
              style={{ color: textColor }}
              className={`text-[28px] font-semibold`}
            >
              {name}
            </Text>
          )}
          <View className={`flex`}>
            <TouchableOpacity className={`mt-10`} onPress={navigateFirstButton}>
              <View className={`px-12 py-2 rounded-3xl bg-primary-accent`}>
                <Text
                  className={`text-neutral-light font-semibold text-center text-lg`}
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
