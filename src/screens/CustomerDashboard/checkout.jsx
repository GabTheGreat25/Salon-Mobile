import React from "react";
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
import { appointmentSlice } from "../../state/appointment/appointmentReducer";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function () {
  const { textColor, backgroundColor, shadowColor } = changeColor();
  const navigation = useNavigation();

  const appointment = useSelector((state) => state?.appointment);

  const selectedServiceTwo = useSelector(
    (state) => state?.appointment?.appointmentData?.service
  );
  console.log(selectedServiceTwo);

  const selectedPayment = useSelector(
    (state) => state?.transaction?.transactionData?.payment
  );
  console.log(selectedPayment);

  const selectedCustomerType = useSelector(
    (state) => state?.transaction?.transactionData?.customerType
  );
  console.log(selectedCustomerType);

  const image = useSelector(
    (state) => state?.transaction?.transactionData?.image
  );
  console.log(image);

  const selectedEmployee = useSelector(
    (state) => state?.appointment?.transactionData?.employee?._id
  );
  console.log(selectedEmployee);

  const selectedDate = useSelector(
    (state) => state?.transaction?.transactionData?.date
  );
  console.log(selectedDate);
  const selectedTime = useSelector(
    (state) => state?.transaction?.transactionData?.time
  );
  console.log(selectedTime);

  const dispatch = useDispatch();

  const appointmentData = appointment?.appointmentData;

  const auth = useSelector((state) => state.auth);
  const [addAppointment, { isLoading }] = useAddAppointmentMutation();

  const formik = useFormik({
    initialValues: {
      service: selectedServiceTwo,
      employee: selectedEmployee,
      customer: auth.user._id,
      date: selectedDate,
      time: selectedTime,
      price: appointmentData?.reduce((total, item) => total + item.price, 0),
      extraFee: appointmentData?.reduce(
        (total, item) => total + item.extraFee,
        0
      ),
      note: "",
      payment: selectedPayment,
      status: "pending",
    },
    onSubmit: (values) => {
      console.log(values);
      addAppointment(values)
        .unwrap()
        .then((response) => {
          dispatch(appointmentSlice.actions.clearAppointmentData());
          formik.resetForm();
          Toast.show({
            type: "success",
            position: "top",
            text1: "Transaction Successfully Created",
            text2: `${response?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
          navigation.navigate("CheckoutSuccess");
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Creating Transaction",
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

    navigation.navigate("PaymentOption");
  };

  const handleEmployee = () => {
    navigation.navigate("Employee");
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
            {appointmentData?.map((appointment, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: "#FDA7DF",
                  width: windowWidth * 0.925,
                }}
                className={`rounded-2xl px-4 pb-4 pt-1 mt-4 mb-2`}
              >
                <View className={`flex-col`}>
                  <View className={`flex-col pt-4 self-center`}>
                    <Image
                      source={{
                        uri: appointment?.image[
                          Math.floor(Math.random() * appointment?.image?.length)
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
              </View>
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
                    (appointment) => appointment?.price + appointment?.extraFee
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
