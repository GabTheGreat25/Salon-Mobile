import { View, Text, ScrollView, SafeAreaView } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { changeColor } from "@utils";

export default function () {
  const { textColor, backgroundColor, shadowColor, colorScheme } =
    changeColor();

  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#FDA7DF";
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

  return (
    <>
      <ScrollView
        className={`flex-1`}
        style={{
          backgroundColor,
        }}
      >
        <SafeAreaView className={`flex-row items-center p-1.5`}>
          <FontAwesome5 name="less-than" size={24} color={textColor} />
          <Text
            className={`m-1.5 text-xl`}
            style={{
              color: textColor,
            }}
          >
            Privacy Policy
          </Text>
        </SafeAreaView>
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
            When you register and use the Lhanlee Beauty Lounge
            Appointment/Management System, we collect personal information such
            as your name, contact details, and other relevant details necessary
            for appointment scheduling.
          </Text>
          <Text
            className={`text-lg font-semibold text-center`}
            style={{
              color: invertTextColor,
            }}
          >
            For users choosing to pay through GCash, we may collect payment
            details, including transaction information.
          </Text>
          <Text
            className={`text-lg font-semibold text-center`}
            style={{
              color: invertTextColor,
            }}
          >
            For cash payments at the salon, we may record the transaction
            details
          </Text>
          <Text
            className={`text-lg font-semibold text-center`}
            style={{
              color: invertTextColor,
            }}
          >
            We use the collected information to facilitate appointment
            scheduling, generate QR codes, and verify appointments at the salon.
          </Text>
          <Text
            className={`text-lg font-semibold text-center`}
            style={{
              color: invertTextColor,
            }}
          >
            We retain customer information for the duration necessary for the
            purpose for which it was collected and in compliance with legal
            obligations.
          </Text>
          <Text
            className={`text-lg font-semibold text-center`}
            style={{
              color: invertTextColor,
            }}
          >
            Payment information is used solely for processing reservation fees
            and related transactions.
          </Text>
          <Text
            className={`text-lg font-semibold text-center`}
            style={{
              color: invertTextColor,
            }}
          >
            We may use your contact information to send appointment
            confirmations, reminders, and other essential communications related
            to your appointments.
          </Text>
          <Text
            className={`text-lg font-semibold text-center`}
            style={{
              color: invertTextColor,
            }}
          >
            We implement industry-standard security measures to protect customer
            information from unauthorized access, disclosure, alteration, and
            destruction.
          </Text>
          <Text
            className={`text-lg font-semibold text-center`}
            style={{
              color: invertTextColor,
            }}
          >
            {" "}
            The reservation fee is non-refundable, and no customer information
            is retained for refund purposes
          </Text>
          <Text
            className={`text-lg font-semibold text-center`}
            style={{
              color: invertTextColor,
            }}
          >
            {" "}
            We retain customer information for the duration necessary for the
            purpose for which it was collected and in compliance with legal
            obligations.
          </Text>
          <Text
            className={`text-lg font-semibold text-center`}
            style={{
              color: invertTextColor,
            }}
          >
            {" "}
            We may update this Privacy Policy as needed. Users will be notified
            of any significant changes, and continued use of the system
            constitutes acceptance of the updated policy.
          </Text>
        </View>
      </ScrollView>
    </>
  );
}
