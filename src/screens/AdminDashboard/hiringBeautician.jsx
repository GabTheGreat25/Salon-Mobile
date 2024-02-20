import React, { useState, useEffect, useMemo } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { changeColor } from "@utils";
import { useNavigation } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import { useDispatch } from "react-redux";
import { hiringSlice } from "../../state/hiring/hiringReducer";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function () {
  const { textColor, backgroundColor, colorScheme } = changeColor();
  const navigation = useNavigation();

  const hiring = useSelector((state) => state.hiring);

  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#FDB9E5";
  const revertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#212B36";
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

  const currentDate = new Date();
  const nextMonthDate = new Date(currentDate);
  nextMonthDate.setMonth(currentDate.getMonth() + 1);

  const maxDate = useMemo(() => {
    return nextMonthDate.toISOString().split("T")[0];
  }, [nextMonthDate]);

  const [markedDates, setMarkedDates] = useState({});
  const [selectedDateTime, setSelectedDateTime] = useState({
    date: null,
    time: null,
  });

  useEffect(() => {
    if (hiring.hiringData.date) {
      const updatedMarkedDates = {
        [hiring.hiringData.date]: {
          selected: true,
          selectedColor: "#F78FB3",
        },
      };
      setMarkedDates(updatedMarkedDates);
    }
    setSelectedDateTime({
      date: hiring.hiringData.date || null,
      time: hiring.hiringData.time || null,
    });
  }, [hiring.hiringData.date, hiring.hiringData.time]);

  const dispatch = useDispatch();

  const handleDayPress = (day) => {
    const updatedMarkedDates = {
      [day.dateString]: {
        selected: true,
        selectedColor: "#F78FB3",
      },
    };
    setMarkedDates(updatedMarkedDates);
    setSelectedDateTime((prev) => ({ ...prev, date: day.dateString }));
    formik.setFieldValue("date", day.dateString);
  };

  const handleTimePress = (time) => {
    setSelectedDateTime((prev) => {
      const newTime = prev.time === time ? null : time;
      formik.setFieldValue("time", newTime);
      return { ...prev, time: newTime };
    });
  };

  const hideArrows = currentDate.getMonth() === nextMonthDate.getMonth();

  const items = [
    {
      time: "09:00 AM",
    },
    {
      time: "10:00 AM",
    },
    {
      time: "11:00 PM",
    },
    {
      time: "12:00 PM",
    },
    {
      time: "01:00 PM",
    },
    {
      time: "02:00 PM",
    },
    {
      time: "03:00 PM",
    },
    {
      time: "04:00 PM",
    },
  ];

  const [isOpen, setOpen] = useState(hiring.hiringData.isHiring || false);

  const handleCheckBoxToggle = () => {
    const newValue = !isOpen;
    setOpen(newValue);
    formik.setFieldValue("isHiring", newValue);
  };

  const formik = useFormik({
    initialValues: {
      date: hiring.hiringData.date || "",
      time: hiring.hiringData.time || "",
      isHiring: hiring.hiringData.isHiring || false,
    },
    onSubmit: (values) => {
      dispatch(hiringSlice.actions.submitForm(values));
      navigation.navigate("AdminDashboard");
      Toast.show({
        type: "success",
        position: "top",
        text1: "Successfully Submitted",
        text2: `Admin has edited the hiring details`,
        visibilityTime: 3000,
        autoHide: true,
      });
    },
  });

  return (
    <>
      <View style={{ backgroundColor }} className={`flex-1`}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          decelerationRate="fast"
          scrollEventThrottle={1}
          style={{
            backgroundColor,
          }}
          className={`px-3 flex-col flex-1 pt-3`}
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
              className={`mx-1 px-4 py-4 mb-2 rounded`}
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
            className={`flex-row rounded mx-1 px-4 pt-4 mb-2`}
          >
            {items.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleTimePress(item.time)}
                activeOpacity={1}
              >
                <View
                  style={{
                    backgroundColor:
                      selectedDateTime.time === item.time
                        ? revertBackgroundColor
                        : backgroundColor,
                    height: windowHeight * 0.075,
                    width: windowWidth * 0.35,
                  }}
                  className={`rounded justify-center items-center text-center mr-8 mt-7 mb-2`}
                >
                  <Text
                    style={{
                      color:
                        selectedDateTime.time === item.time
                          ? invertTextColor
                          : textColor,
                    }}
                    className={`text-lg text-center font-semibold`}
                  >
                    {item.time}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View className={`flex flex-row`}>
            <TouchableOpacity
              onPress={() => handleCheckBoxToggle()}
              className={`flex-row px-4 py-2`}
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
                {isOpen && (
                  <Text
                    style={{ color: invertTextColor }}
                    className={`text-2xl`}
                  >
                    ✓
                  </Text>
                )}
              </View>
            </TouchableOpacity>
            <View className={`pt-2 pb-6`}>
              <Text
                style={{ color: textColor }}
                className={`text-3xl font-semibold`}
              >
                Open Hiring
              </Text>
            </View>
          </View>
        </ScrollView>
        <View
          style={{
            backgroundColor,
            height: windowHeight * 0.125,
            width: windowWidth,
          }}
          className={`flex-col px-10 py-5`}
        >
          <TouchableOpacity
            onPress={formik.handleSubmit}
            disabled={!formik.isValid}
          >
            <View
              style={{
                backgroundColor: invertBackgroundColor,
              }}
              className={`justify-center items-center rounded-md py-2`}
            >
              <Text
                style={{ color: invertTextColor }}
                className={`text-center text-lg font-bold ${
                  !formik.isValid ? "opacity-50" : "opacity-100"
                }`}
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
