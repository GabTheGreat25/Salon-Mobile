import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { changeColor } from "@utils";
import { useNavigation } from "@react-navigation/native";
import { BackIcon } from "@helpers";
import SalonSuccess from "@assets/Success.png";
import { useSelector } from "react-redux";

const windowWidth = Dimensions.get("window").width;

export default function () {
  const { textColor, backgroundColor, shadowColor, colorScheme } =
    changeColor();

  const roles = useSelector((state) => state?.auth?.user.roles);

  const isReceptionist = roles?.includes("Receptionist");

  const navigation = useNavigation();
  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#FFC0CB";
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

  const handlePress = () => {
    navigation.navigate("ReceiptHistory");
    navigation.navigate(
      isReceptionist ? "ReceptionistDrawer" : "ReceiptHistory"
    );
  };

  return (
    <>
      <SafeAreaView style={{ backgroundColor }} className={`flex-1`}>
        <BackIcon navigateBack={navigation.goBack} textColor={textColor} />
        <View
          style={{
            backgroundColor,
          }}
          className={`px-3 flex-col flex-1 pt-16`}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            decelerationRate="fast"
            scrollEventThrottle={1}
          >
            <View
              style={{
                backgroundColor: invertBackgroundColor,
                width: windowWidth * 0.925,
              }}
              className={`rounded-lg justify-center items-center mx-1 px-4 pt-4 py-10 my-10 h-full`}
            >
              <View className={`flex-col justify-center items-center gap-y-4`}>
                <Image
                  source={SalonSuccess}
                  resizeMode="cover"
                  className={`w-300px h-300px`}
                />
                <Text
                  style={{ color: invertTextColor }}
                  className={`text-4xl text-center font-semibold`}
                >
                  Congratulations
                </Text>
                <Text
                  style={{ color: invertTextColor }}
                  className={`text-2xl text-center font-semibold`}
                >
                  Your appointment has been booked successfully!
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
        <View
          style={{
            shadowColor,
            backgroundColor,
            height: 90,
            width: windowWidth,
          }}
          className={`flex-col px-10 py-5 shadow-2xl`}
        >
          <TouchableOpacity onPress={handlePress}>
            <View
              style={{
                backgroundColor: invertBackgroundColor,
              }}
              className={`justify-center items-center rounded-md py-2`}
            >
              <Text
                style={{ color: invertTextColor }}
                className={`text-center text-xl font-semibold`}
              >
                Confirm
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}
