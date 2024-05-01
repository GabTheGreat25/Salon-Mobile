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
              About Lhanlee Beauty Lounge
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
             Nestled in the vibrant community of Taguig City, Lhanlee Beauty Lounge invites you to experience a haven of beauty and relaxation. Conveniently located at 22 Calleja St., Central Signal Village, our salon is dedicated to providing an unparalleled pampering experience tailored to your unique needs.
            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
             Since 2019, Lhanlee Beauty Lounge has been a trusted destination for those seeking top-tier beauty services. Our team of skilled professionals specializes in hair styling, coloring, skincare, and massage therapies, ensuring that each visit leaves you feeling rejuvenated and radiant.

            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              At Lhanlee Beauty Lounge, we prioritize quality and excellence in everything we do. From our carefully curated selection of premium products to our personalized approach to client care, we are committed to exceeding your expectations and helping you achieve your beauty goals.

            </Text>
            <Text
              className={`text-xl font-semibold text-justify py-2`}
              style={{
                color: invertTextColor,
              }}
            >
              Step into our welcoming space, where relaxation meets sophistication, and let our team of experts pamper you with the utmost care and attention. Whether you're preparing for a special occasion or simply treating yourself to some self-care, Lhanlee Beauty Lounge is here to elevate your beauty experience.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
