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
  const borderColor = colorScheme === "dark" ? "#e5e5e5" : "#212B36";

  const datePart = appointment?.date
    ? new Date(appointment?.date).toISOString().split("T")[0]
    : "";
  const appointmentDate = `${datePart}`;

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
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView
              style={{ backgroundColor }}
              className={`relative flex-1`}
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
                  className={`px-6`}
                >
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-center pt-12 pb-6 text-3xl`}
                  >
                    Reschedule Appointment Details
                  </Text>
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Customer's Name
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
                    Appointment Date
                  </Text>
                  <TextInput
                    style={{ color: textColor }}
                    className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                    autoCapitalize="none"
                    value={appointmentDate}
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
                    Rebook Reason
                  </Text>
                  <TextInput
                    style={{
                      color: textColor,
                      height: 100,
                      textAlignVertical: "top",
                    }}
                    className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-lg my-2 ${borderColor}`}
                    multiline={true}
                    value={appointment?.rebookReason}
                  />
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Customer's Message
                  </Text>
                  <TextInput
                    style={{
                      color: textColor,
                      height: 100,
                      textAlignVertical: "top",
                    }}
                    className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-lg my-2 ${borderColor}`}
                    multiline={true}
                    value={appointment?.messageReason}
                  />
                </ScrollView>
              </KeyboardAvoidingView>
            </SafeAreaView>
          </TouchableWithoutFeedback>
        </>
      )}
    </>
  );
}
