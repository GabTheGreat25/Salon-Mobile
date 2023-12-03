import React, { useState, useMemo } from "react";
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
import { Calendar } from "react-native-calendars";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function () {
  const { textColor, backgroundColor, shadowColor, colorScheme } =
    changeColor();
  const navigation = useNavigation();
  const isDimensionLayout = dimensionLayout();
  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#FDB9E5";
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

  const currentDate = new Date();
  const nextMonthDate = new Date(currentDate);
  nextMonthDate.setMonth(currentDate.getMonth() + 1);

  const maxDate = useMemo(() => {
    return nextMonthDate.toISOString().split("T")[0];
  }, [nextMonthDate]);

  const [markedDates, setMarkedDates] = useState({});

  const handleDayPress = (day) => {
    console.log("Selected Day:", day.dateString);
    const updatedMarkedDates = {
      [day.dateString]: {
        selected: true,
        selectedColor: "#F78FB3",
      },
    };
    setMarkedDates(updatedMarkedDates);
  };

  const hideArrows = currentDate.getMonth() === nextMonthDate.getMonth();

  const items = [
    {
      time: "10: 00 AM",
    },
    {
      time: "12: 00 PM",
    },
    {
      time: "01: 00 PM",
    },
    {
      time: "03: 00 PM",
    },
    {
      time: "05: 00 PM",
    },
  ];

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
          className={`px-3 flex-col flex-1 mt-20`}
        >
          <View>
            <Text
              style={{ color: textColor }}
              className={`text-2xl text-center pb-4 font-semibold`}
            >
              Select date and time
            </Text>
            <Calendar
              style={{
                backgroundColor: invertBackgroundColor,
              }}
              className={`${
                isDimensionLayout ? "mx-1 px-4 py-4 mb-2 rounded" : "mx-3"
              }`}
              onDayPress={handleDayPress}
              markedDates={markedDates}
              markingType={"simple"}
              theme={{
                calendarBackground: "invertBackgroundColor",
                monthTextColor: "black",
                textSectionTitleColor: "black",
                todayTextColor: "#BE2EDD",
                arrowColor: "black",
              }}
              minDate={currentDate.toISOString().split("T")[0]}
              maxDate={maxDate}
              hideExtraDays={true}
              hideArrows={hideArrows ? true : false}
              horizontal={true}
              pagingEnabled={true}
            />
          </View>
          <Text
            style={{ color: textColor }}
            className={`text-2xl text-center pb-4 font-semibold`}
          >
            Available Time Slot
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            scrollEventThrottle={1}
            style={{
              backgroundColor: invertBackgroundColor,
              height: windowHeight * 0.175,
              width: windowWidth * 0.925,
            }}
            className={`flex-row rounded ${
              isDimensionLayout ? "mx-1 px-4 pt-4 mb-2" : "mx-3"
            }`}
          >
            {items.map((item, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: backgroundColor,
                  height: windowHeight * 0.075,
                  width: windowWidth * 0.35,
                }}
                className={`rounded justify-center items-center text-center ${
                  isDimensionLayout ? "mr-8 mt-7 mb-2" : "mx-3"
                }`}
              >
                <Text
                  style={{ color: textColor }}
                  className={`text-lg text-center font-semibold`}
                >
                  {item.time}
                </Text>
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
