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
import { BackIcon } from "@helpers";

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
}) {
  const { backgroundColor, textColor, colorScheme } = changeColor();
  const imageSource = colorScheme === "dark" ? salonLogoWhite : salonLogo;

  return (
    <>
      <SafeAreaView
        style={{ backgroundColor }}
        className={`relative flex-1 flex-col`}
      >
        <BackIcon navigateBack={navigateBack} textColor={textColor} />
        <View className={`flex-1 justify-start items-center flex-col`}>
          <View className={`flex-1 justify-end items-start`}>
            <Image
              source={imageSource}
              className={`mb-0`}
              resizeMode="contain"
            />
          </View>
          <View className={`items-center justify-start flex-1`}>
            {showTitle && (
              <Text
                style={{ color: textColor }}
                className={`font-base mb-2 text-3xl mt-8`}
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
            <View>
              {firstButton !== null && (
                <TouchableOpacity
                  className={`mt-5`}
                  onPress={navigateFirstButton}
                >
                  <View className={`px-14 py-2 rounded-3xl bg-primary-accent`}>
                    <Text
                      className={`font-normal text-center text-2xl`}
                      style={{ color: textColor }}
                    >
                      {firstButton}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                className={`mt-8`}
                onPress={navigateSecondButton}
              >
                <View className={`px-14 py-2 rounded-3xl bg-primary-accent`}>
                  <Text
                    className={`font-normal text-center text-2xl`}
                    style={{ color: textColor }}
                  >
                    {secondButton}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
