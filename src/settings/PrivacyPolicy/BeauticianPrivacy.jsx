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
          <Text
            className={`text-3xl font-semibold text-center py-2`}
            style={{
              color: invertTextColor,
            }}
          >
            Privacy Policy
          </Text>
          
          <Text
            className={`text-lg font-semibold text-center`}
            style={{
              color: invertTextColor,
            }}
          >
            By registering as a beautician, you agree to the Lhanlee Beauty
            Lounge's Privacy Policy:{" "}
          </Text>

          <Text
            className={`text-lg font-semibold text-center`}
            style={{
              color: invertTextColor,
            }}
          >
            When you register and use the Lhanlee Lounge Salon’s Beautician
            Registration and Management System, we collect personal information
            necessary for the registration process. This may include your name,
            contact details, and other relevant information.{" "}
          </Text>

          <Text
            className={`text-lg font-semibold text-center`}
            style={{
              color: invertTextColor,
            }}
          >
            For the purpose of maintaining accurate records, we may also record
            transaction details if applicable, such as for administrative
            purposes.
          </Text>

          <Text
            className={`text-lg font-semibold text-center`}
            style={{
              color: invertTextColor,
            }}
          >
            The collected information is solely used to facilitate the
            beautician registration process, manage scheduling, and maintain
            essential records. We may use your contact information to
            communicate essential details such as appointment confirmations and
            other relevant communications related to the beautician registration
            and management process.
          </Text>

          <Text
            className={`text-lg font-semibold text-center`}
            style={{
              color: invertTextColor,
            }}
          >
            To safeguard your information from unauthorized access, disclosure,
            alteration, and destruction, we implement industry-standard security
            measures.{" "}
          </Text>

          <Text
            className={`text-lg font-semibold text-center`}
            style={{
              color: invertTextColor,
            }}
          >
            This Privacy Policy may be updated periodically, and users will be
            notified of any significant changes. Continued use of the Lhanlee
            Lounge Salon’s Beautician Registration and Management System
            constitutes acceptance of the updated policy.
          </Text>

          </ScrollView>
        </SafeAreaView>
    </>
  );
}
