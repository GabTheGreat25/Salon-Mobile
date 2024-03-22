import React, { useEffect } from "react";
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
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { useGetTransactionsQuery } from "../../state/api/reducer";
import { useFormik } from "formik";
import { LoadingScreen } from "@components";
import { useIsFocused } from "@react-navigation/native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function () {
  const { backgroundColor, colorScheme } = changeColor();
  // const navigation = useNavigation();
  // const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const auth = useSelector((state) => state.auth.user);

  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#FDA7DF";
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

  const { data, isLoading, refetch } = useGetTransactionsQuery();
  const transactions = data?.details || [];

  useEffect(() => {
    const fetchData = async () => {
      if (isFocused) refetch();
    };
    fetchData();
  }, [isFocused]);

  const filteredTransactions = transactions.filter((transaction) => {
    const appointmentCustomerID = transaction.appointment?.customer?._id;
    const isPending = transaction?.status === "pending";
    return appointmentCustomerID === auth?._id && isPending;
  });

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
            <ScrollView
              showsVerticalScrollIndicator={false}
              decelerationRate="fast"
              scrollEventThrottle={1}
              style={{
                backgroundColor,
              }}
              className={`px-3 flex-1 mt-4`}
            >
              <ScrollView
                decelerationRate="fast"
                scrollEventThrottle={1}
                showsVerticalScrollIndicator={false}
              >
                {filteredTransactions.map((transaction) => (
                  <View
                    key={transaction?._id}
                    style={{
                      backgroundColor: invertBackgroundColor,
                      height: windowHeight * 0.26,
                      width: windowWidth * 0.925,
                    }}
                    className={`flex-row gap-x-4 rounded-2xl mx-1 px-4 pt-4 mb-2`}
                  >
                    <View className={`flex-col gap-y-2`}>
                      {transaction.appointment.service.map((service) =>
                        service.image.map(() => (
                          <Image
                            key={service.public_id}
                            source={{
                              uri: service.image[
                                Math.floor(Math.random() * service.image.length)
                              ].url,
                            }}
                            resizeMode="cover"
                            className={`h-[100px] w-[100px] rounded-full`}
                          />
                        ))
                      )}
                      <Text
                        style={{ color: invertTextColor }}
                        className={`text-center text-base font-semibold`}
                      >
                        {` ${
                          transaction?.appointment?.date
                            ? new Date(transaction.appointment.date)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }\n at ${
                          transaction?.appointment?.time?.length > 0
                            ? transaction.appointment.time.length === 1
                              ? `${transaction?.appointment?.time[0]}`
                              : `${transaction?.appointment?.time[0]} to\n ${
                                  transaction?.appointment?.time[
                                    transaction?.appointment?.time.length - 1
                                  ]
                                }`
                            : ""
                        }`}
                      </Text>
                    </View>
                    <View className={`flex-1 flex-col`}>
                      <View className={`flex-row`}>
                        <Text
                          style={{ color: invertTextColor }}
                          className={`text-center text-lg font-semibold capitalize`}
                        >
                          Status: {transaction.status}
                        </Text>
                        <View
                          className={`flex-1 flex-row justify-end items-start`}
                        >
                          <Text
                            style={{ color: invertTextColor }}
                            className={`text-center text-lg font-semibold`}
                          >
                            ₱{transaction?.appointment?.price.toFixed(0)}
                          </Text>
                        </View>
                      </View>
                      <View className={`pt-1`}>
                        <Text
                          style={{ color: invertTextColor }}
                          className={`text-lg font-semibold`}
                        >
                          Services:{" "}
                          {transaction?.appointment?.service?.map(
                            (service, index) =>
                              (service?.service_name.length > 15
                                ? service?.service_name.slice(0, 15) + "..."
                                : service?.service_name) +
                              (index <
                              transaction.appointment.service?.length - 1
                                ? ", "
                                : "")
                          )}
                        </Text>
                        <Text
                          style={{ color: invertTextColor }}
                          className={`text-lg font-semibold`}
                        >
                          AddOns:{" "}
                          {transaction?.appointment?.option?.length > 0
                            ? transaction.appointment.option.map(
                                (addon, index) => (
                                  <React.Fragment key={addon._id}>
                                    {addon.option_name.length > 15
                                      ? addon.option_name.slice(0, 15) + "..."
                                      : addon.option_name}
                                    {index <
                                    transaction.appointment.option.length - 1
                                      ? ", "
                                      : ""}
                                  </React.Fragment>
                                )
                              )
                            : "None"}
                        </Text>
                      </View>
                      <View className={`items-end justify-end mt-[22px]`}>
                        <TouchableOpacity
                          className={`px-4 py-2 rounded-lg bg-primary-accent`}
                        >
                          <Text
                            style={{ color: invertTextColor }}
                            className={`text-lg font-semibold`}
                          >
                            Reschedule
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </ScrollView>
          </SafeAreaView>
        </>
      )}
    </>
  );
}
