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
import { useNavigation } from "@react-navigation/native";
import { BackIcon } from "@helpers";
import SalonEmployee from "@assets/employee.png";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function () {
  const { textColor, backgroundColor, shadowColor, colorScheme } =
    changeColor();
  const navigation = useNavigation();
  const isDimensionLayout = dimensionLayout();
  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#FDA7DF";
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

  const handlePress = () => {
    navigation.navigate("Checkout");
  };

  const items = [
    {
      name: "Crislhan",
      image: SalonEmployee,
      description:
        "Jorem ipsum dolor, consectetur adipiscing elit. Nunc v libero et velit interdum, ac mattis.",
    },
    {
      name: "Crislhan",
      image: SalonEmployee,
      description:
        "Jorem ipsum dolor, consectetur adipiscing elit. Nunc v libero et velit interdum, ac mattis.",
    },
    {
      name: "Crislhan",
      image: SalonEmployee,
      description:
        "Jorem ipsum dolor, consectetur adipiscing elit. Nunc v libero et velit interdum, ac mattis.",
    },
    {
      name: "Crislhan",
      image: SalonEmployee,
      description:
        "Jorem ipsum dolor, consectetur adipiscing elit. Nunc v libero et velit interdum, ac mattis.",
    },
    {
      name: "Crislhan",
      image: SalonEmployee,
      description:
        "Jorem ipsum dolor, consectetur adipiscing elit. Nunc v libero et velit interdum, ac mattis.",
    },
  ];

  return (
    <>
      <View style={{ backgroundColor }} className={`flex-1`}>
        <BackIcon navigateBack={navigation.goBack} textColor={textColor} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          decelerationRate="fast"
          scrollEventThrottle={1}
          style={{
            backgroundColor,
          }}
          className={`px-3 flex-1 mt-20`}
        >
          <ScrollView
            decelerationRate="fast"
            scrollEventThrottle={1}
            showsVerticalScrollIndicator={false}
          >
            {items.map((item, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: invertBackgroundColor,
                  height: windowHeight * 0.2,
                  width: windowWidth * 0.925,
                }}
                className={`flex-row rounded ${
                  isDimensionLayout ? "mx-1 px-4 pt-4 mb-2" : "mx-3"
                }`}
              >
                <Image
                  className={`w-[175px] h-[149px]`}
                  source={item.image}
                  resizeMode="cover"
                />
                <View className={`flex-col pl-4`}>
                  <Text
                    style={{ color: invertTextColor }}
                    className={`${
                      isDimensionLayout ? "text-2xl" : "text-lg px-4 py-6"
                    } font-semibold`}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={{ color: invertTextColor }}
                    className={`w-[150px] text-start ${
                      isDimensionLayout ? "text-sm" : "text-base px-4"
                    } font-semibold`}
                  >
                    {item.description}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </ScrollView>
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
