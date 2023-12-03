import React from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { changeColor, dimensionLayout } from "@utils";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { BackIcon } from "@helpers";
import SalonSuccess from "@assets/Success.png";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function () {
  const { textColor, backgroundColor, shadowColor, colorScheme } =
    changeColor();
  const navigation = useNavigation();
  const isDimensionLayout = dimensionLayout();
  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#FDB9E5";
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

  const handlePress = () => {
    navigation.navigate("Receipt");
  };

  return (
    <>
      <View style={{ backgroundColor }} className={`flex-1`}>
        <BackIcon navigateBack={navigation.goBack} textColor={textColor} />
        <View
          style={{
            backgroundColor,
          }}
          className={`px-3 flex-col flex-1 mt-20`}
        >
          <View
            style={{
              backgroundColor: invertBackgroundColor,
              height: windowHeight * 0.75,
              width: windowWidth * 0.925,
            }}
            className={`rounded justify-start items-center ${
              isDimensionLayout ? "mx-1 px-4 pt-4 mb-2" : "mx-3"
            }`}
          >
            <View
              className={`flex-col justify-center items-center gap-y-4 pt-32`}
            >
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
                Your Payment Is Successful!
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            backgroundColor,
            height: windowHeight * 0.1,
            width: windowWidth,
          }}
          className={`flex-col px-10 py-5`}
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
                className={`text-center ${
                  isDimensionLayout ? "text-lg" : "text-lg px-4 py-6"
                } font-bold`}
              >
                Confirm
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
