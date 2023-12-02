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

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function () {
  const { textColor, backgroundColor, shadowColor, colorScheme } =
    changeColor();
  const navigation = useNavigation();
  const isDimensionLayout = dimensionLayout();
  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#FDA7DF";
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

  const items = [
    {
      name: "Face Wash",
      price: "₱ 559.00",
      variation: "Variation: Face Service",
      image: SalonFaceWash,
      addNotes: "Add Notes",
      notes: "Lorem Ipsum",
      appointment: "Appointment by 2 Dec 2023 11:00am Sat",
    },
    {
      name: "Face Wash",
      price: "₱ 559.00",
      variation: "Variation: Face Service",
      image: SalonFaceWash,
      addNotes: "Add Notes",
      notes: "Lorem Ipsum",
      appointment: "Appointment by 2 Dec 2023 11:00am Sat",
    },
    {
      name: "Face Wash",
      price: "₱ 559.00",
      variation: "Variation: Face Service",
      image: SalonFaceWash,
      addNotes: "Add Notes",
      notes: "Lorem Ipsum",
      appointment: "Appointment by 2 Dec 2023 11:00am Sat",
    },
    {
      name: "Face Wash",
      price: "₱ 559.00",
      variation: "Variation: Face Service",
      image: SalonFaceWash,
      addNotes: "Add Notes",
      notes: "Lorem Ipsum",
      appointment: "Appointment by 2 Dec 2023 11:00am Sat",
    },
    {
      name: "Face Wash",
      price: "₱ 559.00",
      variation: "Variation: Face Service",
      image: SalonFaceWash,
      addNotes: "Add Notes",
      notes: "Lorem Ipsum",
      appointment: "Appointment by 2 Dec 2023 11:00am Sat",
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
            <View
              style={{
                backgroundColor: invertBackgroundColor,
                height: windowHeight * 0.15,
                width: windowWidth * 0.925,
              }}
              className={`flex-col ${
                isDimensionLayout ? "mx-1 px-4 pt-4 mb-2" : "mx-3"
              }`}
            >
              <Text
                style={{ color: invertTextColor }}
                className={`text-base font-semibold`}
              >
                Appointment Schedule
              </Text>
              <View className={`flex-row`}>
                <Text
                  style={{ color: invertTextColor }}
                  className={`text-base font-semibold`}
                >
                  02/12/2023 | 11: 00 AM, Sat
                </Text>
                <TouchableOpacity className={`flex-1`}>
                  <View className={`flex-row justify-end items-end`}>
                    <Feather
                      name="chevron-right"
                      size={40}
                      color={invertTextColor}
                    />
                  </View>
                </TouchableOpacity>
              </View>
              <TouchableOpacity>
                <Text
                  style={{ color: invertTextColor }}
                  className={`text-2xl font-semibold`}
                >
                  Select Date & Time
                </Text>
              </TouchableOpacity>
            </View>
            {items.map((item, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: invertBackgroundColor,
                  height: windowHeight * 0.25,
                  width: windowWidth * 0.925,
                }}
                className={`flex-row ${
                  isDimensionLayout ? "mx-1 px-4 mb-2" : "mx-3"
                }`}
              >
                <View className={`flex-1 flex-col`}>
                  <View className={`flex-row`}>
                    <View className={`flex-1 justify-center items-center pt-5`}>
                      <Image
                        source={item.image}
                        resizeMode="cover"
                        className={`h-[100px] w-[100px] rounded-full`}
                      />
                    </View>
                    <View
                      className={`flex-1 flex-col justify-center items-start`}
                    >
                      <Text
                        style={{ color: invertTextColor }}
                        className={`flex-1 ${
                          isDimensionLayout
                            ? "text-2xl pl-2 pr-1 pt-4"
                            : "text-lg px-4 py-6"
                        } font-semibold`}
                      >
                        {item.name}
                      </Text>
                      <Text
                        style={{ color: invertTextColor }}
                        className={`flex-1 ${
                          isDimensionLayout
                            ? "text-sm pl-2 pr-1 pt-2"
                            : "text-lg px-4 py-6"
                        } font-semibold`}
                      >
                        {item.variation}
                      </Text>
                      <Text
                        style={{ color: invertTextColor }}
                        className={`flex-1 ${
                          isDimensionLayout
                            ? "text-2xl pl-2 pr-1 pt-4"
                            : "text-lg px-4 py-6"
                        } font-semibold`}
                      >
                        {item.price}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      borderBottomColor: invertTextColor,
                      borderBottomWidth: 1,
                      marginTop: 5,
                      paddingVertical: 10,
                    }}
                  />
                  <View className={`flex-row gap-x-2`}>
                    <View className={`flex-col`}>
                      <Text
                        style={{ color: invertTextColor }}
                        className={`text-base font-semibold`}
                      >
                        {item.addNotes}
                      </Text>
                      <Text
                        style={{ color: invertTextColor }}
                        className={`text-lg font-semibold`}
                      >
                        {item.notes}
                      </Text>
                    </View>
                    <View
                      className={`flex-1 flex-row justify-end items-end mb-[5px]`}
                    >
                      <Text
                        style={{ color: invertTextColor }}
                        className={`text-xs font-semibold`}
                      >
                        {item.appointment}
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
          <View className={`flex-row justify-center items-center pt-4 pb-2`}>
            <Text
              style={{ color: textColor }}
              className={`${
                isDimensionLayout ? "text-sm" : "text-lg px-4 py-6"
              } font-semibold`}
            >
              Payment Option
            </Text>
            <View className={`flex-1 justify-end items-end`}>
              <TouchableOpacity>
                <View className={`flex-row`}>
                  <Text
                    className={`${
                      isDimensionLayout ? "text-base" : "text-lg px-4 py-6"
                    } font-medium text-primary-default`}
                  >
                    Select Payment Method
                  </Text>
                  <Feather name="chevron-right" size={25} color="#FDA7DF" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View className={`flex-row gap-x-1 justify-center items-center pb-2`}>
            <Feather name="user" size={25} color={textColor} />
            <Text
              style={{ color: textColor }}
              className={`${
                isDimensionLayout ? "text-sm" : "text-lg px-4 py-6"
              } font-medium`}
            >
              Pick A Beautician
            </Text>
            <View className={`flex-1 justify-end items-end`}>
              <TouchableOpacity>
                <View className={`flex-row`}>
                  <Text
                    className={`${
                      isDimensionLayout ? "text-base" : "text-lg px-4 py-6"
                    } font-medium text-primary-default`}
                  >
                    Select Beautician
                  </Text>
                  <Feather name="chevron-right" size={25} color="#FDA7DF" />
                </View>
              </TouchableOpacity>
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
                ₱ 2,286.00
              </Text>
            </View>
          </View>
          <TouchableOpacity>
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
