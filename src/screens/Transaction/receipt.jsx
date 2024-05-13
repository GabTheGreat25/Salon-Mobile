import React from "react";
import { View, Text, Image, SafeAreaView, Dimensions } from "react-native";
import { useGetTransactionByIdQuery } from "../../state/api/reducer";
import { BackIcon } from "@helpers";
import { changeColor } from "@utils";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { LoadingScreen } from "@components";

const windowWidth = Dimensions.get("window").width;

export default function ({ route }) {
  const { id } = route.params;
  const navigation = useNavigation();
  const { backgroundColor, textColor, colorScheme } = changeColor();

  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#FFB6C1";
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

  const { data, isLoading } = useGetTransactionByIdQuery(id);

  const auth = useSelector((state) => state.auth);

  const { appointment } = data?.details || {};

  const totalPrice = appointment?.service?.reduce(
    (acc, service) => acc + (service?.price || 0),
    0
  );
  const extraFeePrice = appointment?.option?.reduce(
    (acc, option) => acc + (option?.extraFee || 0),
    0
  );

  const TotalFee = totalPrice + extraFeePrice;

  const hasDiscount = data?.details?.hasDiscount;

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
          <SafeAreaView
            style={{ backgroundColor }}
            className={`relative flex-1`}
          >
            <BackIcon navigateBack={navigation.goBack} textColor={textColor} />
            <View className={`flex-1 items-center justify-center`}>
              <View
                style={{
                  width: windowWidth * 0.925,
                  backgroundColor: invertBackgroundColor,
                }}
                className={`px-4 py-8 rounded-lg`}
              >
                <View className={`pb-4`}>
                  <View className={`flex-row justify-between`}>
                    {appointment?.service?.map((service, index) => (
                      <View className={`flex-col`} key={index}>
                        <Text
                          style={{ color: invertTextColor }}
                          className={`text-2xl font-semibold`}
                        >
                          Order Summary
                        </Text>
                        <Text
                          style={{ color: invertTextColor }}
                          className={`text-lg font-base`}
                        >
                          Service:{" "}
                          {appointment?.service?.map(
                            (service, index) =>
                              (service?.service_name.length > 15
                                ? service?.service_name.slice(0, 15) + "..."
                                : service?.service_name) +
                              (index < appointment.service?.length - 1
                                ? ", "
                                : "")
                          )}
                        </Text>
                        <Text
                          style={{ color: invertTextColor }}
                          className={`text-lg font-base`}
                        >
                          Add Ons:
                          {appointment?.option
                            ?.filter((option) =>
                              option.service.some(
                                (serv) => serv._id === service._id
                              )
                            )
                            .map((optionData, optionIndex, array) => (
                              <Text key={optionIndex} style={{ marginLeft: 2 }}>
                                {optionData.option_name} - ₱{" "}
                                {optionData.extraFee}
                                {optionIndex !== array.length - 1 && ","}
                              </Text>
                            ))}
                          {appointment?.option?.filter((option) =>
                            option.service.some(
                              (serv) => serv._id === service._id
                            )
                          ).length === 0 && " None"}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View className={`items-center justify-center`}>
                  <Image
                    source={{ uri: data?.details?.qrCode }}
                    style={{ width: 150, height: 150 }}
                  />
                </View>

                <View className={`flex-row justify-between`}>
                  <Text
                    style={{ color: invertTextColor }}
                    className={`text-lg font-semibold`}
                  >
                    Total Price:
                  </Text>
                  <Text
                    style={{ color: invertTextColor }}
                    className={`text-lg font-semibold`}
                  >
                    ₱ {totalPrice}
                  </Text>
                </View>
                <View className={`flex-row justify-between`}>
                  <Text
                    style={{ color: invertTextColor }}
                    className={`text-lg font-semibold`}
                  >
                    Extra Fee
                  </Text>
                  <Text
                    style={{ color: invertTextColor }}
                    className={`text-lg font-semibold`}
                  >
                    ₱ {extraFeePrice}
                  </Text>
                </View>
                {appointment.hasAppointmentFee === true ? (
                  <View className={`flex-row justify-between`}>
                    <Text
                      style={{ color: invertTextColor }}
                      className={`text-lg font-semibold`}
                    >
                      Appointment Fee
                    </Text>
                    <Text
                      style={{ color: invertTextColor }}
                      className={`text-lg font-semibold`}
                    >
                      {Math.round(TotalFee * 0.3)}
                    </Text>
                  </View>
                ) : null}
                {hasDiscount && (
                  <View className={`flex-row justify-between`}>
                    <Text
                      style={{ color: invertTextColor }}
                      className={`text-lg font-semibold`}
                    >
                      Discount
                    </Text>
                    <Text
                      style={{ color: invertTextColor }}
                      className={`text-lg font-semibold`}
                    >
                      - ₱ {(TotalFee * 0.2).toFixed(0)}
                    </Text>
                  </View>
                )}
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: backgroundColor,
                  }}
                  className={`my-2`}
                />
                <View className={`flex-row justify-between pb-5`}>
                  <Text
                    style={{ color: invertTextColor }}
                    className={`text-lg font-semibold`}
                  >
                    Subtotal
                  </Text>
                  <Text
                    style={{ color: invertTextColor }}
                    className={`text-lg font-semibold`}
                  >
                    ₱{" "}
                    {appointment.hasAppointmentFee === true
                      ? (
                          TotalFee -
                          (hasDiscount ? TotalFee * 0.2 : 0) -
                          Math.round(TotalFee * 0.3)
                        ).toFixed(0)
                      : (TotalFee - (hasDiscount ? TotalFee * 0.2 : 0)).toFixed(
                          0
                        )}
                  </Text>
                </View>
                <View>
                  <Text
                    style={{ color: invertTextColor }}
                    className={`text-lg text-center font-semibold`}
                  >
                    Thank you for choosing us {auth?.user?.name}!
                  </Text>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </>
      )}
    </>
  );
}
