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
import SalonFaceWash from "@assets/face-wash.png";
import { useSelector } from "react-redux";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function () {
  const { textColor, backgroundColor, shadowColor, colorScheme } =
    changeColor();
  const navigation = useNavigation();
  const isDimensionLayout = dimensionLayout();
  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#FDA7DF";
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

  const selectedService = useSelector((state) => state?.appointment);

  const appointmentData = selectedService?.appointmentData;
  const dataAsArray = appointmentData ? [appointmentData] : [];

  const items = dataAsArray.map((item) => ({
    name: item.service_name,
    product: item.product_name,
    price: item.price,
    extraFee: item.extraFee,
    image: item?.image,
  }));

  const handlePress = () => {
    navigation.navigate("Checkout");
  };

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
            {items?.map((item, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: invertBackgroundColor,
                  height: windowHeight * 0.25,
                  width: windowWidth * 0.925,
                }}
                className={`flex-row ${
                  isDimensionLayout ? "mx-1 px-4 pt-4 mb-2" : "mx-3"
                }`}
              >
                <View className={`flex-1 flex-col`}>
                  <View className={`flex-row gap-x-2`}>
                    <Feather name="home" size={20} color={invertTextColor} />
                    <Text
                      style={{ color: invertTextColor }}
                      className={`text-base font-semibold`}
                    >
                      Lhanlee Beauty Lounge
                    </Text>
                    <View className={`flex-1 justify-end items-end`}>
                      <Feather
                        name="trash-2"
                        size={20}
                        color={invertTextColor}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      borderBottomColor: invertTextColor,
                      borderBottomWidth: 1,
                      marginTop: 5,
                    }}
                  />
                  <View className={`flex-row`}>
                    <View className={`flex-1 justify-center items-center pt-5`}>
                      <Image
                        source={{ uri: item?.image?.[0]?.url }}
                        resizeMode="cover"
                        className={`h-[100px] w-[100px] rounded-full`}
                      />
                    </View>
                    <View
                      className={`flex-1 flex-col justify-center items-start`}
                    >
                      <Text
                        style={{ color: invertTextColor }}
                        className={` ${
                          isDimensionLayout
                            ? "text-2xl pl-2 pr-1 pt-4"
                            : "text-lg px-4 py-6"
                        } font-semibold`}
                      >
                        {item.name}
                      </Text>
                      <Text
                        style={{ color: invertTextColor }}
                        className={` ${
                          isDimensionLayout
                            ? "text-base pl-2 pr-1"
                            : "text-lg px-4 py-6"
                        } font-semibold`}
                      >
                        {item.product}
                      </Text>
                      <Text
                        style={{ color: invertTextColor }}
                        className={` ${
                          isDimensionLayout
                            ? "text-2xl pl-2 pr-1 pt-4"
                            : "text-lg px-4 py-6"
                        } font-semibold`}
                      >
                        ₱{item.price}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </ScrollView>
        <View
          style={{
            backgroundColor,
            height: windowHeight * 0.25,
            width: windowWidth,
          }}
          className={`flex-col px-10`}
        >
          <View className={`flex-row pt-4 pb-2`}>
            <Text
              style={{ color: textColor }}
              className={`${
                isDimensionLayout ? "text-base" : "text-lg px-4 py-6"
              } font-semibold`}
            >
              SubTotal
            </Text>
            <View className={`flex-1 justify-start items-end`}>
              <Text
                style={{ color: textColor }}
                className={`${
                  isDimensionLayout ? "text-base" : "text-lg px-4 py-6"
                } font-semibold`}
              >
                {items?.map((item) => `₱${item.price.toFixed(2)}`)}
              </Text>
            </View>
          </View>
          <View className={`flex-row pb-2`}>
            <Text
              style={{ color: textColor }}
              className={`${
                isDimensionLayout ? "text-base" : "text-lg px-4 py-6"
              } font-light`}
            >
              Extra Fee
            </Text>
            <View className={`flex-1 justify-start items-end`}>
              <Text
                style={{ color: textColor }}
                className={`${
                  isDimensionLayout ? "text-base" : "text-lg px-4 py-6"
                } font-light`}
              >
                {items?.map((item) => `₱${item?.extraFee?.toFixed(2)}`)}
              </Text>
            </View>
          </View>
          <View
            style={{
              borderBottomColor: textColor,
              borderBottomWidth: 1,
              marginTop: 5,
            }}
          />
          <View className={`flex-row pt-4 pb-2`}>
            <Text
              style={{ color: textColor }}
              className={`${
                isDimensionLayout ? "text-lg" : "text-lg px-4 py-6"
              } font-bold`}
            >
              Total
            </Text>
            <View className={`flex-1 justify-start items-end`}>
              <Text
                style={{ color: textColor }}
                className={`${
                  isDimensionLayout ? "text-lg" : "text-lg px-4 py-6"
                } font-bold`}
              >
                {items?.map(
                  (item) => `₱${(item.price + item?.extraFee)?.toFixed(2)}`
                )}
              </Text>
            </View>
          </View>
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
                Checkout
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
