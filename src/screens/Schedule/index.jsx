import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Modal,
} from "react-native";
import { changeColor } from "@utils";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { useGetTransactionsQuery } from "../../state/api/reducer";
import { useFormik } from "formik";
import { LoadingScreen } from "@components";
import { useIsFocused } from "@react-navigation/native";
import { rebookCustomerValidation } from "../../validation";
import { reasonSlice } from "../../state/editSchedule/reasonReducer";
import Toast from "react-native-toast-message";

const windowWidth = Dimensions.get("window").width;

export default function () {
  const { backgroundColor, textColor, colorScheme } = changeColor();
  const navigation = useNavigation();

  const reason = useSelector((state) => state.reason);

  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const auth = useSelector((state) => state.auth.user);

  const borderColor = colorScheme === "dark" ? "#e5e5e5" : "#212B36";
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

  const [modalVisible, setModalVisible] = useState(false);
  const [editedTransactionId, setEditedTransactionId] = useState(null);

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const formik = useFormik({
    initialValues: {
      rebookReason: "",
      messageReason: "",
    },
    validationSchema: rebookCustomerValidation,
    onSubmit: (values) => {
      dispatch(
        reasonSlice.actions.reasonForm({
          rebookReason: values.rebookReason,
          messageReason: values.messageReason,
        })
      );
      setSelectedRebookReason("");
      setModalVisible(false);
      navigation.navigate("EditSchedule", {
        id: editedTransactionId,
      });
    },
  });

  const [selectedRebookReason, setSelectedRebookReason] = useState(
    formik.values.rebookReason || ""
  );

  const radioOptions = [
    { label: "Schedule Conflict", value: "Schedule Conflict" },
    { label: "Change Of Plans", value: "Change Of Plans" },
    { label: "Emergency", value: "Emergency" },
    { label: "Travel Conflict", value: "Travel Conflict" },
    { label: "Personal Reasons", value: "Personal Reasons" },
    { label: "Others", value: "Others" },
  ];

  const handleRadioOptions = (option) => {
    formik.setFieldValue("rebookReason", option.value);
    setSelectedRebookReason(option.value);
  };

  const handleReason = (transactionId) => {
    const today = new Date();
    today.setDate(today.getDate() + 1);

    const selectedTransaction = transactions.find(
      (transaction) => transaction.appointment?._id === transactionId
    );

    const appointmentDate = new Date(selectedTransaction?.appointment?.date);
    const rescheduleDate = new Date(today);
    rescheduleDate.setDate(today.getDate() + 3);

    const formattedAppointmentDate = appointmentDate
      .toISOString()
      .split("T")[0];
    const formattedRescheduleDate = rescheduleDate.toISOString().split("T")[0];

    if (formattedAppointmentDate >= formattedRescheduleDate) {
      setEditedTransactionId(transactionId);
      setModalVisible(true);
    } else
      Toast.show({
        type: "error",
        position: "top",
        text1: "Warning",
        text2: `You cannot reschedule within the next 3 days.`,
        visibilityTime: 3000,
        autoHide: true,
      });
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
                      <View className={`items-end justify-end mt-[22px]`}>
                        <TouchableOpacity
                          onPress={() => {
                            if (
                              transaction?.appointment?.isRescheduled === true
                            ) {
                              Toast.show({
                                type: "error",
                                position: "top",
                                text1: "Warning",
                                text2: `You cannot reschedule because you already edited the appointment.`,
                                visibilityTime: 3000,
                                autoHide: true,
                              });
                            } else {
                              handleReason(transaction?.appointment?._id);
                            }
                          }}
                          className={`px-4 py-2 rounded-lg  ${
                            transaction?.appointment?.hasAppointmentFee === true
                              ? "bg-primary-accent"
                              : ""
                          }`}
                        >
                          <Text
                            style={{ color: invertTextColor }}
                            className={`text-lg font-semibold`}
                          >
                            {transaction?.appointment?.hasAppointmentFee ===
                            true ? (
                              <Text
                                style={{ color: invertTextColor }}
                                className={`text-lg font-semibold`}
                              >
                                {transaction?.appointment?.isRescheduled ===
                                true
                                  ? "Already Rescheduled"
                                  : "Reschedule"}
                              </Text>
                            ) : (
                              ""
                            )}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
            <View>
              {modalVisible && (
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={handleCloseModal}
                >
                  <View
                    style={{
                      backgroundColor: "rgba(0,0,0,0.6)",
                    }}
                    className={`items-center justify-center flex-1`}
                  >
                    <View
                      style={{
                        backgroundColor,
                        width: "80%",
                      }}
                      className={`p-4 rounded-lg`}
                    >
                      <Text
                        style={{ color: textColor }}
                        className={`text-2xl text-center font-semibold pb-4`}
                      >
                        Reason for Rescheduling
                      </Text>
                      <View className={`flex-col flex-wrap gap-x-1`}>
                        {radioOptions.map((option) => (
                          <TouchableOpacity
                            key={option.value}
                            className={`flex-row pl-2 py-2 items-center`}
                            onPress={() => {
                              handleRadioOptions(option);
                            }}
                          >
                            <View
                              style={{
                                height: 25,
                                width: 25,
                                borderWidth: 2,
                                borderColor:
                                  formik.values.rebookReason === option.value
                                    ? invertBackgroundColor
                                    : backgroundColor,
                                backgroundColor:
                                  formik.values.rebookReason === option.value
                                    ? backgroundColor
                                    : invertBackgroundColor,
                              }}
                              className={`rounded-full`}
                            >
                              {selectedRebookReason === option.value && (
                                <View
                                  style={{
                                    height: 12,
                                    width: 12,
                                    backgroundColor: textColor,
                                    alignSelf: "center",
                                    justifySelf: "center",
                                    marginTop: 4,
                                  }}
                                  className={`rounded-full`}
                                />
                              )}
                            </View>
                            <View
                              className={`flex-row justify-center items-center`}
                            >
                              <View className={`pl-2`}>
                                <Text
                                  style={{ color: textColor }}
                                  className={`text-xl font-semibold`}
                                >
                                  {option.label}
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        ))}
                        {formik.touched.rebookReason &&
                          formik.errors.rebookReason && (
                            <Text style={{ color: "red" }}>
                              {formik.errors.rebookReason}
                            </Text>
                          )}
                      </View>
                      <Text
                        style={{ color: textColor }}
                        className={`font-semibold text-xl`}
                      >
                        Reason for Rescheduling
                      </Text>
                      <TextInput
                        style={{
                          color: textColor,
                          height: 100,
                          textAlignVertical: "top",
                        }}
                        className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-lg my-2 ${borderColor}`}
                        placeholder="Tell us about yourself..."
                        placeholderTextColor={textColor}
                        autoCapitalize="none"
                        multiline={true}
                        onChangeText={formik.handleChange("messageReason")}
                        onBlur={formik.handleBlur("messageReason")}
                        value={formik.values.messageReason}
                      />
                      {formik.touched.messageReason &&
                        formik.errors.messageReason && (
                          <Text style={{ color: "red" }}>
                            {formik.errors.messageReason}
                          </Text>
                        )}
                      <View
                        className={`flex-row gap-x-3 items-center justify-center pt-4`}
                      >
                        <TouchableOpacity
                          onPress={formik.handleSubmit}
                          disabled={!formik.isValid}
                        >
                          <View
                            className={`py-2 rounded-lg bg-primary-accent px-6
                          } ${!formik.isValid ? "opacity-50" : "opacity-100"}`}
                          >
                            <Text
                              className={`font-semibold text-center text-lg`}
                              style={{ color: textColor }}
                            >
                              Submit
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={handleCloseModal}
                          className={`bg-primary-accent rounded-lg`}
                        >
                          <Text
                            style={{ color: textColor }}
                            className={`text-lg font-semibold py-2 px-7`}
                          >
                            Close
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>
              )}
            </View>
          </SafeAreaView>
        </>
      )}
    </>
  );
}
