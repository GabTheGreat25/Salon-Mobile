import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  BackHandler,
  TextInput,
} from "react-native";
import {
  useUpdateAppointmentMutation,
  useGetAppointmentByIdQuery,
  useGetAppointmentsQuery,
} from "../../state/api/reducer";
import { useFormik } from "formik";
import { editAppointmentValidation } from "../../validation";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { LoadingScreen } from "@components";
import { dimensionLayout, changeColor } from "@utils";
import { Picker } from "@react-native-picker/picker";
import { BackIcon } from "@helpers";
import { format } from "date-fns";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function ({ route }) {
  const { id } = route.params;
  const navigation = useNavigation();

  const { refetch: refetchAppointments } = useGetAppointmentsQuery();
  const {
    data,
    isLoading: isAppointmentLoading,
    refetch,
  } = useGetAppointmentByIdQuery(id);
  const [updateAppointment, { isLoading }] = useUpdateAppointmentMutation();

  const isDimensionLayout = dimensionLayout();
  const { backgroundColor, textColor, colorScheme } = changeColor();
  const borderColor =
    colorScheme === "dark" ? "border-neutral-light" : "border-neutral-dark";

  const scroll = isDimensionLayout ? 600 : 700;

  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(scroll);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      date: data?.details?.date
        ? format(new Date(data.details.date), "yyyy-MM-dd")
        : "",
      time: data?.details?.time || "",
      price: data?.details?.price || 0,
      extraFee: data?.details?.extraFee || 0,
      note: data?.details?.note || "",
    },
    validationSchema: editAppointmentValidation,
    onSubmit: (values) => {
      updateAppointment({ id: data?.details?._id, payload: values })
        .unwrap()
        .then((response) => {
          refetch();
          refetchAppointments();
          Toast.show({
            type: "success",
            position: "top",
            text1: "Appointment Details Successfully Updated",
            text2: `${response?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
          navigation.navigate("Appointment");
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Updating Appointment Details",
            text2: `${error?.data?.error?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
        });
    },
  });

  const handleTextInputFocus = () => {
    setScrollViewHeight(keyboardOpen ? 625 : scroll);
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        setScrollViewHeight(scroll);
        return true;
      }
    );

    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardOpen(true);
        setScrollViewHeight(625);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardOpen(false);
        setScrollViewHeight(scroll);
      }
    );

    return () => {
      backHandler.remove();
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const showDatepicker = () => {
    setShowDatePicker(true);
    Keyboard.dismiss();
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (event.type === "dismissed") {
      return;
    }

    if (date) {
      const updatedDate = new Date(date);
      updatedDate.setDate(date.getDate());

      setSelectedDate(updatedDate);
      formik.setFieldValue("date", updatedDate.toISOString().split("T")[0]);
    }
  };

  const showTimepicker = () => {
    setShowTimePicker(true);
    Keyboard.dismiss();
  };

  const handleTimeChange = (event, time) => {
    setShowTimePicker(false);
    if (event.type === "dismissed") {
      return;
    }

    if (time) {
      setSelectedTime(time);
      const formattedTime = time.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      formik.setFieldValue("time", formattedTime);
    }
  };

  return (
    <>
      {isLoading || isAppointmentLoading ? (
        <View
          className={`flex-1 justify-center items-center bg-primary-default`}
        >
          <LoadingScreen />
        </View>
      ) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView
            style={{ backgroundColor }}
            className={`relative flex-1`}
          >
            <BackIcon navigateBack={navigation.goBack} textColor={textColor} />
            <View
              className={`flex-1 items-center justify-start ${
                isDimensionLayout ? "mt-20" : "mt-0"
              }`}
            >
              <Text
                style={{ color: textColor }}
                className={`my-10 font-semibold text-center ${
                  isDimensionLayout ? "text-3xl" : "text-2xl"
                }`}
              >
                Update Appointment Details
              </Text>
              <KeyboardAvoidingView
                behavior="padding"
                className={`${
                  isDimensionLayout ? "h-[450px] w-[300px]" : "w-[375px]"
                }`}
              >
                <ScrollView
                  contentContainerStyle={{ height: scrollViewHeight }}
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={scrollViewHeight > 550}
                  decelerationRate="fast"
                  scrollEventThrottle={1}
                >
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Date
                  </Text>
                  <TextInput
                    style={{ color: textColor }}
                    className={`border-b mb-3 ${borderColor}`}
                    placeholder="Enter date"
                    placeholderTextColor={textColor}
                    onFocus={showDatepicker}
                    value={formik.values.date}
                  />
                  {showDatePicker && (
                    <DateTimePicker
                      value={selectedDate}
                      mode="date"
                      is24Hour={true}
                      display="default"
                      onChange={handleDateChange}
                    />
                  )}
                  {formik.touched.date && formik.errors.date && (
                    <Text style={{ color: "red" }}>{formik.errors.date}</Text>
                  )}
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Time
                  </Text>
                  <TextInput
                    style={{ color: textColor }}
                    className={`border-b mb-3 ${borderColor}`}
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
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Price
                  </Text>
                  <TextInput
                    style={{ color: textColor }}
                    className={`border-b mb-3 ${borderColor}`}
                    placeholder="Enter the price"
                    placeholderTextColor={textColor}
                    keyboardType="numeric"
                    autoCapitalize="none"
                    handleTextInputFocus={handleTextInputFocus}
                    onChangeText={formik.handleChange("price")}
                    onBlur={formik.handleBlur("price")}
                    value={String(formik.values.price)}
                  />
                  {formik.touched.price && formik.errors.price && (
                    <Text style={{ color: "red" }}>{formik.errors.price}</Text>
                  )}
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Extra Fee
                  </Text>
                  <TextInput
                    style={{ color: textColor }}
                    className={`border-b mb-3 ${borderColor}`}
                    placeholder="Enter the extra Fee"
                    placeholderTextColor={textColor}
                    keyboardType="numeric"
                    autoCapitalize="none"
                    handleTextInputFocus={handleTextInputFocus}
                    onChangeText={formik.handleChange("extraFee")}
                    onBlur={formik.handleBlur("extraFee")}
                    value={String(formik.values.extraFee)}
                  />
                  {formik.touched.extraFee && formik.errors.extraFee && (
                    <Text style={{ color: "red" }}>
                      {formik.errors.extraFee}
                    </Text>
                  )}
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Note
                  </Text>
                  <TextInput
                    style={{ color: textColor }}
                    className={`border-b mb-3 ${borderColor}`}
                    placeholder="Enter the note"
                    placeholderTextColor={textColor}
                    keyboardType="numeric"
                    autoCapitalize="none"
                    handleTextInputFocus={handleTextInputFocus}
                    onChangeText={formik.handleChange("note")}
                    onBlur={formik.handleBlur("note")}
                    value={String(formik.values.note)}
                  />
                  {formik.touched.note && formik.errors.note && (
                    <Text style={{ color: "red" }}>{formik.errors.note}</Text>
                  )}
                  <View
                    className={`mt-4 items-center justify-center ${
                      isDimensionLayout ? "flex-col" : "flex-row gap-x-2"
                    }`}
                  >
                    <TouchableOpacity
                      onPress={formik.handleSubmit}
                      disabled={!formik.isValid}
                    >
                      <View className={`mb-2 flex justify-center items-center`}>
                        <View
                          className={`py-2 rounded-lg bg-primary-accent w-[175px]
                          } ${!formik.isValid ? "opacity-50" : "opacity-100"}`}
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
              </KeyboardAvoidingView>
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      )}
    </>
  );
}
