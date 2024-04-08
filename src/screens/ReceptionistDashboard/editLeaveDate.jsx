import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
} from "react-native";
import {
  useUpdateScheduleMutation,
  useGetScheduleByIdQuery,
} from "../../state/api/reducer";
import { useFormik } from "formik";
import { createExcuseValidation } from "../../validation";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { LoadingScreen } from "@components";
import { changeColor } from "@utils";
import { BackIcon } from "@helpers";
import { Calendar } from "react-native-calendars";
import { useIsFocused } from "@react-navigation/native";

const windowWidth = Dimensions.get("window").width;

export default function ({ route }) {
  const { id } = route.params;
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const {
    data,
    isLoading: isScheduleLoading,
    refetch,
  } = useGetScheduleByIdQuery(id);

  useEffect(() => {
    const fetchData = async () => {
      if (isFocused) refetch();
    };
    fetchData();
  }, [isFocused]);

  const [updateSchedule, { isLoading }] = useUpdateScheduleMutation();

  const { backgroundColor, textColor, borderColor, colorScheme } =
    changeColor();

  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#FFC0CB";
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      date: data?.details?.date || "",
      leaveNote: data?.details?.leaveNote || "",
    },
    validationSchema: createExcuseValidation,
    onSubmit: (values) => {
      updateSchedule({ id: data?.details?._id, payload: values })
        .unwrap()
        .then((response) => {
          refetch();
          Toast.show({
            type: "success",
            position: "top",
            text1: "Schedule Details Successfully Updated",
            text2: `${response?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
          navigation.navigate("ReceptionistGetAllLeaveDate");
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Updating Schedule Details",
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
          selectedColor: "#FF7086",
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

  useEffect(() => {
    if (data?.details?.date) {
      const selectedDate = data.details.date.split("T")[0];
      setMarkedDates({
        [selectedDate]: {
          selected: true,
          selectedColor: "#FF7086",
        },
      });
      setSelectedDateTime({
        date: selectedDate,
        time: null,
      });
      formik.setFieldValue("date", selectedDate);
    }
  }, []);

  return (
    <>
      {isLoading || isScheduleLoading ? (
        <View
          className={`flex-1 justify-center items-center bg-primary-default`}
        >
          <LoadingScreen />
        </View>
      ) : (
        <>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView
              style={{ backgroundColor }}
              className={`relative flex-1`}
            >
              <BackIcon
                navigateBack={navigation.goBack}
                textColor={textColor}
              />
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
                      todayTextColor: "#FF1493",
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
                  <Text style={{ color: "red" }}>
                    {formik.errors.leaveNote}
                  </Text>
                )}
                <TextInput
                  style={{
                    color: textColor,
                    height: 100,
                    textAlignVertical: "top",
                    borderColor,
                  }}
                  className={`border-[1.5px] pt-2 px-4 text-lg font-normal rounded-lg mt-2 mb-6`}
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
                  height: 90,
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
          </TouchableWithoutFeedback>
        </>
      )}
    </>
  );
}
