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
              Frequently Asked Questions About Lhanlee Salon
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              1.) About Lhanlee Salon
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              Nestled in the vibrant community of Taguig City, Lhanlee Beauty
              Lounge invites you to experience a haven of beauty and
              relaxation.Conveniently located at 22 Calleja Street, Central
              Signal Village, our salon is dedicated to providing an unparalled
              pampering experience tailored to your unique needs. Since 2019,
              Lhanlee Beauty Lounge has been a trusted destination for those
              seeking top tier beauty services.
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              2.) Where is Lhanlee Salon Located ?
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              We are located at: 22 Calleja Street Central Signal Village,
              Taguig City Philippines.
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              3.) What Services do you Offer ?
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              We Offer top tier services to work with your hands, hair feet,
              facial body and eyelashes.
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              4.) What Payment does Lhanlee Salon Accept ?
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              We Accept cash and e-wallet payments.
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              5.) What are Lhanlee Salon's Business Hours ?
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              Lhanlee Salon's Business Hours run from monday through sunday,
              providing quality services from 8:00 A.M to 6:00 P.M each day.
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              6.) How else i can cotact Lhanlee Salon ?
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              You can email us at:alexijiopeja@gmail.com or contact us through
              phone +639 956 802 8031
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
