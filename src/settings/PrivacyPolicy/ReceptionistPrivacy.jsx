import { View, Text, ScrollView, SafeAreaView } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { changeColor } from "@utils";
import { BackIcon } from "@helpers";
import { useNavigation } from "@react-navigation/native";

export default function () {
  const navigation = useNavigation();

  const { textColor, backgroundColor, colorScheme } = changeColor();

  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#FFB6C1";
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
          <BackIcon navigateBack={navigation.goBack} textColor={textColor} />

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
            When you register and use the Lhanlee Lounge Salon’s Receptionist
            Registration and Management System, we collect personal information
            necessary for the registration process.
          </Text>
          <Text
            className={`text-lg font-semibold text-center`}
            style={{
              color: invertTextColor,
            }}
          >
            Recognizing the importance of confidentiality, I pledge to safeguard
            all proprietary and confidential information pertaining to the
            salon's business practices, client details, and trade secrets.
          </Text>
          <Text
            className={`text-lg font-semibold text-center`}
            style={{
              color: invertTextColor,
            }}
          >
            Furthermore, I acknowledge that any intellectual property generated
            during my affiliation with the salon, be it individually or
            collaboratively, remains the exclusive property of the salon,
            encompassing branding, marketing materials, and unique service
            methodologies.
          </Text>
          <Text
            className={`text-lg font-semibold text-center`}
            style={{
              color: invertTextColor,
            }}
          >
            I am cognizant that any breach of these terms and conditions,
            violation of confidentiality, unprofessional conduct, or actions
            deemed detrimental to the salon's reputation may result in the
            termination of my association with Lhanlee Lounge Salon.
          </Text>
          <Text
            className={`text-lg font-semibold text-center`}
            style={{
              color: invertTextColor,
            }}
          >
            Lhanlee Lounge Salon reserves the right to modify these terms and
            conditions, with notification of any changes provided.
          </Text>
          <Text
            className={`text-lg font-semibold text-center`}
            style={{
              color: invertTextColor,
            }}
          >
            My continued affiliation with the salon implies acceptance of any
            updated terms.
          </Text>
          <Text
            className={`text-lg font-semibold text-center`}
            style={{
              color: invertTextColor,
            }}
          >
            By endorsing my continued association with Lhanlee Lounge Salon, I
            affirm that I have read, understood, and agree to abide by these
            Beautician Membership Terms and Conditions.
          </Text>
        </View>
      </ScrollView>
    </>
  );
}
