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
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { BackIcon } from "@helpers";
import { useSelector, useDispatch } from "react-redux";
import { decreaseCount } from "../../state/appointment/appointmentReducer";
import { clearTransactionData } from "../../state/transaction/transactionReducer";
import { feeSlice } from "../../state/appointment/hasAppointmentReducer";
import Toast from "react-native-toast-message";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function () {
  const { textColor, backgroundColor, shadowColor } = changeColor();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const appointment = useSelector((state) => state?.appointment);

  const appointmentData = appointment?.appointmentData || [];
  const appointmentCount = appointment?.count;

  const handlePress = () => {
    dispatch(feeSlice.actions.hasFee());
    navigation.navigate("Checkout");
  };

  const handleTrashClick = (serviceId) => {
    dispatch(decreaseCount(serviceId));
    dispatch(clearTransactionData());
    Toast.show({
      type: "success",
      position: "bottom",
      text1: "Deleted Item",
      text2: "Successfully Removed In Cart",
      visibilityTime: 3000,
      autoHide: true,
    });
  };

  return (
    <>
      <SafeAreaView style={{ backgroundColor }} className={`flex-1`}>
        <BackIcon navigateBack={navigation.goBack} textColor={textColor} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          decelerationRate="fast"
          scrollEventThrottle={1}
          className={`mt-12`}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            decelerationRate="fast"
            scrollEventThrottle={1}
            className={`px-3 pb-6`}
          >
            {appointmentData?.map((appointment, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: "#FDA7DF",
                  width: windowWidth * 0.925,
                }}
                className={`rounded-2xl p-4 mt-4 mb-2`}
              >
                <View className={`flex-1 flex-col`}>
                  <View className={`flex-row gap-x-2`}>
                    <Feather name="home" size={20} color={textColor} />
                    <Text
                      style={{ color: textColor }}
                      className={`text-base font-semibold`}
                    >
                      Lhanlee Beauty Lounge
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleTrashClick(appointment?.service_id)}
                      className={`flex-1 justify-end items-end`}
                    >
                      <Feather name="trash-2" size={20} color={textColor} />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      borderBottomColor: textColor,
                      borderBottomWidth: 1,
                      marginTop: 5,
                    }}
                  />
                </View>
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
            shadowColor,
            backgroundColor,
            height: windowHeight * 0.28,
            width: windowWidth,
          }}
          className={`flex-col px-10 shadow-2xl`}
        >
          <View className={`flex-row pt-4 pb-2`}>
            <View className={`flex-col`}>
              <Text
                style={{ color: textColor }}
                className={`text-xl font-semibold`}
              >
                Order Summary
              </Text>
              <Text
                style={{ color: textColor }}
                className={`text-lg font-semibold`}
              >
                Subtotal ({appointmentCount}{" "}
                {appointmentCount === 1 ? "item" : "items"})
              </Text>
            </View>
            <View className={`flex-1 justify-start items-end`}>
              <Text
                style={{ color: textColor }}
                className={`text-lg font-semibold`}
              >
                ₱
                {appointmentData
                  ?.map((appointment) => appointment?.price)
                  .reduce((total, amount) => total + amount, 0)}
              </Text>
            </View>
          </View>
          <View className={`flex-row pb-2`}>
            <Text
              style={{ color: textColor }}
              className={`text-lg font-semibold`}
            >
              Extra Fee
            </Text>
            <View className={`flex-1 justify-start items-end`}>
              <Text
                style={{ color: textColor }}
                className={`text-lg font-semibold`}
              >
                ₱
                {appointmentData
                  ?.map((appointment) => appointment?.extraFee)
                  .reduce((total, amount) => total + amount, 0)}
              </Text>
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
                className={`text-lg font-semibold`}
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
          <TouchableOpacity onPress={handlePress}>
            <View
              className={`justify-center items-center rounded-md py-2 bg-primary-default`}
            >
              <Text
                style={{ color: textColor }}
                className={`text-center text-lg font-bold`}
              >
                Checkout
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}
