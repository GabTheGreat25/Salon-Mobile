import React from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { changeColor, dimensionLayout } from "@utils";
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
  const { textColor, backgroundColor, shadowColor, colorScheme } =
    changeColor();
  const navigation = useNavigation();
  const isDimensionLayout = dimensionLayout();
  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#FDA7DF";
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

  const selectedService = useSelector((state) => state?.appointment);
  const selectedServiceTwo = useSelector(
    (state) => state?.appointment?.appointmentData?.service
  );
  const selectedPayment = useSelector(
    (state) => state?.appointment?.appointmentData?.payment?.type
  );
  console.log(selectedPayment);
  const selectedEmployee = useSelector(
    (state) => state?.appointment?.appointmentData?.employee?._id
  );
  console.log(selectedEmployee);

  const selectedDate = useSelector(
    (state) => state?.appointment?.appointmentData?.date
  );
  console.log(selectedDate);

  const selectedTime = useSelector(
    (state) => state?.appointment?.appointmentData?.time
  );
  console.log(selectedTime);

  const dispatch = useDispatch();

  const appointmentData = selectedService?.appointmentData;
  const dataAsArray = appointmentData ? [appointmentData] : [];

  const auth = useSelector((state) => state.auth);
  const [addAppointment, { isLoading }] = useAddAppointmentMutation();
  const items = dataAsArray.map((item) => ({
    name: item.service_name,
    product: item.product_name,
    price: item.price,
    extraFee: item.extraFee,
    image: item?.image,
  }));

  const formik = useFormik({
    initialValues: {
      service: selectedServiceTwo,
      employee: selectedEmployee,
      customer: auth.user._id,
      date: selectedDate,
      time: selectedTime,
      price: items?.reduce((total, item) => total + item.price, 0),
      extraFee: items?.reduce((total, item) => total + item.extraFee, 0),
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
          console.log(error?.data?.error?.message);
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
    navigation.navigate("PaymentOption");
  };

  const handleEmployee = () => {
    navigation.navigate("Employee");
  };

  const handleDateTime = () => {
    navigation.navigate("ChooseDate");
  };

  const handleSuccess = () => {
    navigation.navigate("CheckoutSuccess");
  };

  return (
    <>
      <View style={{ backgroundColor }} className={`flex-1`}>
        <BackIcon navigateBack={navigation.goBack} textColor={textColor} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          decelerationRate="fast"
          scrollEventThrottle={1}
          style={{
            backgroundColor,
          }}
          className={`px-3 flex-1 mt-20`}
        >
          <ScrollView
            decelerationRate="fast"
            scrollEventThrottle={1}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{
                backgroundColor: invertBackgroundColor,
                height: windowHeight * 0.15,
                width: windowWidth * 0.925,
              }}
              className={`flex-col ${
                isDimensionLayout ? "mx-1 px-4 pt-4 mb-2" : "mx-3"
              }`}
            >
              <Text
                style={{ color: invertTextColor }}
                className={`text-base font-semibold`}
              >
                Appointment Schedule
              </Text>
              <View className={`flex-row`}>
                <Text
                  style={{ color: invertTextColor }}
                  className={`text-base font-semibold`}
                >
                  {selectedDate} |{selectedTime}
                </Text>
                <TouchableOpacity onPress={handleDateTime} className={`flex-1`}>
                  <View className={`flex-row justify-end items-end`}>
                    <Feather
                      name="chevron-right"
                      size={40}
                      color={invertTextColor}
                    />
                  </View>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={handleDateTime}>
                <Text
                  style={{ color: invertTextColor }}
                  className={`text-2xl font-semibold`}
                >
                  Select Date & Time
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                backgroundColor: invertBackgroundColor,
                height: windowHeight * 0.25,
                width: windowWidth * 0.925,
              }}
              className={`flex-row ${
                isDimensionLayout ? "mx-1 px-4 mb-2" : "mx-3"
              }`}
            >
              {items.map((item, index) => (
                <View key={index} className={`flex-1 flex-col`}>
                  <View className={`flex-row`}>
                    <View className={`flex-1 justify-center items-center pt-5`}>
                      <Image
                        source={{ uri: item?.image?.[0]?.url }}
                        resizeMode="cover"
                        className={`h-[100px] w-[100px] rounded-full`}
                      />
                    </View>
                    <View
                      className={`flex-1 flex-col justify-center items-start`}
                    >
                      <Text
                        style={{ color: invertTextColor }}
                        className={` ${
                          isDimensionLayout
                            ? "text-2xl pl-2 pr-1 pt-4"
                            : "text-lg px-4 py-6"
                        } font-semibold`}
                      >
                        {item.name}
                      </Text>
                      <Text
                        style={{ color: invertTextColor }}
                        className={` ${
                          isDimensionLayout
                            ? "text-base pl-2 pr-1 pt-2"
                            : "text-lg px-4 py-6"
                        } font-semibold`}
                      >
                        {item.product}
                      </Text>
                      <Text
                        style={{ color: invertTextColor }}
                        className={` ${
                          isDimensionLayout
                            ? "text-2xl pl-2 pr-1 pt-4"
                            : "text-lg px-4 py-6"
                        } font-semibold`}
                      >
                        ₱{item.price}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      borderBottomColor: invertTextColor,
                      borderBottomWidth: 1,
                      marginTop: 5,
                      paddingVertical: 10,
                    }}
                  />
                </View>
              ))}
            </View>
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
              className={`${
                isDimensionLayout ? "text-sm" : "text-lg px-4 py-6"
              } font-semibold`}
            >
              Payment Option
            </Text>
            <View className={`flex-1 justify-end items-end`}>
              <TouchableOpacity onPress={handlePayment}>
                <View className={`flex-row`}>
                  <Text
                    className={`${
                      isDimensionLayout ? "text-base" : "text-lg px-4 py-6"
                    } font-medium text-primary-default`}
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
              className={`${
                isDimensionLayout ? "text-sm" : "text-lg px-4 py-6"
              } font-medium`}
            >
              Pick A Beautician
            </Text>
            <View className={`flex-1 justify-end items-end`}>
              <TouchableOpacity onPress={handleEmployee}>
                <View className={`flex-row`}>
                  <Text
                    className={`${
                      isDimensionLayout ? "text-base" : "text-lg px-4 py-6"
                    } font-medium text-primary-default`}
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
            <Text
              style={{ color: textColor }}
              className={`${
                isDimensionLayout ? "text-lg" : "text-lg px-4 py-6"
              } font-bold`}
            >
              Total
            </Text>
            <View className={`flex-1 justify-start items-end`}>
              <Text
                style={{ color: textColor }}
                className={`${
                  isDimensionLayout ? "text-lg" : "text-lg px-4 py-6"
                } font-bold`}
              >
                {items?.map(
                  (item) => `₱${(item.price + item?.extraFee)?.toFixed(2)}`
                )}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={formik.handleSubmit}>
            <View
              style={{
                backgroundColor: invertBackgroundColor,
              }}
              className={`justify-center items-center rounded-md py-2`}
            >
              <Text
                style={{ color: invertTextColor }}
                className={`text-center ${
                  isDimensionLayout ? "text-lg" : "text-lg px-4 py-6"
                } font-bold`}
              >
                Confirm
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
