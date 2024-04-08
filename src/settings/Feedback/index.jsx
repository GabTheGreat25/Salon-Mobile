import React from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
} from "react-native";
import { changeColor } from "@utils";
import { BackIcon } from "@helpers";
import { useNavigation } from "@react-navigation/native";
import { TextInputMask } from "react-native-masked-text";

export default function () {
  const navigation = useNavigation();

  const { textColor, backgroundColor, borderColor, colorScheme } =
    changeColor();

  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#FFB6C1";
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

  const handlePhoneNumberChange = (event) => {
    let phoneNumber = event.nativeEvent.text.replace(/[-\s]/g, "");
    phoneNumber = phoneNumber.substring(0, 11);
    // formik.setFieldValue("contact_number", phoneNumber);
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={{ backgroundColor }} className={`flex-1`}>
          <BackIcon navigateBack={navigation.goBack} textColor={textColor} />
          <ScrollView
            showsVerticalScrollIndicator={false}
            decelerationRate="fast"
            scrollEventThrottle={1}
            className={`py-12`}
          >
            <View
              className={`justify-center rounded-lg m-8 p-4`}
              style={{
                backgroundColor: invertBackgroundColor,
              }}
            >
              <Text
                className={`mb-3 text-2xl font-semibold`}
                style={{
                  color: invertTextColor,
                }}
              >
                Let's Talk!
              </Text>
              <Text
                className={`text-lg font-semibold mb-2`}
                style={{
                  color: invertTextColor,
                }}
              >
                Full name
              </Text>
              <TextInput
                style={{ borderColor, backgroundColor, color: textColor }}
                className={`h-8 border-1 mb-4 p-2 rounded-lg`}
                placeholder="Your name"
                placeholderTextColor={textColor}
              />
              <Text
                className={`text-lg font-semibold mb-2`}
                style={{
                  color: invertTextColor,
                }}
              >
                Email address:
              </Text>
              <TextInput
                style={{ borderColor, backgroundColor, color: textColor }}
                className={`h-8 border-1 mb-4 p-2 rounded-lg`}
                placeholder="Your email address"
                placeholderTextColor={textColor}
              />
              <Text
                className={`text-lg font-semibold mb-2`}
                style={{
                  color: invertTextColor,
                }}
              >
                Mobile Number
              </Text>
              <TextInputMask
                style={{ borderColor, backgroundColor, color: textColor }}
                type={"custom"}
                options={{
                  mask: "9999 - 999 - 9999",
                }}
                className={`h-8 border-1 mb-4 p-2 rounded-lg`}
                placeholder="09XX - XXX - XXXX"
                placeholderTextColor={textColor}
                autoCapitalize="none"
                onChange={handlePhoneNumberChange}
                // onBlur={formik.handleBlur("contact_number")}
                // value={formik.values.contact_number}
                keyboardType="numeric"
              />
              <Text
                className={`text-lg font-semibold mb-2`}
                style={{
                  color: invertTextColor,
                }}
              >
                What would you like to discuss?
              </Text>
              <TextInput
                style={{ borderColor, backgroundColor, color: textColor }}
                className={`h-32 resize-none border-1 mb-4 px-2 pt-2 rounded-lg`}
                placeholder="Add Your feedback here"
                textAlignVertical="top"
                multiline
                placeholderTextColor={textColor}
              />
              <TouchableOpacity
                className={`rounded-md bg-primary-accent w-full justify-center items-center`}
              >
                <Text
                  style={{ color: textColor }}
                  className={`text-xl font-semibold py-1`}
                >
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </>
  );
}
