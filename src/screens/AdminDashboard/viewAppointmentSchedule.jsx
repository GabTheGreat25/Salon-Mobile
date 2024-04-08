import React, { useEffect } from "react";
import {
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

  const { backgroundColor, textColor, borderColor } = changeColor();

  const datePart = appointment?.date
    ? new Date(appointment.date).toISOString().split("T")[0]
    : "";
  const value = `${datePart}`;

  const serviceValue = Array.isArray(appointment?.service)
    ? appointment?.service.map((service) => service?.service_name).join(", ")
    : appointment?.service?.service_name;

  const serviceType = Array.isArray(appointment?.service)
    ? appointment?.service.map((service) => service?.type).join(", ")
    : appointment?.service?.type;

  const appointmentBeautician = Array.isArray(appointment?.beautician)
    ? appointment?.beautician.map((beautician) => beautician?.name).join(", ")
    : appointment?.beautician?.name;

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
                    Schedule's Information
                  </Text>
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Appointment Beautician
                  </Text>
                  <TextInput
                    style={{ color: textColor, borderColor }}
                    placeholderTextColor={textColor}
                    className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2`}
                    autoCapitalize="none"
                    value={appointmentBeautician}
                  />
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Customer's Name
                  </Text>
                  <TextInput
                    style={{ color: textColor, borderColor }}
                    placeholderTextColor={textColor}
                    className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2`}
                    autoCapitalize="none"
                    value={appointment?.customer?.name}
                  />
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Appointment Day
                  </Text>
                  <TextInput
                    style={{ color: textColor, borderColor }}
                    placeholderTextColor={textColor}
                    className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2`}
                    autoCapitalize="none"
                    value={value}
                  />

                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Appointment Price
                  </Text>
                  <TextInput
                    style={{ color: textColor, borderColor }}
                    placeholderTextColor={textColor}
                    className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2`}
                    autoCapitalize="none"
                    value={`₱${
                      appointment?.price ? appointment.price.toString() : ""
                    }`}
                  />
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Service Name
                  </Text>
                  <TextInput
                    style={{ color: textColor, borderColor }}
                    placeholderTextColor={textColor}
                    className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2`}
                    autoCapitalize="none"
                    value={serviceValue}
                  />

                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Service Type
                  </Text>
                  <TextInput
                    style={{ color: textColor, borderColor }}
                    placeholderTextColor={textColor}
                    className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2`}
                    autoCapitalize="none"
                    value={serviceType}
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
