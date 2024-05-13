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
              Beautician Terms And Conditions
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              By registering as a beautician, you agree to the following
              terms:
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              To initiate the process, you must complete the registration on our
              website, providing accurate and up-to-date information.After
              Registration , It is your responsibility to be physically present
              at the salon for the scheduled meeting on the selected day and
              failure to attend may result in the rejection of your hiring
              process.
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              Following the face-to-face meeting, the salon owner will review
              your application within 24 hours. If accepted, you will be
              notified via SMS, and you can proceed with the hiring process.
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              The availability of dates for face-to-face meetings is not
              guaranteed and may be subject to rescheduling or cancellation by
              the salon owner. The salon reserves the right to terminate the
              registration and hiring process at any stage if inaccurate
              information is provided or if there is a violation of salon
              policies, with termination occurring without notice.
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              Completion of the registration process confirms that you have read
              and agreed to these terms and conditions.
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              The salon also reserves the right to modify these terms, and
              continued use of the platform constitutes acceptance of any
              updated terms.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
