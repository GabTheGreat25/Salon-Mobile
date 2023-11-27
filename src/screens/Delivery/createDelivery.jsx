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
  BackHandler,
  TextInput,
} from "react-native";
import { changeColor } from "@utils";
import { BackIcon } from "@helpers";
import { useNavigation } from "@react-navigation/native";
import { LoadingScreen } from "@components";
import { dimensionLayout } from "@utils";
import { useFormik } from "formik";
import {
  useAddDeliveryMutation,
  useGetDeliveriesQuery,
  useGetProductsQuery,
} from "../../state/api/reducer";
import { createDeliveryValidation } from "../../validation";
import Toast from "react-native-toast-message";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function () {
  const navigation = useNavigation();
  const isDimensionLayout = dimensionLayout();
  const { backgroundColor, textColor, colorScheme } = changeColor();

  const borderColor = colorScheme === "dark" ? "#e5e5e5" : "#212B36";

  const scroll = isDimensionLayout ? 500 : 400;

  const { refetch: refetchDeliveries } = useGetDeliveriesQuery();
  const { data } = useGetProductsQuery();
  const [addDelivery, { isLoading }] = useAddDeliveryMutation();

  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(scroll);

  const formik = useFormik({
    initialValues: {
      company_name: "",
      date: "",
      price: "",
      quantity: "",
      product: "",
    },
    validationSchema: createDeliveryValidation,
    onSubmit: (values) => {
      addDelivery(values)
        .unwrap()
        .then((response) => {
          refetchDeliveries();
          navigation.navigate("Delivery");
          formik.resetForm();
          Toast.show({
            type: "success",
            position: "top",
            text1: "Delivery Successfully Created",
            text2: `${response?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Creating Delivery",
            text2: `${error?.data?.error?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
        });
    },
  });

  const handleTextInputFocus = () => {
    setScrollViewHeight(keyboardOpen ? 650 : scroll);
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
        setScrollViewHeight(650);
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
      {isLoading ? (
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
              className={`flex-1 items-center justify-center ${
                isDimensionLayout ? "mt-20" : "mt-10"
              }`}
            >
              <Text
                style={{ color: textColor }}
                className={`my-10 font-semibold text-center ${
                  isDimensionLayout ? "text-3xl" : "text-2xl"
                }`}
              >
                Create Delivery
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
                  scrollEnabled={scrollViewHeight > 350}
                  decelerationRate="fast"
                  scrollEventThrottle={1}
                >
                  <TextInput
                    style={{ color: textColor }}
                    className={`border-b mb-3 ${borderColor}`}
                    placeholder="Enter your company name"
                    placeholderTextColor={textColor}
                    autoCapitalize="none"
                    handleTextInputFocus={handleTextInputFocus}
                    onChangeText={formik.handleChange("company_name")}
                    onBlur={formik.handleBlur("company_name")}
                    value={formik.values.company_name}
                  />
                  {formik.touched.company_name &&
                    formik.errors.company_name && (
                      <Text style={{ color: "red" }}>
                        {formik.errors.company_name}
                      </Text>
                    )}

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
                    value={formik.values.price}
                  />
                  {formik.touched.price && formik.errors.price && (
                    <Text style={{ color: "red" }}>{formik.errors.price}</Text>
                  )}

                  <TextInput
                    style={{ color: textColor }}
                    className={`border-b mb-3 ${borderColor}`}
                    placeholder="Enter the quantity"
                    placeholderTextColor={textColor}
                    keyboardType="numeric"
                    autoCapitalize="none"
                    handleTextInputFocus={handleTextInputFocus}
                    onChangeText={formik.handleChange("quantity")}
                    onBlur={formik.handleBlur("quantity")}
                    value={formik.values.quantity}
                  />
                  {formik.touched.quantity && formik.errors.quantity && (
                    <Text style={{ color: "red" }}>
                      {formik.errors.quantity}
                    </Text>
                  )}

                  <Picker
                    selectedValue={formik.values.product}
                    style={{ color: textColor }}
                    dropdownIconColor={textColor}
                    onValueChange={(itemValue) =>
                      formik.setFieldValue("product", itemValue)
                    }
                  >
                    <Picker.Item label="Select Product" value="" />
                    {data?.details?.map((product) => (
                      <Picker.Item
                        key={product._id}
                        label={product.product_name}
                        value={product._id}
                      />
                    ))}
                  </Picker>
                  {formik.touched.product && formik.errors.product && (
                    <Text style={{ color: "red" }}>
                      {formik.errors.product}
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
