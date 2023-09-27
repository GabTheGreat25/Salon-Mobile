import React from "react";
import salonLogo from "@assets/salon-logo.png";
import { Image, View, SafeAreaView, Text, TouchableOpacity } from "react-native";
import { changeColor } from "@utils";

export default function () {
  const { backgroundColor, textColor } = changeColor();
  return (
    <>
    <SafeAreaView style={{backgroundColor}} className="bg-primary-accent flex-1 flex-column">
        <View className="flex-1 justify-end items-center">
            <Image
                source={salonLogo}
                // className={`w-100 h-100`}
                resizeMode="cover"
            />
        </View>
        <View className="flex-1 justify-start items-center">
            <Text  style={{ color: textColor }} className={`text-2xl font-base mt-6 mb-2`}>
                Welcome to
            </Text>
            <Text  style={{ color: textColor }} className={`text-[28px] font-semibold`}>
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
