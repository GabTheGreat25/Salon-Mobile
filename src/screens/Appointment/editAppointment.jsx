import React, { useState, useEffect } from "react";
import {
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
  useUpdateAppointmentMutation,
  useGetAppointmentByIdQuery,
  useGetServicesQuery,
  useGetOptionsQuery,
} from "../../state/api/reducer";
import { useFormik } from "formik";
import { editAppointmentValidation } from "../../validation";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { LoadingScreen } from "@components";
import { changeColor } from "@utils";
import { BackIcon } from "@helpers";

export default function ({ route }) {
  const { id } = route.params;
  const navigation = useNavigation();

  const {
    data,
    isLoading: isAppointmentLoading,
    refetch,
  } = useGetAppointmentByIdQuery(id);
  const [updateAppointment, { isLoading }] = useUpdateAppointmentMutation();
  const { data: services, isLoading: servicesLoading } = useGetServicesQuery();
  const { data: optionsData } = useGetOptionsQuery();
  const options = optionsData?.details;

  const { backgroundColor, textColor, colorScheme } = changeColor();
  const borderColor =
    colorScheme === "dark" ? "border-neutral-light" : "border-neutral-dark";

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      price: data?.details?.price || 0,
      service: data?.details?.service?.map((service) => service._id) || [],
      options: data?.details?.option || [],
    },
    validationSchema: editAppointmentValidation,
    onSubmit: (values) => {
      updateAppointment({
        id: data?.details?._id,
        payload: {
          ...values,
          option: values.options,
        },
      })
        .unwrap()
        .then((response) => {
          refetch();
          Toast.show({
            type: "success",
            position: "top",
            text1: "Appointment Details Successfully Updated",
            text2: `${response?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
          navigation.navigate("Appointment");
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Updating Appointment Details",
            text2: `${error?.data?.error?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
        });
    },
  });

  const handleServicePress = (serviceId) => {
    if (!areOptionsEmpty(serviceId)) {
      return;
    }

    if (formik.values.service.includes(serviceId)) {
      formik.setFieldValue(
        "service",
        formik.values.service.filter((id) => id !== serviceId)
      );
    } else {
      formik.setFieldValue("service", [...formik.values.service, serviceId]);
    }
  };

  const handleOptionPress = (optionId) => {
    if (formik.values.options.includes(optionId)) {
      formik.setFieldValue(
        "options",
        formik.values.options.filter((id) => id !== optionId)
      );
    } else {
      formik.setFieldValue("options", [...formik.values.options, optionId]);
    }
  };

  const areOptionsEmpty = (serviceId) => {
    const service = services?.details?.find(
      (service) => service._id === serviceId
    );

    if (!service) return true;

    const serviceOptions = options?.filter((option) =>
      option.service.some((s) => s._id === serviceId)
    );

    return (
      serviceOptions?.length === 0 ||
      serviceOptions?.every(
        (option) => !formik.values.options.includes(option._id)
      )
    );
  };

  useEffect(() => {
    const selectedServicesPrices = formik.values.service.reduce(
      (sum, serviceId) => {
        const selectedService = services?.details?.find(
          (service) => service._id === serviceId
        );
        return sum + (selectedService ? selectedService.price : 0);
      },
      0
    );

    const selectedOptionFees = formik.values.options.reduce((sum, optionId) => {
      const selectedOption = options?.find((option) => option._id === optionId);
      return sum + (selectedOption ? selectedOption.extraFee : 0);
    }, 0);

    const newTotalPrice = selectedServicesPrices + selectedOptionFees;
    formik.setFieldValue("price", newTotalPrice);
  }, [formik.values.service, formik.values.options]);

  return (
    <>
      {isLoading || isAppointmentLoading || servicesLoading ? (
        <View
          className={`flex-1 justify-center items-center bg-primary-default`}
        >
          <LoadingScreen />
        </View>
      ) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView
            style={{ backgroundColor }}
            className={`relative flex-1`}
          >
            <BackIcon navigateBack={navigation.goBack} textColor={textColor} />
            <KeyboardAvoidingView behavior="height">
              <ScrollView
                showsVerticalScrollIndicator={false}
                decelerationRate="fast"
                scrollEventThrottle={1}
                className={`pt-10 px-6`}
              >
                <Text
                  style={{ color: textColor }}
                  className={`font-semibold text-center pt-6 text-3xl`}
                >
                  Update Appointment Details
                </Text>
                <Text
                  style={{ color: textColor }}
                  className={`font-semibold text-base`}
                >
                  Price
                </Text>
                <TextInput
                  style={{ color: textColor }}
                  className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                  placeholder="Enter the price"
                  placeholderTextColor={textColor}
                  keyboardType="numeric"
                  onChangeText={(value) =>
                    formik.handleChange("price")(value.toString())
                  }
                  onBlur={formik.handleBlur("price")}
                  value={formik.values.price.toFixed(0).toString()}
                />
                {formik.touched.price && formik.errors.price && (
                  <Text style={{ color: "red" }}>{formik.errors.price}</Text>
                )}

                <Text
                  style={{ color: textColor }}
                  className="text-2xl font-semibold"
                >
                  Services
                </Text>
                <View className="flex flex-row flex-wrap justify-start gap-x-4">
                  {services?.details?.map((service) => (
                    <TouchableOpacity
                      key={service._id}
                      onPress={() => handleServicePress(service._id)}
                      disabled={!areOptionsEmpty(service._id)}
                      className="flex-row py-2 gap-x-2"
                    >
                      <View
                        style={{
                          height: 30,
                          width: 30,
                          borderColor: textColor,
                          backgroundColor: backgroundColor,
                        }}
                        className="flex-row items-center justify-center border-2 rounded"
                      >
                        {formik.values.service.includes(service._id) ? (
                          <Text
                            style={{ color: textColor }}
                            className="text-lg"
                          >
                            ✓
                          </Text>
                        ) : null}
                      </View>
                      <View>
                        <Text
                          style={{ color: textColor }}
                          className="text-lg font-semibold"
                        >
                          {service.service_name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>

                <View className="flex flex-row flex-wrap justify-start gap-x-2">
                  {formik.values.service?.map((selectedServiceId) => {
                    const selectedService = services?.details?.find(
                      (service) => service._id === selectedServiceId
                    );

                    if (!selectedService) return null;

                    const serviceOptions = options?.filter((option) =>
                      option.service.some((s) => s._id === selectedServiceId)
                    );

                    return (
                      <View key={selectedService._id}>
                        <Text className="my-2 text-lg font-semibold text-light-default dark:text-dark-default">
                          Add Ons for {selectedService.service_name}
                        </Text>
                        {serviceOptions?.map((option) => (
                          <TouchableOpacity
                            key={option._id}
                            onPress={() => handleOptionPress(option._id)}
                            className="flex-row items-center mb-2"
                          >
                            <View
                              style={{
                                height: 30,
                                width: 30,
                                borderColor: textColor,
                                backgroundColor: backgroundColor,
                              }}
                              className="flex-row items-center justify-center border-2 rounded"
                            >
                              {formik.values.options.includes(option._id) ? (
                                <Text
                                  style={{ color: textColor }}
                                  className="text-lg"
                                >
                                  ✓
                                </Text>
                              ) : null}
                            </View>
                            <View className="flex items-center pl-2">
                              <Text
                                style={{ color: textColor }}
                                className="text-lg font-semibold"
                              >
                                {option.option_name} - ₱{option.extraFee}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </View>
                    );
                  })}
                </View>

                <View className={`mb-20 items-center justify-center flex-col`}>
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
      )}
    </>
  );
}
