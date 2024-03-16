import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
} from "react-native";
import {
  useUpdateTransactionMutation,
  useGetTransactionByIdQuery,
  useMayaCheckoutMutation,
} from "../../state/api/reducer";
import { useFormik } from "formik";
import { editTransactionValidation } from "../../validation";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { LoadingScreen } from "@components";
import { changeColor } from "@utils";
import { Picker } from "@react-native-picker/picker";
import { BackIcon } from "@helpers";
import { useIsFocused } from "@react-navigation/native";

export default function ({ route }) {
  const { id } = route.params;
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const {
    data,
    isLoading: isTransactionLoading,
    refetch,
  } = useGetTransactionByIdQuery(id);
  const transactions = data?.details;
  const [mayaCheckout] = useMayaCheckoutMutation();

  useEffect(() => {
    const fetchData = async () => {
      if (isFocused) refetch();
    };
    fetchData();
  }, [isFocused]);

  const [updateTransaction, { isLoading }] = useUpdateTransactionMutation();

  const { backgroundColor, textColor, colorScheme } = changeColor();
  const borderColor =
    colorScheme === "dark" ? "border-neutral-light" : "border-neutral-dark";

  const [isOpen, setOpen] = useState(transactions?.hasDiscount || false);
  const [status, setStatus] = useState(transactions?.status || "pending");

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      status: status,
      hasDiscount: transactions?.hasDiscount || isOpen,
      isApproved: true,
    },
    validationSchema: editTransactionValidation,
    onSubmit: (values) => {
      updateTransaction({ id: transactions?._id, payload: values })
        .unwrap()
        .then((response) => {
          refetch();
          Toast.show({
            type: "success",
            position: "top",
            text1: "Transaction Details Successfully Updated",
            text2: `${response?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
          navigation.navigate("Transaction");
          if (
            values.status === "completed" &&
            transactions.payment === "Maya"
          ) {
            mayaFormik.handleSubmit();
          }
        })
        .catch((error) => {
          console.log(error?.data?.error?.message);
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Updating Transaction Details",
            text2: `${error?.data?.error?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
        });
    },
  });

  const mayaFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      discount: isOpen
        ? Number((transactions?.appointment?.price * 0.2).toFixed(0))
        : 0,
      contactNumber: transactions?.appointment?.customer?.contact_number,
      name: transactions?.appointment?.customer?.name,
      items: transactions?.appointment?.service?.map((service) => ({
        name: service?.service_name,
        description: service?.description,
        totalAmount: {
          value:
            service?.price +
            (transactions?.appointment?.option?.find((option) =>
              option?.service?.some((serv) => serv._id === service?._id)
            )?.extraFee || 0) -
            (transactions?.appointment?.hasAppointmentFee === true ? 150 : 0),
        },
      })),
    },
    onSubmit: async (values) => {
      mayaCheckout(values)
        .unwrap()
        .then((response) => {
          Toast.show({
            type: "success",
            position: "top",
            text1: "Maya Details Successfully Sent to Customer",
            text2: `${response?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Updating Transaction Details",
            text2: `${error?.data?.error?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
        });
    },
  });

  const handleCheckBoxToggle = () => {
    const newValue = !isOpen;
    setOpen(newValue);
    formik.setFieldValue("hasDiscount", newValue);
  };

  return (
    <>
      {isLoading || isTransactionLoading ? (
        <View
          className={`flex-1 justify-center items-center bg-primary-default`}
        >
          <LoadingScreen />
        </View>
      ) : (
        <>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView
              style={{ backgroundColor }}
              className={`relative flex-1 pt-12`}
            >
              <BackIcon
                navigateBack={navigation.goBack}
                textColor={textColor}
              />
              <KeyboardAvoidingView behavior="height">
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  decelerationRate="fast"
                  scrollEventThrottle={1}
                  className={`px-6 `}
                >
                  <Text
                    style={{ color: textColor }}
                    className={`pb-6 font-semibold text-center text-3xl`}
                  >
                    Edit Transaction Details
                  </Text>

                  {transactions?.image?.length > 0 && (
                    <View className={`items-center justify-end`}>
                      <Image
                        key={
                          transactions?.image[
                            Math.floor(
                              Math.random() * transactions?.image?.length
                            )
                          ]?.public_id
                        }
                        source={{
                          uri: transactions?.image[
                            Math.floor(
                              Math.random() * transactions?.image?.length
                            )
                          ]?.url,
                        }}
                        className={`rounded-full w-60 h-60`}
                        resizeMode="cover"
                      />
                    </View>
                  )}

                  {transactions?.image?.length > 0 && (
                    <View className={`flex flex-row`}>
                      <TouchableOpacity
                        onPress={() => handleCheckBoxToggle()}
                        className={`flex-row py-2`}
                      >
                        <View
                          style={{
                            height: 35,
                            width: 35,
                            borderColor: textColor,
                            backgroundColor: backgroundColor,
                          }}
                          className={`flex-row justify-center items-center border-2 rounded mr-3`}
                        >
                          {isOpen && (
                            <Text
                              style={{ color: textColor }}
                              className={`text-2xl`}
                            >
                              ✓
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                      <View className={`pt-2 pb-6`}>
                        <Text
                          style={{ color: textColor }}
                          className={`text-2xl font-semibold`}
                        >
                          Valid for Discount
                        </Text>
                      </View>
                    </View>
                  )}

                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Status
                  </Text>
                  <View
                    className={`border-[1.5px]  font-normal rounded-full my-3 ${borderColor}`}
                  >
                    <Picker
                      selectedValue={formik.values.status}
                      style={{ color: textColor }}
                      dropdownIconColor={textColor}
                      onValueChange={(itemValue) => {
                        setStatus(itemValue);
                      }}
                    >
                      <Picker.Item label="pending" value="pending" />
                      <Picker.Item label="completed" value="completed" />
                    </Picker>
                  </View>
                  {formik.touched.status && formik.errors.status && (
                    <Text style={{ color: "red" }}>{formik.errors.status}</Text>
                  )}

                  <View className={`mt-4 items-center justify-center flex-col`}>
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
            </SafeAreaView>
          </TouchableWithoutFeedback>
        </>
      )}
    </>
  );
}
