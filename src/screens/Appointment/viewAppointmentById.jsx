import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  SafeAreaView,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
} from "react-native";
import { useGetAppointmentByIdQuery } from "../../state/api/reducer";
import { useNavigation } from "@react-navigation/native";
import { LoadingScreen } from "@components";
import { changeColor } from "@utils";
import { BackIcon } from "@helpers";
import { useIsFocused } from "@react-navigation/native";

export default function ({ route }) {
  const { id } = route.params;
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const { data, isLoading, refetch } = useGetAppointmentByIdQuery(id);

  const appointment = data?.details;

  useEffect(() => {
    const fetchData = async () => {
      if (isFocused) refetch();
    };
    fetchData();
  }, [isFocused]);

  const { backgroundColor, textColor, colorScheme } = changeColor();
  const borderColor =
    colorScheme === "dark" ? "border-neutral-light" : "border-neutral-dark";

  return (
    <>
      {isLoading ? (
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
                className={`px-6`}
              >
                <Text
                  style={{ color: textColor }}
                  className={`font-semibold text-center py-12 pb-6 text-3xl`}
                >
                  View Appointment Details
                </Text>
                <Text
                  style={{ color: textColor }}
                  className={`font-semibold text-base`}
                >
                  Customer Name:
                </Text>
                <TextInput
                  style={{ color: textColor }}
                  className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                  autoCapitalize="none"
                  value={appointment?.customer?.name}
                />

                <Text
                  style={{ color: textColor }}
                  className={`font-semibold text-base`}
                >
                  Employee Name:
                </Text>
                <TextInput
                  style={{ color: textColor }}
                  className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                  autoCapitalize="none"
                  value={appointment?.beautician
                    .map((beautician) => beautician?.name)
                    .join(", ")}
                />
                <Text
                  style={{ color: textColor }}
                  className={`font-semibold text-base`}
                >
                  Appointment Date:
                </Text>
                <TextInput
                  style={{ color: textColor }}
                  className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                  autoCapitalize="none"
                  value={
                    appointment?.date
                      ? new Date(appointment.date).toISOString().split("T")[0]
                      : ""
                  }
                />
                <Text
                  style={{ color: textColor }}
                  className={`font-semibold text-base`}
                >
                  Appointment Time:
                </Text>
                <TextInput
                  style={{ color: textColor }}
                  className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                  autoCapitalize="none"
                  value={
                    Array.isArray(appointment?.time) &&
                    appointment.time.length === 1
                      ? appointment?.time[0]
                      : `${appointment?.time?.[0]} to ${
                          appointment?.time?.[appointment?.time?.length - 1]
                        }`
                  }
                />
                <Text
                  style={{ color: textColor }}
                  className={`font-semibold text-base`}
                >
                  Appointment Services:
                </Text>
                <TextInput
                  style={{ color: textColor }}
                  className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                  autoCapitalize="none"
                  value={appointment?.service
                    .map((service) => service?.service_name)
                    .join(", ")}
                />
                <Text
                  style={{ color: textColor }}
                  className={`font-semibold text-base`}
                >
                  Appointment Options:
                </Text>
                <TextInput
                  style={{ color: textColor }}
                  className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                  autoCapitalize="none"
                  value={
                    appointment?.option
                      .map((option) => option?.option_name)
                      .join(", ") || "None"
                  }
                />
                <Text
                  style={{ color: textColor }}
                  className={`font-semibold text-base`}
                >
                  Appointment Price:
                </Text>
                <TextInput
                  style={{ color: textColor }}
                  className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                  autoCapitalize="none"
                  value={`₱${
                    appointment?.price ? appointment?.price.toString() : ""
                  }`}
                />
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      )}
    </>
  );
}
