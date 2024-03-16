import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
} from "react-native";
import {
  useUpdateTimeMutation,
  useGetTimeByIdQuery,
} from "../../state/api/reducer";
import { useFormik } from "formik";
import { editTimeValidation } from "../../validation";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { LoadingScreen } from "@components";
import { changeColor } from "@utils";
import { BackIcon } from "@helpers";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useIsFocused } from "@react-navigation/native";

export default function ({ route }) {
  const { id } = route.params;
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const { data, isLoading: isTimeLoading, refetch } = useGetTimeByIdQuery(id);

  useEffect(() => {
    const fetchData = async () => {
      if (isFocused) refetch();
    };
    fetchData();
  }, [isFocused]);

  const [updateTime, { isLoading }] = useUpdateTimeMutation();

  const { backgroundColor, textColor, colorScheme } = changeColor();
  const borderColor =
    colorScheme === "dark" ? "border-neutral-light" : "border-neutral-dark";

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      time: data?.details?.time || "",
    },
    validationSchema: editTimeValidation,
    onSubmit: (values) => {
      updateTime({ id: data?.details?._id, payload: values })
        .unwrap()
        .then((response) => {
          refetch();
          Toast.show({
            type: "success",
            position: "top",
            text1: "Time Details Successfully Updated",
            text2: `${response?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
          navigation.navigate("Time");
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Updating Time Details",
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
    const formattedHours = (hours % 12 || 12).toString().padStart(2, "0"); // Ensure two digits for hours
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

    const formattedTime = `${formattedHours}:${formattedMinutes} ${ampm}`;

    setSelectedTime(time);
    formik.setFieldValue("time", formattedTime);
  };

  return (
    <>
      {isLoading || isTimeLoading ? (
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
              <KeyboardAvoidingView behavior="height">
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  decelerationRate="fast"
                  scrollEventThrottle={1}
                  className={`px-6`}
                >
                  <View className="pb-2">
                    <Text
                      style={{ color: textColor }}
                      className={`font-semibold text-center pb-4 text-3xl`}
                    >
                      Edit Time Details
                    </Text>

                    <TextInput
                      style={{ color: textColor }}
                      className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
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

                    <View className={`flex-col`}>
                      <TouchableOpacity
                        onPress={formik.handleSubmit}
                        disabled={!formik.isValid}
                      >
                        <View className={`my-4 w-full`}>
                          <View
                            className={`py-2 rounded-lg bg-primary-accent mx-20 ${
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
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            </SafeAreaView>
          </TouchableWithoutFeedback>
        </>
      )}
    </>
  );
}
