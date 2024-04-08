import React, { useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Alert,
} from "react-native";
import { changeColor } from "@utils";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import {
  useGetTransactionsQuery,
  useGetCommentsQuery,
} from "../../state/api/reducer";
import { LoadingScreen } from "@components";
import { useIsFocused } from "@react-navigation/native";

const windowWidth = Dimensions.get("window").width;

export default function () {
  const { backgroundColor, colorScheme } = changeColor();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const auth = useSelector((state) => state.auth.user);

  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#FFB6C1";
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

  const { data, isLoading, refetch } = useGetTransactionsQuery();
  const transactions = data?.details || [];

  const {
    data: commentsData,
    isLoading: commentsLoading,
    refetch: commentRefetch,
  } = useGetCommentsQuery();
  const comments = commentsData?.details || [];

  useEffect(() => {
    const fetchData = async () => {
      if (isFocused) {
        await Promise.all([refetch(), commentRefetch()]);
      }
    };
    fetchData();
  }, [isFocused]);

  const filteredTransactions = transactions.filter((transaction) => {
    const appointmentCustomerID = transaction.appointment?.customer?._id;
    const isCompletedOrCancelled =
      transaction?.status === "completed" ||
      transaction?.status === "cancelled";

    return appointmentCustomerID === auth?._id && isCompletedOrCancelled;
  });

  const comment = (transactionId) => {
    const transactionComments = comments?.filter(
      (comment) => comment.transaction._id === transactionId.toString()
    );
    if (transactionComments && transactionComments.length > 0) {
      Alert.alert("Warning", "This transaction already has a comment.");
    } else {
      navigation.navigate("CreateComment", {
        transactionId: transactionId.toString(),
      });
    }
  };

  const handleReceipt = (id) => {
    navigation.navigate("ReceiptHistory", { id });
  };

  return (
    <>
      {isLoading || commentsLoading ? (
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
              className={`px-3 flex-1 my-4`}
            >
              {filteredTransactions.map((transaction) => (
                <View
                  key={transaction?._id}
                  style={{
                    backgroundColor: invertBackgroundColor,
                    width: windowWidth * 0.925,
                  }}
                  className={`rounded-lg p-4 my-4`}
                >
                  <View className={`flex-row gap-x-4`}>
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
                      <View
                        className={`mt-6 items-end justify-end gap-x-3 flex-row`}
                      >
                        <TouchableOpacity
                          onPress={() => comment(transaction?._id)}
                          className={`px-6 py-2 rounded-lg bg-primary-accent`}
                        >
                          <Text
                            style={{ color: invertTextColor }}
                            className={`text-lg font-semibold`}
                          >
                            Rate
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleReceipt(transaction?._id)}
                          className={`px-4 py-2 rounded-lg bg-secondary-accent`}
                        >
                          <Text
                            style={{ color: invertTextColor }}
                            className={`text-lg font-semibold`}
                          >
                            Receipt
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </SafeAreaView>
        </>
      )}
    </>
  );
}
