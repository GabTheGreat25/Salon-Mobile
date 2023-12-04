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
  useUpdateTransactionMutation,
  useGetTransactionByIdQuery,
  useGetTransactionsQuery,
} from "../../state/api/reducer";
import { useFormik } from "formik";
import { editTransactionValidation } from "../../validation";
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

  const { refetch: refetchTransactions } = useGetTransactionsQuery();
  const {
    data,
    isLoading: isTransactionLoading,
    refetch,
  } = useGetTransactionByIdQuery(id);
  const [updateTransaction, { isLoading }] = useUpdateTransactionMutation();

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
      status: data?.details?.status || "",
      payment: data?.details?.payment || 0,
    },
    validationSchema: editTransactionValidation,
    onSubmit: (values) => {
      updateTransaction({ id: data?.details?._id, payload: values })
        .unwrap()
        .then((response) => {
          refetch();
          refetchTransactions();
          Toast.show({
            type: "success",
            position: "top",
            text1: "Transaction Details Successfully Updated",
            text2: `${response?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
          navigation.navigate("Transaction");
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Updating Transaction Details",
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

  return (
    <>
      {isLoading || isTransactionLoading ? (
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
                Update Transaction Details
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
                    Status
                  </Text>
                  <Picker
                    selectedValue={formik.values.status}
                    style={{ color: textColor }}
                    dropdownIconColor={textColor}
                    onValueChange={(itemValue) =>
                      formik.setFieldValue("status", itemValue)
                    }
                  >
                    <Picker.Item label="pending" value="pending" />
                    <Picker.Item label="completed" value="completed" />
                    <Picker.Item label="cancel" value="cancel" />
                  </Picker>

                  {formik.touched.status && formik.errors.status && (
                    <Text style={{ color: "red" }}>{formik.errors.status}</Text>
                  )}
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Payment
                  </Text>
                  <Picker
                    selectedValue={formik.values.payment}
                    style={{ color: textColor }}
                    dropdownIconColor={textColor}
                    onValueChange={(itemValue) =>
                      formik.setFieldValue("payment", itemValue)
                    }
                  >
                    <Picker.Item label="Cash" value="Cash" />
                    <Picker.Item label="Gcash" value="Gcash" />
                  </Picker>

                  {formik.touched.payment && formik.errors.payment && (
                    <Text style={{ color: "red" }}>
                      {formik.errors.payment}
                    </Text>
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
