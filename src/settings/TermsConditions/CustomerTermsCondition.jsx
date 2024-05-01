import { View, Text, ScrollView, SafeAreaView } from "react-native";
import { BackIcon } from "@helpers";
import { changeColor } from "@utils";
import { useNavigation } from "@react-navigation/native";

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
              Terms And Conditions
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              By registering as a customer, you agree to the following terms:
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
             To secure your appointment, a non-refundable reservation fee of 30% from total price of your checkouts must be paid through Maya, other online banks by scanning the QR code, or in cash at the salon.

            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              Ensure the payment of the reservation fee is completed at least
              one hour before your scheduled appointment time to avoid
              cancellation.
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              The reservation fee is non-refundable, even in the case of
              appointment cancellation, though you may reschedule based on
              availability.
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              Please adhere to salon policies during your appointment, as
              failure to comply may result in termination without refund. These
              terms may be modified, and continued use of the system constitutes
              acceptance of updated terms.
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              By Agreeing the Terms & Condition of Lhanlee Beauty Lounge, you
              confirm that you have read and agree to the Salon Appointment
              Terms and Conditions and understand the non-refundable nature of
              the reservation fee.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
