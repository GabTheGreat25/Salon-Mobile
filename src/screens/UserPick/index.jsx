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

export default function () {
  const { backgroundColor, textColor, colorScheme } = changeColor();
  const imageSource = colorScheme === "dark" ? salonLogoWhite : salonLogo;
  return (
    <>
      <SafeAreaView style={{ backgroundColor }} className="flex-1 flex-column">
        <View className="items-center justify-end flex-1">
          <Image source={imageSource} resizeMode="cover" />
        </View>
        <View className="items-center justify-start flex-1">
          <Text
            style={{ color: textColor }}
            className={`text-2xl font-base mt-6 mb-2`}
          >
            Welcome to
          </Text>
          <Text
            style={{ color: textColor }}
            className={`text-[28px] font-semibold`}
          >
            Lanlee Beauty Lounge
          </Text>
          <TouchableOpacity className={`flex`}>
            <View className={`mt-10 w-full`}>
              <View className={`px-12 py-2 rounded-3xl bg-primary-accent`}>
                <Text
                  className={`text-neutral-light font-semibold text-center text-lg`}
                  style={{ color: textColor }}
                >
                  LogIn
                </Text>
              </View>
            </View>
            <View className={`mt-10 w-full`}>
              <View className={`px-[42px] py-2 rounded-3xl bg-primary-accent`}>
                <Text
                  className={`text-neutral-light font-semibold text-center text-lg`}
                  style={{ color: textColor }}
                >
                  SignUp
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}
