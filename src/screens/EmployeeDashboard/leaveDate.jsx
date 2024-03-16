import React, { useState, useMemo } from "react";
import { useAddScheduleMutation } from "../../state/api/reducer";
import { useFormik } from "formik";
import Toast from "react-native-toast-message";
import { createExcuseValidation } from "../../validation";
import { useSelector } from "react-redux";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  SafeAreaView,
} from "react-native";
import { changeColor } from "@utils";
import { Calendar } from "react-native-calendars";
import { useNavigation } from "@react-navigation/native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function () {
  const navigation = useNavigation();
  const { textColor, backgroundColor, colorScheme } = changeColor();

  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#FDB9E5";
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";
  const borderColor = colorScheme === "dark" ? "#e5e5e5" : "#212B36";

  const [addSchedule, isLoading] = useAddScheduleMutation();
  const { user } = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      beautician: user?._id,
      date: "",
      isLeave: true,
      leaveNote: "",
    },
    validationSchema: createExcuseValidation,
    onSubmit: async (values) => {
      addSchedule(values)
        .unwrap()
        .then((response) => {
          formik.resetForm();
          Toast.show({
            type: "success",
            position: "top",
            text1: "Successfully Created",
            text2: `${response?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
          Keyboard.dismiss();
          navigation.navigate("EmployeeDashboard");
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Creating",
            text2: `${error?.data?.error?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
        });
    },
  });

  const handleDayPress = (day) => {
    let updatedMarkedDates = { ...markedDates };
    let updatedSelectedDateTime = { ...selectedDateTime };

    if (updatedMarkedDates[day.dateString]) {
      delete updatedMarkedDates[day.dateString];
      updatedSelectedDateTime.date = null;
    } else {
      updatedMarkedDates = {
        [day.dateString]: {
          selected: true,
          selectedColor: "#F78FB3",
        },
      };
      updatedSelectedDateTime.date = day.dateString;
    }

    setMarkedDates(updatedMarkedDates);
    setSelectedDateTime(updatedSelectedDateTime);
    formik.setFieldValue("date", updatedSelectedDateTime.date);
  };

  const currentDate = new Date();
  const next21Days = new Date(currentDate);
  next21Days.setDate(currentDate.getDate() + 21);

  const next8Days = new Date(currentDate);
  next8Days.setDate(currentDate.getDate() + 8);

  const minDate = useMemo(() => {
    return next8Days.toISOString().split("T")[0];
  }, [next8Days]);

  const maxDate = useMemo(() => {
    return next21Days.toISOString().split("T")[0];
  }, [next21Days]);

  const [markedDates, setMarkedDates] = useState({});
  const [selectedDateTime, setSelectedDateTime] = useState({
    date: null,
    time: null,
  });

  const hideArrows = currentDate.getMonth() === next21Days.getMonth();

  return (
    <>
      <SafeAreaView style={{ backgroundColor }} className={`flex-1`}>
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
              Select Leave Date
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
              minDate={minDate}
              maxDate={maxDate}
              hideExtraDays={true}
              hideArrows={hideArrows ? true : false}
              horizontal={true}
              pagingEnabled={true}
            />
          </View>

          <Text
            style={{ color: textColor }}
            className={`text-2xl text-center font-semibold`}
          >
            Leave Note
          </Text>
          {formik.touched.leaveNote && formik.errors.leaveNote && (
            <Text style={{ color: "red" }}>{formik.errors.leaveNote}</Text>
          )}
          <TextInput
            style={{
              color: textColor,
              height: 100,
              textAlignVertical: "top",
            }}
            className={`border-[1.5px] pt-2 px-4 text-lg font-normal rounded-lg mt-2 mb-6 ${borderColor}`}
            placeholder="Add LeaveNote Here..."
            placeholderTextColor={textColor}
            autoCapitalize="none"
            multiline={true}
            onChangeText={formik.handleChange("leaveNote")}
            onBlur={formik.handleBlur("leaveNote")}
            value={formik.values.leaveNote}
          />
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
      </SafeAreaView>
    </>
  );
}
