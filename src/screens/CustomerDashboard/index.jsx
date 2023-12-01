import React from "react";
import { View, Text, Image, Dimensions } from "react-native";
import Salon from "@assets/salon-bg.png";
import SalonService from "@assets/salon-service.png";
import SalonHair from "@assets/salon-hair.png";
import SalonFootSpa from "@assets/foot-spa.png";
import SalonLipstick from "@assets/lipstick.png";
import { changeColor, dimensionLayout } from "@utils";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function () {
  const { textColor, backgroundColor, shadowColor, colorScheme } =
    changeColor();
  const isDimensionLayout = dimensionLayout();
  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#212B36";
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

  return (
    <View
      className={`flex-1`}
      style={{
        backgroundColor,
      }}
    >
      <View className={`flex-row justify-center items-center pt-5`}>
        <View
          style={{
            shadowColor,
            backgroundColor: invertBackgroundColor,
            height: windowHeight * 0.2,
            width: windowWidth * 0.35,
          }}
          className={`rounded flex-col shadow-2xl mx-1`}
        >
          <View className={`justify-end items-center h-1/2 pt-5`}>
            <Text
              style={{ color: invertTextColor }}
              className={`flex-1 text-base p-1 font-semibold`}
            >
              Pick our best offers!
            </Text>
          </View>
          <View className={`justify-end items-center h-1/2`}>
            <Image
              source={Salon}
              resizeMode="cover"
              className={`h-full w-full`}
            />
          </View>
        </View>

        <View
          style={{
            shadowColor,
            backgroundColor: invertBackgroundColor,
            height: windowHeight * 0.2,
            width: windowWidth * 0.25,
          }}
          className={`rounded flex-col shadow-2xl mx-1`}
        >
          <View className={`justify-end items-center h-1/2`}>
            <Image
              source={SalonService}
              resizeMode="cover"
              className={`h-full w-full`}
            />
          </View>
          <View className={`justify-end items-center h-1/2`}>
            <Text
              style={{ color: invertTextColor }}
              className={`flex-1 text-base p-[7.25px] font-semibold`}
            >
              High Quality Service
            </Text>
          </View>
        </View>

        <View
          style={{
            shadowColor,
            backgroundColor: invertBackgroundColor,
            height: windowHeight * 0.2,
            width: windowWidth * 0.25,
          }}
          className={`rounded flex-col shadow-2xl mx-1`}
        >
          <View className={`justify-end items-center h-1/2 pt-5`}>
            <Text
              style={{ color: invertTextColor }}
              className={`flex-1 text-base font-semibold`}
            >{`Hair\nStyles`}</Text>
          </View>
          <View className={`justify-end items-center h-1/2`}>
            <Image
              source={SalonHair}
              resizeMode="cover"
              className={`h-full w-full`}
            />
          </View>
        </View>
      </View>

      <View className={`flex-row justify-center items-center py-2`}>
        <View
          style={{
            shadowColor,
            backgroundColor: invertBackgroundColor,
            height: windowHeight * 0.1,
            width: windowWidth * 0.444,
          }}
          className={`rounded flex-row shadow-2xl mx-1`}
        >
          <View className={`flex-1`}>
            <Image
              source={SalonFootSpa}
              resizeMode="cover"
              className={`h-full w-full`}
            />
          </View>
          <View className={`justify-end items-center`}>
            <Text
              style={{ color: invertTextColor }}
              className={`flex-1 text-base font-semibold p-4`}
            >{`Organic\nFoot Spa`}</Text>
          </View>
        </View>
        <View
          style={{
            shadowColor,
            backgroundColor: invertBackgroundColor,
            height: windowHeight * 0.1,
            width: windowWidth * 0.425,
          }}
          className={`rounded flex-row shadow-2xl mx-1`}
        >
          <View className={`justify-end items-center`}>
            <Text
              style={{ color: invertTextColor }}
              className={`flex-1 text-base font-semibold pl-2 pr-1 py-4`}
            >
              Choose Your Beautician
            </Text>
          </View>
          <View className={`flex-1`}>
            <Image
              source={SalonLipstick}
              resizeMode="cover"
              className={`h-full w-full`}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
