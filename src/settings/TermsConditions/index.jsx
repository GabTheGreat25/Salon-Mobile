import { View, Text, ScrollView } from "react-native";

import {
  Feather,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";

import { changeColor, dimensionLayout } from "@utils";

export default function () {
  const { textColor, backgroundColor, shadowColor, colorScheme } =
    changeColor();

  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#FDA7DF";
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

  return (
    <ScrollView
      className={`flex-1`}
      style={{
        backgroundColor,
      }}
    >
      <View className={`flex-row items-center p-1.5`}>
        <FontAwesome5 name="less-than" size={24} color={textColor} />
        <Text
          className={`m-1.5 text-xl`}
          style={{
            color: textColor,
          }}
        >
          Terms & Conditions
        </Text>
      </View>
      <View
        className={`justify-center rounded-md bg-white m-8 p-4`}
        style={{
          backgroundColor: invertBackgroundColor,
        }}
      >
        <Text
          className={`text-lg font-semibold text-center`}
          style={{
            color: invertTextColor,
          }}
        >
          To secure your appointment, a non-refundable reservation fee of 150
          pesos must be paid through Maya or in cash at the salon. Upon
          successful payment, you will receive a unique QR code containing your
          appointment details, which must be presented for verification.
        </Text>
        <Text
          className={`text-lg font-semibold text-center`}
          style={{
            color: invertTextColor,
          }}
        >
          Ensure the payment of the reservation fee is completed at least one
          hour before your scheduled appointment time to avoid cancellation.
        </Text>
        <Text
          className={`text-lg font-semibold text-center`}
          style={{
            color: invertTextColor,
          }}
        >
          The reservation fee is non-refundable, even in the case of appointment
          cancellation, though you may reschedule based on availability.
        </Text>
        <Text
          className={`text-lg font-semibold text-center`}
          style={{
            color: invertTextColor,
          }}
        >
          Please adhere to salon policies during your appointment, as failure to
          comply may result in termination without refund. These terms may be
          modified, and continued use of the system constitutes acceptance of
          updated terms.
        </Text>
        <Text
          className={`text-lg font-semibold text-center`}
          style={{
            color: invertTextColor,
          }}
        >
          By Agreeing the Terms & Condition of Lhanlee Beauty Lounge, you
          confirm that you have read and agree to the Salon Appointment Terms
          and Conditions and understand the non-refundable nature of the
          reservation fee.
        </Text>
      </View>
    </ScrollView>
  );
}
