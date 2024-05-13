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
              By registering as a beautician on our platform, you acknowledge
              and agree to the following terms and conditions.
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              Upon acceptance into Lhanlee Lounge Salon, I, as a beautician,
              willingly commit to upholding the terms and conditions outlined
              for my membership. Recognizing the importance of confidentiality,
              I pledge to safeguard all proprietary and confidential information
              pertaining to the salon's business practices, client details, and
              trade secrets.
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              safeguard all proprietary and confidential information pertaining
              to the salon's business practices, client details, and trade
              secrets. Furthermore, I acknowledge that any intellectual property
              generated during my affiliation with the salon, be it individually
              or collaboratively, remains the exclusive property of the salon,
              encompassing branding, marketing materials, and unique service
              methodologies.
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              I am cognizant that any breach of these terms and conditions,
              violation of confidentiality, unprofessional conduct, or actions
              deemed detrimental to the salon's reputation may result in the
              termination of my association with Lhanlee Lounge Salon. Lhanlee
              Lounge Salon reserves the right to modify these terms and
              conditions, with notification of any changes provided. My
              continued affiliation with the salon implies acceptance of any
              updated terms.
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              Lhanlee Lounge Salon reserves the right to modify these
              terms and conditions, with notification of any changes provided.
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              My continued affiliation with the salon implies acceptance of any
              updated terms.
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              Lhanlee By endorsing my continued association with Lhanlee Lounge
              Salon, I affirm that I have read, understood, and agree to abide
              by these Beautician Membership Terms and Conditions.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
