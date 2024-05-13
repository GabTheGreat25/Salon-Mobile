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
              To secure your appointment, a non-refundable reservation fee of
              30% from total price of your checkouts must be paid through Maya
              or in cash at the salon.
            </Text>

            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              Upon successful payment, you will recieve an sms notification
              regarding your successful appointment, which must be presented for
              verification.
            </Text>

            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              The reservation fee is non-refundable, even in the case of
              appointment cancellation. If you wish to reschedule your
              appointment, your original appointment must be scheduled at least
              3 days in advance. We allow one rescheduling without any
              additional charges. The new appointment date must be close to your
              previous appointment date; for example, rescheduling is allowed if
              the booked appointment is set within 3 days before your actual
              appointment.
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              If the reservation fee will be paid using Maya, it should be paid on the same day the appointment is made, if not, admin will delete the appointment, While if the reservation is cash, It must be completed 30 mins before your scheduled appointment time to avoid cancellation.
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              Every service provided by our salon comes with a warranty period
              in terms of hours and days, depending on the service. This
              warranty ensures the quality and satisfaction of the service you
              receive. The specific warranty period for each service will be
              included in their descriptions.
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              For online & walk-in appointments, please arrive at the salon at
              least 30 minutes before your scheduled appointment to ensure a
              smooth and timely experience. Walk-in appointments are accepted on
              a first-come, first-served basis without the requirement of a
              reservation fee. Appointments are subject to availability, and we
              cannot guarantee immediate service during peak hours.
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              In adherence to health and safety guidelines, all clients are
              required to wear masks during their salon visit. Please sanitize
              your hands upon entering the salon premises.
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              By booking an appointment with our salon, you agree to abide by
              these terms and conditions. We appreciate your cooperation and
              look forward to providing you with exceptional service.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
