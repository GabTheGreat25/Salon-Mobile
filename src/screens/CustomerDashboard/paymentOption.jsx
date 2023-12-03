import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { changeColor, dimensionLayout } from "@utils";
import { useNavigation } from "@react-navigation/native";
import { BackIcon } from "@helpers";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import GcashWhite from "@assets/Gcash-white.png";
import GcashDark from "@assets/Gcash-dark.png";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function () {
  const { textColor, backgroundColor, colorScheme } = changeColor();
  const navigation = useNavigation();
  const isDimensionLayout = dimensionLayout();
  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#FDA7DF";
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";
  const GcashImage = colorScheme === "dark" ? GcashDark : GcashWhite;
  const [isChecked, setChecked] = useState(false);

  const handleCheckBoxToggle = () => {
    setChecked(!isChecked);
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
              height: windowHeight * 0.175,
              width: windowWidth * 0.925,
            }}
            className={`${isDimensionLayout ? "mx-1 px-4 pt-4 mb-2" : "mx-3"}`}
          >
            <View className={`flex-row`}>
              <TouchableOpacity
                className={`flex-row px-4 py-2`}
                onPress={handleCheckBoxToggle}
              >
                <View
                  style={{
                    height: 35,
                    width: 35,
                    borderColor: invertTextColor,
                    backgroundColor: invertBackgroundColor,
                  }}
                  className={`flex-row justify-center items-center border-2 rounded mr-2`}
                >
                  {isChecked && (
                    <Text
                      style={{ color: invertTextColor }}
                      className={`text-2xl`}
                    >
                      ✓
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
              <View className={`flex-row gap-x-2 justify-start items-start`}>
                <MaterialCommunityIcons
                  name="cash"
                  size={50}
                  color={invertTextColor}
                />
                <View className={`pt-2`}>
                  <Text
                    style={{ color: invertTextColor }}
                    className={`text-3xl font-semibold`}
                  >
                    Cash
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                borderBottomColor: invertTextColor,
                borderBottomWidth: 1,
                marginTop: 5,
              }}
            />
            <View className={`flex-row pt-2`}>
              <TouchableOpacity
                className={`flex-row px-4 py-2`}
                onPress={handleCheckBoxToggle}
              >
                <View
                  style={{
                    height: 35,
                    width: 35,
                    borderColor: invertTextColor,
                    backgroundColor: invertBackgroundColor,
                  }}
                  className={`flex-row justify-center items-center border-2 rounded mr-2`}
                >
                  {isChecked && (
                    <Text
                      style={{ color: invertTextColor }}
                      className={`text-2xl`}
                    >
                      ✓
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
              <View className={`flex-row gap-x-4 justify-start items-start`}>
                <View className={`pt-3 pl-2`}>
                  <Image source={GcashImage} className={`w-[36px] h-[30px]`} />
                </View>
                <View className={`pt-2`}>
                  <Text
                    style={{ color: invertTextColor }}
                    className={`text-3xl font-semibold`}
                  >
                    GCash
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  );
}
