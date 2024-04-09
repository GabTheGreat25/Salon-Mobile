import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
} from "react-native";
import { changeColor } from "@utils";
import { BackIcon } from "@helpers";
import { useNavigation } from "@react-navigation/native";
import { LoadingScreen } from "@components";
import { useFormik } from "formik";
import { useAddTimeMutation } from "../../state/api/reducer";
import { createTimeValidation } from "../../validation";
import Toast from "react-native-toast-message";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function () {
  const navigation = useNavigation();
  const { backgroundColor, textColor, borderColor } = changeColor();

  const [addTime, { isLoading }] = useAddTimeMutation();
  const formik = useFormik({
    initialValues: {
      time: "",
    },
    validationSchema: createTimeValidation,
    onSubmit: (values) => {
      addTime(values)
        .unwrap()
        .then((response) => {
          navigation.navigate("Time");
          formik.resetForm();
          Toast.show({
            type: "success",
            position: "top",
            text1: "Time Successfully Created",
            text2: `${response?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Creating Time",
            text2: `${error?.data?.error?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
        });
    },
  });

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());

  const showTimepicker = () => {
    setShowTimePicker(true);
    Keyboard.dismiss();
  };

  const handleTimeChange = (event, time) => {
    setShowTimePicker(false);
    if (event.type === "dismissed" || !time) {
      return;
    }

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

    const formattedTime = `${formattedHours}:${formattedMinutes} ${ampm}`;

    setSelectedTime(time);
    formik.setFieldValue("time", formattedTime);
  };

  return (
    <>
      {isLoading ? (
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
              className={`relative flex-1 pt-12`}
            >
              <BackIcon
                navigateBack={navigation.goBack}
                textColor={textColor}
              />
              <View className={`flex-1 pb-2`}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  decelerationRate="fast"
                  scrollEventThrottle={1}
                  className={`px-6`}
                >
                  <Text
                    style={{ color: textColor }}
                    className={`pb-4 font-semibold text-center text-3xl`}
                  >
                    Create Time
                  </Text>

                  <TextInput
                    style={{ color: textColor, borderColor }}
                    className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-full my-2`}
                    placeholder="Enter time"
                    placeholderTextColor={textColor}
                    onFocus={showTimepicker}
                    value={formik.values.time}
                  />
                  {showTimePicker && (
                    <DateTimePicker
                      value={selectedTime}
                      mode="time"
                      is24Hour={false}
                      display="default"
                      onChange={(event, time) => {
                        handleTimeChange(event, time);
                        formik.validateForm().then(() => {
                          formik.setFieldTouched("time", true);
                        });
                      }}
                    />
                  )}
                  {formik.touched.time && formik.errors.time && (
                    <Text style={{ color: "red" }}>{formik.errors.time}</Text>
                  )}

                  <View className={`my-4 items-center justify-center flex-col`}>
                    <TouchableOpacity
                      onPress={formik.handleSubmit}
                      disabled={!formik.isValid}
                    >
                      <View className={`mb-2 flex justify-center items-center`}>
                        <View
                          className={`py-2 rounded-lg bg-primary-accent w-[175px] ${
                            !formik.isValid ? "opacity-50" : "opacity-100"
                          }`}
                        >
                          <Text
                            className={`font-semibold text-center text-lg`}
                            style={{ color: textColor }}
                          >
                            Submit
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </SafeAreaView>
          </TouchableWithoutFeedback>
        </>
      )}
    </>
  );
}
