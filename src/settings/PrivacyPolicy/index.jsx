import { SafeAreaView, Text, ScrollView, View } from "react-native";
import { changeColor } from "@utils";
import { useNavigation } from "@react-navigation/native";
import { BackIcon } from "@helpers";

export default function () {
  const navigation = useNavigation();

  const { textColor, backgroundColor, colorScheme } = changeColor();

  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#FFB6C1";
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

  return (
    <>
      <SafeAreaView style={{ backgroundColor }} className={`flex-1`}>
        <BackIcon navigateBack={navigation.goBack} textColor={textColor} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          decelerationRate="fast"
          scrollEventThrottle={1}
          className={`mt-12`}
          style={{
            backgroundColor,
          }}
        >
          <View
            className={`justify-center rounded-lg m-6 p-4`}
            style={{
              backgroundColor: invertBackgroundColor,
            }}
          >
            <Text
              className={`text-3xl font-semibold text-center py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              Privacy Policy
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              When you register and use the Lhanlee Beauty Lounge
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              Appointment/Management System, we collect personal information
              such as your name, contact details, and other relevant details
              necessary for appointment scheduling.
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              For users choosing to pay through GCash, we may collect payment
              details, including transaction information.
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              For cash payments at the salon, we may record the transaction
              details.
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              We use the collected information to facilitate appointment
              scheduling, generate QR codes, and verify appointments at the
              salon.
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              We retain customer information for the duration necessary for the
              purpose for which it was collected and in compliance with legal
              obligations.
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              Payment information is used solely for processing reservation fees
              and related transactions.
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              We may use your contact information to send appointment
              confirmations, reminders, and other essential communications
              related to your appointments.
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              We implement industry-standard security measures to protect
              customer information from unauthorized access, disclosure,
              alteration, and destruction.
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              The reservation fee is non-refundable, and no customer information
              is retained for refund purposes.
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              We retain customer information for the duration necessary for the
              purpose for which it was collected and in compliance with legal
              obligations.
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              We may update this Privacy Policy as needed. Users will be
              notified of any significant changes, and continued use of the
              system constitutes acceptance of the updated policy.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
