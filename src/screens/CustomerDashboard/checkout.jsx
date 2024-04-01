import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { changeColor } from "@utils";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { BackIcon } from "@helpers";
import { useFormik } from "formik";
import { useAddAppointmentMutation } from "../../state/api/reducer";
import { useSelector, useDispatch } from "react-redux";
import Toast from "react-native-toast-message";
import { clearAppointmentData } from "../../state/appointment/appointmentReducer";
import { clearTransactionData } from "../../state/transaction/transactionReducer";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function () {
  const { textColor, backgroundColor, shadowColor } = changeColor();
  const navigation = useNavigation();

  const appointment = useSelector((state) => state?.appointment);
  // console.log("appointment", appointment);

  const hasAppointmentFee = useSelector(
    (state) => state?.fee?.hasAppointmentFee ?? null
  );
  // console.log("hasAppointmentFee", hasAppointmentFee);

  const selectedPayment = useSelector(
    (state) => state?.transaction?.transactionData?.payment ?? null
  );
  // console.log("selectedPayment", selectedPayment);

  const selectedCustomerType = useSelector(
    (state) => state?.transaction?.transactionData?.customerType ?? null
  );
  // console.log("selectedCustomerType", selectedCustomerType);

  const selectedImage = useSelector(
    (state) => state?.transaction?.transactionData?.image ?? null
  );
  // console.log("selectedImage", selectedImage);

  const selectedBeautician = useSelector(
    (state) => state?.transaction?.transactionData?.beautician ?? null
  );
  // console.log("selectedBeautician", selectedBeautician);

  const selectedDate = useSelector(
    (state) => state?.transaction?.transactionData?.date ?? null
  );
  // console.log("selectedDate", selectedDate);

  const selectedTime = useSelector(
    (state) => state?.transaction?.transactionData?.time ?? null
  );
  // console.log("selectedTime", selectedTime);

  const dispatch = useDispatch();

  const appointmentData =
    appointment && appointment.appointmentData
      ? appointment.appointmentData
      : [];

  // console.log("appointmentData", appointmentData);

  // console.log(
  //   "options",
  //   appointmentData?.flatMap((service) =>
  //     Array.isArray(service.option_id)
  //       ? service.option_id.filter(Boolean)
  //       : [service.option_id].filter(Boolean)
  //   ) || []
  // );

  const auth = useSelector((state) => state?.auth);
  const [addAppointment, { isLoading, refetch }] = useAddAppointmentMutation();

  const totalPrice = appointmentData
    ?.map((appointment) => appointment?.price)
    ?.reduce((total, amount) => total + amount, 0);

  // console.log("totalPrice", totalPrice);

  const extraFee = appointmentData
    ?.map((appointment) => appointment?.extraFee)
    ?.reduce((total, amount) => total + amount, 0);

  // console.log("extraFee", extraFee);

  const getInitialValues = () => {
    console.log("auth", auth);
    console.log("appointmentData", appointmentData);
    console.log("totalPrice", totalPrice);
    console.log("extraFee", extraFee);
    console.log("hasAppointmentFee", hasAppointmentFee);
    console.log("selectedBeautician", selectedBeautician);
    console.log("selectedDate", selectedDate);
    console.log("selectedTime", selectedTime);
    console.log("selectedPayment", selectedPayment);
    console.log("selectedCustomerType", selectedCustomerType);
    console.log("selectedImage", selectedImage);

    const sanitizedService = appointmentData
      ?.map((service) => service?.service_id)
      ?.filter(Boolean);

    const price = (totalPrice ?? 0) + (extraFee ?? 0);

    const initialValues = {
      customer: auth?.user?._id ?? null,
      service: sanitizedService ?? null,
      option:
        appointmentData
          ?.flatMap((service) =>
            Array.isArray(service?.option_id)
              ? service?.option_id?.filter(Boolean)
              : [service?.option_id]?.filter(Boolean)
          )
          ?.filter(Boolean) ?? null,
      price: price,
      hasAppointmentFee: !!hasAppointmentFee,
      status: "pending",
      beautician: selectedBeautician ?? null,
      date: selectedDate ?? null,
      time: selectedTime ?? null,
      payment: selectedPayment ?? null,
      image: selectedImage ?? null,
      customer_type: selectedCustomerType ?? null,
    };

    console.log("initialValues", initialValues);
    return initialValues;
  };

  const formik = useFormik({
    initialValues: getInitialValues(),
    onSubmit: (values) => {
      console.log("values", values);

      const formData = new FormData();

      selectedImage?.forEach((image) => {
        const imageName = image.split("/").pop();
        const imageType = "image/" + imageName.split(".").pop();

        formData.append("image", {
          uri: image,
          name: imageName,
          type: imageType,
        });
      });

      if (Array.isArray(values?.beautician)) {
        values.beautician.forEach((item) =>
          formData.append("beautician[]", item ?? null)
        );
      } else formData.append("beautician", values?.beautician ?? null);

      formData.append("customer", values?.customer ?? null);

      if (Array.isArray(values?.service)) {
        values.service.forEach((item) =>
          formData.append("service[]", item ?? null)
        );
      } else formData.append("service", values?.service ?? null);

      if (Array.isArray(values?.option)) {
        values.option.forEach((item) =>
          formData.append("option[]", item ?? null)
        );
      } else formData.append("option", values?.option ?? null);

      formData.append("date", values?.date ?? null);

      if (Array.isArray(values?.time)) {
        values.time.forEach((item) => formData.append("time[]", item ?? null));
      } else formData.append("time", values?.time ?? null);

      formData.append("payment", values?.payment ?? null);
      formData.append("price", values?.price ?? null);
      formData.append("hasAppointmentFee", values?.hasAppointmentFee ?? null);
      if (
        values.customer_type !== undefined &&
        values.customer_type !== null &&
        values.customer_type !== ""
      ) {
        formData.append("customer_type", values.customer_type ?? null);
      }

      formData.append("status", values?.status ?? null);

      console.log("formData", formData);

      addAppointment(formData).then((response) => {
        console.log("response", response.error);
        dispatch(clearAppointmentData());
        dispatch(clearTransactionData());
        formik.resetForm();
        Toast.show({
          type: "success",
          position: "top",
          text1: "Transaction Successfully Created",
          text2: "Please pay the exact amount of your transaction.",
          visibilityTime: 3000,
          autoHide: true,
        });
        navigation.navigate("CustomerDrawer");
      });
    },
  });

  useEffect(() => {
    formik.setValues(getInitialValues());
  }, [
    selectedBeautician,
    selectedDate,
    selectedTime,
    selectedPayment,
    selectedCustomerType,
    selectedImage,
  ]);

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

    navigation.navigate("PaymentOption");
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
    } else navigation.navigate("Employee", { selectedAppointment });
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
    } else navigation.navigate("ChooseDate");
  };
  const handleSuccess = () => {
    navigation.navigate("CheckoutSuccess");
  };

  return (
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
                height: windowHeight * 0.15,
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
                <TouchableOpacity onPress={handleDateTime} className={`flex-1`}>
                  <View className={`flex-row justify-end items-end`}>
                    <Feather name="chevron-right" size={40} color={textColor} />
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
            {appointmentData &&
              appointmentData.map((appointment, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    const newSelectedAppointment =
                      selectedAppointment === appointment.type
                        ? null
                        : appointment.type;
                    // console.log("Selected Appointment:", newSelectedAppointment);
                    setSelectedAppointment(newSelectedAppointment);
                  }}
                  style={{
                    backgroundColor:
                      selectedAppointment === appointment.type
                        ? "#F78FB3"
                        : "#FDA7DF",
                    width: windowWidth * 0.925,
                  }}
                  className={`rounded-2xl px-4 pb-4 pt-1 mt-4 mb-2`}
                >
                  <View className={`flex-col`}>
                    <View className={`flex-col pt-4 self-center`}>
                      <Image
                        source={{
                          uri: appointment?.image[
                            Math.floor(
                              Math.random() * appointment?.image?.length
                            )
                          ]?.url,
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
                        {appointment?.duration} | ₱{appointment?.price}
                      </Text>
                    </View>
                    <View className={`flex-col pt-2`}>
                      <View className={`pt-1`}>
                        <Text
                          style={{ color: textColor }}
                          className={`text-lg font-semibold`}
                        >
                          Product Use: {appointment?.product_name}
                        </Text>
                        <Text
                          style={{ color: textColor }}
                          className={`text-lg font-semibold`}
                        >
                          Description: {appointment?.description}
                        </Text>
                        <Text
                          style={{ color: textColor }}
                          className={`text-lg flex-wrap text-start font-semibold`}
                        >
                          For: {appointment?.type.join(", ")}
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
              ))}
          </ScrollView>
        </ScrollView>
        <View
          style={{
            backgroundColor,
            height: windowHeight * 0.25,
            width: windowWidth,
          }}
          className={`flex-col px-10`}
        >
          <View className={`flex-row justify-center items-center pt-4 pb-2`}>
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
                  <Feather name="chevron-right" size={25} color="#FDA7DF" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View className={`flex-row gap-x-1 justify-center items-center pb-2`}>
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
                  <Feather name="chevron-right" size={25} color="#FDA7DF" />
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
            <Text style={{ color: textColor }} className={`text-lg font-bold`}>
              Total
            </Text>
            <View className={`flex-1 justify-start items-end`}>
              <Text
                style={{ color: textColor }}
                className={`text-lg font-bold`}
              >
                ₱
                {appointmentData
                  ?.map(
                    (appointment) => appointment.price + appointment.extraFee
                  )
                  .reduce((total, amount) => total + amount, 0)}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={formik.handleSubmit}>
            <View
              className={`justify-center items-center rounded-md py-2 bg-primary-default`}
            >
              <Text
                style={{ color: textColor }}
                className={`text-center text-lg font-bold`}
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
