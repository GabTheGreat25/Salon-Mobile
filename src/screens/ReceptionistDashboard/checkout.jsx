import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  TouchableWithoutFeedback,
} from "react-native";
import { changeColor } from "@utils";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { BackIcon } from "@helpers";
import { useFormik } from "formik";
import {
  useAddAppointmentMutation,
  useMayaCheckoutMutation,
} from "../../state/api/reducer";
import { useSelector, useDispatch } from "react-redux";
import Toast from "react-native-toast-message";
import { clearAppointmentData } from "../../state/appointment/appointmentReducer";
import { clearTransactionData } from "../../state/transaction/transactionReducer";
import { createTransactionValidation } from "../../validation";
import { LoadingScreen } from "@components";
import { customerSlice } from "../../state/auth/customerIdReducer";

const windowWidth = Dimensions.get("window").width;

export default function () {
  const { textColor, backgroundColor, shadowColor } = changeColor();
  const navigation = useNavigation();

  const appointment = useSelector((state) => state?.appointment);

  const hasAppointmentFee = useSelector(
    (state) => state?.fee?.hasAppointmentFee
  );

  const selectedPayment = useSelector(
    (state) => state?.transaction?.transactionData?.payment
  );

  const selectedCustomerType = useSelector(
    (state) => state?.transaction?.transactionData?.customerType
  );

  const selectedImage = useSelector(
    (state) => state?.transaction?.transactionData?.image
  );

  const selectedBeautician = useSelector(
    (state) => state?.transaction?.transactionData?.beautician
  );

  const selectedDate = useSelector(
    (state) => state?.transaction?.transactionData?.date
  );

  const selectedTime = useSelector(
    (state) => state?.transaction?.transactionData?.time
  );

  const dispatch = useDispatch();

  const appointmentData = appointment?.appointmentData || [];
  const filteredAppointmentData = appointmentData.filter(
    (appointment) => appointment.price !== 0
  );

  const customer = useSelector((state) => state.customer);

  const [addAppointment, { isLoading }] = useAddAppointmentMutation();
  const [mayaCheckout] = useMayaCheckoutMutation();

  const totalPrice = filteredAppointmentData
    ?.map((appointment) => appointment?.price)
    ?.reduce((total, amount) => total + amount, 0);

  const extraFee = filteredAppointmentData
    ?.map((appointment) => appointment?.extraFee)
    ?.reduce((total, amount) => total + amount, 0);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      customer: customer?.customerId || "",
      service:
        filteredAppointmentData?.map((service) => service?.service_id) || [],
      option: filteredAppointmentData?.flatMap((service) =>
        Array.isArray(service?.option_id)
          ? service?.option_id?.filter(Boolean)
          : [service?.option_id]?.filter(Boolean) || []
      ),
      price: totalPrice + extraFee || 0,
      hasAppointmentFee: hasAppointmentFee || false,
      status: "pending",
      beautician: selectedBeautician || [],
      date: selectedDate || "",
      time: selectedTime || [],
      payment: selectedPayment || "",
      image: selectedImage || [],
      customer_type: selectedCustomerType || "Customer",
    },
    validationSchema: createTransactionValidation,
    onSubmit: async (values) => {
      const formData = new FormData();

      if (selectedImage.some((img) => img === undefined || img === null)) {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Error",
          text2: "Please select an image.",
          visibilityTime: 3000,
          autoHide: true,
        });
        return;
      }

      selectedImage?.forEach((image) => {
        const imageName = image?.split("/")?.pop();
        const imageType = "image/" + imageName?.split(".")?.pop();

        formData?.append("image", {
          uri: image,
          name: imageName,
          type: imageType,
        });
      });
      if (Array?.isArray(values?.beautician)) {
        values?.beautician.forEach((item) =>
          formData?.append("beautician[]", item)
        );
      } else formData.append("beautician", values?.beautician);
      formData?.append("customer", values?.customer);
      if (Array?.isArray(values?.service)) {
        values?.service?.forEach((item) => formData?.append("service[]", item));
      } else formData?.append("service", values?.service);
      if (Array?.isArray(values?.option)) {
        values?.option?.forEach((item) => formData.append("option[]", item));
      } else formData?.append("option", values?.option);
      formData?.append("date", values?.date);
      if (Array?.isArray(values?.time)) {
        values?.time?.forEach((item) => formData?.append("time[]", item));
      } else formData?.append("time", values?.time);
      formData?.append("payment", values?.payment);
      formData?.append("price", values?.price);
      formData?.append("hasAppointmentFee", values?.hasAppointmentFee);
      formData?.append("customer_type", values?.customer_type);
      formData?.append("status", values?.status);

      addAppointment(formData)
        .unwrap()
        .then((response) => {
          console.log(response);
          dispatch(customerSlice.actions.resetId());
          dispatch(clearAppointmentData());
          dispatch(clearTransactionData());
          formik.resetForm();
          Toast.show({
            type: "success",
            position: "top",
            text1: "Transaction Successfully Created",
            text2: `${response?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
          navigation.navigate("ReceptionistDrawer");
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Creating Transaction Details",
            text2: `${error?.data?.error?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
        });
    },
  });

  const mayaFormik = useFormik({
    initialValues: {
      hasAppointmentFee: hasAppointmentFee || false,
      discount: 0,
      contactNumber: customer?.contact_number,
      name: customer?.name,
      items: filteredAppointmentData.map((appointment) => ({
        name: appointment.service_name,
        description: appointment.description,
        totalAmount: {
          value:
            appointment.price +
            (appointment.per_price
              ? appointment.per_price.reduce((acc, val) => acc + val, 0)
              : 0),
        },
      })),
    },
    onSubmit: (values) => {
      mayaCheckout(values)
        .then(() => {
          dispatch(customerSlice.actions.resetId());
          dispatch(clearAppointmentData());
          dispatch(clearTransactionData());
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Creating Maya Payment Link",
            text2: `${error?.data?.error?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
        });
    },
  });

  const handlePayment = () => {
    if (!selectedDate || !selectedTime || selectedTime.length === 0) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Warning",
        text2: "Please select a date and time first",
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }

    navigation.navigate("ReceptionistPaymentOption");
  };

  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const handleEmployee = () => {
    if (selectedAppointment === null) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Warning",
        text2: "Please select a service first",
        visibilityTime: 3000,
        autoHide: true,
      });
    } else navigation.navigate("ReceptionistEmployee", { selectedAppointment });
  };

  const handleDateTime = () => {
    if (appointment.count === 0) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Warning",
        text2: "Please Add Service First",
        visibilityTime: 3000,
        autoHide: true,
      });
    } else navigation.navigate("ReceptionistChooseDate");
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
          <SafeAreaView style={{ backgroundColor }} className={`flex-1`}>
            <BackIcon navigateBack={navigation.goBack} textColor={textColor} />
            <ScrollView
              showsVerticalScrollIndicator={false}
              decelerationRate="fast"
              scrollEventThrottle={1}
              style={{
                backgroundColor,
              }}
              className={`px-4 mt-14`}
            >
              <ScrollView
                decelerationRate="fast"
                scrollEventThrottle={1}
                showsVerticalScrollIndicator={false}
                className={`pb-6`}
              >
                <View
                  style={{
                    height: 115,
                    width: windowWidth * 0.925,
                  }}
                  className={`flex-col justify-center px-4 mb-1 bg-primary-default rounded-2xl`}
                >
                  <Text
                    style={{ color: textColor }}
                    className={`text-lg font-semibold`}
                  >
                    Appointment Schedule
                  </Text>
                  <View className={`flex-row`}>
                    <Text
                      style={{ color: textColor }}
                      className={`text-base font-semibold`}
                    >
                      {selectedDate ? selectedDate : "Add Date"} |{" "}
                      {selectedTime && selectedTime.length > 0
                        ? selectedTime.length > 1
                          ? `${selectedTime[0]} to ${
                              selectedTime[selectedTime.length - 1]
                            }`
                          : selectedTime[0]
                        : "Add Time"}
                    </Text>
                    <TouchableOpacity
                      onPress={handleDateTime}
                      className={`flex-1`}
                    >
                      <View className={`flex-row justify-end items-end`}>
                        <Feather
                          name="chevron-right"
                          size={40}
                          color={textColor}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={handleDateTime}>
                    <Text
                      style={{ color: textColor }}
                      className={`text-xl font-semibold`}
                    >
                      Select Date & Time
                    </Text>
                  </TouchableOpacity>
                </View>
                {filteredAppointmentData &&
                Array.isArray(filteredAppointmentData) &&
                filteredAppointmentData.length > 0 ? (
                  filteredAppointmentData?.map((appointment, index) => (
                    <TouchableOpacity
                      key={index ?? null}
                      onPress={() => {
                        const newSelectedAppointment =
                          selectedAppointment === appointment?.type
                            ? null
                            : appointment?.type;
                        setSelectedAppointment(newSelectedAppointment);
                      }}
                      style={{
                        width: windowWidth * 0.925,
                      }}
                      className={`rounded-2xl px-4 pb-4 pt-1 mt-4 mb-2 ${
                        selectedAppointment === appointment?.type
                          ? "bg-primary-accent"
                          : "bg-primary-default"
                      }`}
                    >
                      <View className={`flex-col`}>
                        <View className={`flex-col pt-4 self-center`}>
                          <Image
                            source={{
                              uri:
                                appointment?.image?.length > 0
                                  ? appointment?.image[
                                      Math.floor(
                                        Math.random() *
                                          appointment?.image?.length
                                      )
                                    ]?.url
                                  : null,
                            }}
                            resizeMode="cover"
                            className={`h-[150px] w-[300px]`}
                          />
                          <Text
                            style={{ color: textColor }}
                            className={`text-center text-lg font-semibold pt-4`}
                          >
                            Name: {appointment?.service_name}
                          </Text>
                          <Text
                            style={{ color: textColor }}
                            className={`flex-wrap text-center text-lg font-semibold`}
                          >
                            {appointment?.duration ?? null} | ₱
                            {appointment?.price ?? null}
                          </Text>
                        </View>
                        <View className={`flex-col pt-2`}>
                          <View className={`pt-1`}>
                            <Text
                              style={{ color: textColor }}
                              className={`text-lg font-semibold`}
                            >
                              Product Use: {appointment?.product_name ?? null}
                            </Text>
                            <Text
                              style={{ color: textColor }}
                              className={`text-lg font-semibold`}
                            >
                              Description: {appointment?.description ?? null}
                            </Text>
                            <Text
                              style={{ color: textColor }}
                              className={`text-lg flex-wrap text-start font-semibold`}
                            >
                              For:{" "}
                              {Array.isArray(appointment?.type)
                                ? appointment?.type.join(", ")
                                : "None"}
                            </Text>
                            <Text
                              style={{ color: textColor }}
                              className={`text-lg font-semibold`}
                            >
                              Add Ons:{" "}
                              {appointment?.option_name?.length > 0
                                ? appointment?.option_name
                                    .split(", ")
                                    .map(
                                      (option, index) =>
                                        `${option} - ₱${
                                          appointment?.per_price[index]
                                        }${
                                          index !==
                                          appointment?.option_name.split(", ")
                                            .length -
                                            1
                                            ? ", "
                                            : ""
                                        }`
                                    )
                                    .join("")
                                : "None"}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View
                    className={`flex-1 justify-center items-center`}
                    style={{ backgroundColor }}
                  >
                    <Text style={{ color: textColor }}>No data available.</Text>
                  </View>
                )}
              </ScrollView>
            </ScrollView>
            <View
              style={{
                shadowColor,
                backgroundColor,
                height: 200,
                width: windowWidth,
              }}
              className={`flex-col px-10 shadow-2xl`}
            >
              <View
                className={`flex-row justify-center items-center pt-4 pb-2`}
              >
                <Text
                  style={{ color: textColor }}
                  className={`text-sm font-semibold`}
                >
                  Payment Option
                </Text>
                <View className={`flex-1 justify-end items-end`}>
                  <TouchableOpacity onPress={handlePayment}>
                    <View className={`flex-row`}>
                      <Text
                        className={`text-base font-medium text-primary-default`}
                      >
                        Select Payment Method
                      </Text>
                      <Feather name="chevron-right" size={25} color="#FFB6C1" />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View
                className={`flex-row gap-x-1 justify-center items-center pb-2`}
              >
                <Feather name="user" size={25} color={textColor} />
                <Text
                  style={{ color: textColor }}
                  className={`text-sm font-medium`}
                >
                  Pick A Beautician
                </Text>
                <View className={`flex-1 justify-end items-end`}>
                  <TouchableOpacity onPress={handleEmployee}>
                    <View className={`flex-row`}>
                      <Text
                        className={`text-base font-medium text-primary-default`}
                      >
                        Select Beautician
                      </Text>
                      <Feather name="chevron-right" size={25} color="#FFB6C1" />
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
                  className={`text-lg font-bold`}
                >
                  Total
                </Text>
                <View className={`flex-1 justify-start items-end`}>
                  <Text
                    style={{ color: textColor }}
                    className={`text-lg font-bold`}
                  >
                    ₱
                    {filteredAppointmentData
                      ?.map(
                        (appointment) =>
                          appointment?.price + appointment?.extraFee
                      )
                      ?.reduce((total, amount) => total + amount, 0)}
                  </Text>
                </View>
              </View>
              <TouchableWithoutFeedback
                onPress={() => {
                  formik.handleSubmit();
                  if (
                    formik.values?.payment === "Maya" &&
                    formik.values?.hasAppointmentFee === true
                  ) {
                    mayaFormik.handleSubmit();
                  }
                }}
                disabled={!formik.isValid}
              >
                <View
                  className={`justify-center items-center rounded-md py-2 bg-primary-default ${
                    !formik.isValid ? "opacity-50" : "opacity-100"
                  }`}
                >
                  <Text
                    style={{ color: textColor }}
                    className={`text-center text-xl font-semibold`}
                  >
                    Confirm
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </SafeAreaView>
        </>
      )}
    </>
  );
}
