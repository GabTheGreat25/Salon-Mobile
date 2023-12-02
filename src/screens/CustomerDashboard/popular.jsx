import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import SalonFaceWash from "@assets/face-wash.png";
import { changeColor, dimensionLayout } from "@utils";
import { BackIcon } from "@helpers";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function () {
  const { textColor, backgroundColor, colorScheme } = changeColor();
  const route = useRoute();
  const navigation = useNavigation();
  const isDimensionLayout = dimensionLayout();
  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#212B36";
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

  const items = [
    {
      name: "Face Wash",
      price: "₱ 559.00",
      rating: 4.5,
      image: SalonFaceWash,
    },
    {
      name: "Face Wash",
      price: "₱ 559.00",
      rating: 4.5,
      image: SalonFaceWash,
    },
    {
      name: "Face Wash",
      price: "₱ 559.00",
      rating: 4.5,
      image: SalonFaceWash,
    },
    {
      name: "Face Wash",
      price: "₱ 559.00",
      rating: 4.5,
      image: SalonFaceWash,
    },
    {
      name: "Face Wash",
      price: "₱ 559.00",
      rating: 4.5,
      image: SalonFaceWash,
    },
  ];

  const handlePress = () => {
    navigation.navigate("Cart");
  };

  const handleRelevance = () => {
    navigation.navigate("Relevance");
  };

  const handlePopular = () => {
    navigation.navigate("Popular");
  };

  const handleMostRecent = () => {
    navigation.navigate("MostRecent");
  };

  const handleBudget = () => {
    navigation.navigate("Budget");
  };

  const [selectedOption, setSelectedOption] = useState("Relevance");

  useEffect(() => {
    if (route) {
      setSelectedOption(route.name);
    }
  }, [route]);

  const handleBack = () => {
    navigation.navigate("CustomerDrawer");
  };

  return (
    <>
      <BackIcon navigateBack={handleBack} textColor={textColor} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        scrollEventThrottle={1}
        style={{
          backgroundColor,
        }}
        className={`px-3 flex-1 pt-20`}
      >
        <View
          className={`flex-1 ${
            isDimensionLayout
              ? "flex-col justify-center items-center"
              : "flex-row justify-start items-start"
          }`}
        >
          <ScrollView
            decelerationRate="fast"
            scrollEventThrottle={1}
            horizontal
            showsHorizontalScrollIndicator={false}
            className={`pb-10`}
          >
            <View
              className={`${
                isDimensionLayout
                  ? "flex-row gap-x-2"
                  : "pt-10 pr-8 justify-center items-center flex-col gap-y-2"
              }`}
            >
              <TouchableOpacity onPress={handleRelevance}>
                <View
                  style={{
                    backgroundColor:
                      selectedOption === "Relevance"
                        ? "#FDA7DF"
                        : invertBackgroundColor,
                  }}
                  className={`rounded-2xl px-4 py-2`}
                >
                  <Text
                    style={{
                      color:
                        selectedOption === "Relevance"
                          ? textColor
                          : invertTextColor,
                    }}
                  >
                    Relevance
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={handlePopular}>
                <View
                  style={{
                    backgroundColor:
                      selectedOption === "Popular"
                        ? "#FDA7DF"
                        : invertBackgroundColor,
                  }}
                  className={`rounded-2xl px-4 py-2`}
                >
                  <Text
                    style={{
                      color:
                        selectedOption === "Popular"
                          ? textColor
                          : invertTextColor,
                    }}
                  >
                    Popular
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleMostRecent}>
                <View
                  style={{
                    backgroundColor:
                      selectedOption === "MostRecent"
                        ? "#FDA7DF"
                        : invertBackgroundColor,
                  }}
                  className={`rounded-2xl px-4 py-2`}
                >
                  <Text
                    style={{
                      color:
                        selectedOption === "MostRecent"
                          ? textColor
                          : invertTextColor,
                    }}
                  >
                    Most Recent
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleBudget}>
                <View
                  style={{
                    backgroundColor:
                      selectedOption === "Budget"
                        ? "#FDA7DF"
                        : invertBackgroundColor,
                  }}
                  className={`rounded-2xl px-4 py-2`}
                >
                  <Text
                    style={{
                      color:
                        selectedOption === "Budget"
                          ? textColor
                          : invertTextColor,
                    }}
                  >
                    Budget
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <ScrollView
            horizontal={isDimensionLayout ? false : true}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            scrollEventThrottle={1}
            className={`pb-24`}
          >
            {items.map((item, index) => (
              <View
                key={index}
                className={`${
                  isDimensionLayout ? "flex-col" : "flex-row"
                } px-[10px]`}
              >
                <View className={`flex-col`}>
                  <View className={`relative`}>
                    <Image
                      source={item?.image}
                      resizeMode="cover"
                      style={{
                        height: windowHeight * 0.25,
                        width: windowWidth * 0.9,
                        borderRadius: 20,
                      }}
                    />
                    <TouchableOpacity onPress={handlePress}>
                      <View className={`absolute left-[315px] bottom-2`}>
                        <Ionicons
                          name="add-circle-sharp"
                          size={50}
                          color={textColor}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View className={`flex-row pt-2`}>
                    <View className={`flex-col`}>
                      <Text
                        style={{ color: textColor }}
                        className={`text-base font-semibold`}
                      >
                        {item?.name}
                      </Text>
                      <Text
                        style={{ color: textColor }}
                        className={`text-2xl font-semibold py-1`}
                      >
                        {item?.price}
                      </Text>
                    </View>
                    <View className={`flex-1 flex-row justify-end items-start`}>
                      <FontAwesome name="star" size={20} color="#f1c40f" />
                      <Text
                        style={{ color: textColor }}
                        className={`text-base font-semibold px-2`}
                      >
                        {item?.rating}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </>
  );
}
