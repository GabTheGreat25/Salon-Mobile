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

export default function () {
  const navigation = useNavigation();

  const { textColor, backgroundColor, colorScheme } = changeColor();

  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#FDA7DF";
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

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
              className={`justify-center rounded-md bg-white m-8 p-4`}
              style={{
                backgroundColor: invertBackgroundColor,
              }}
            >
              <Text
                className={`mb-3 text-lg font-semibold`}
                style={{
                  color: invertTextColor,
                }}
              >
                Let's Talk!
              </Text>
              <Text
                className={`text-sm font-semibold mb-2`}
                style={{
                  color: invertTextColor,
                }}
              >
                Full name
              </Text>
              <TextInput
                className={`h-8 border-1 border-black bg-gray-100 mb-4 p-2 rounded`}
                placeholder="Your name"
              />
              <Text
                className={`text-sm font-semibold mb-2`}
                style={{
                  color: invertTextColor,
                }}
              >
                Email address:
              </Text>
              <TextInput
                className={`h-8 border-1 border-black bg-gray-100 mb-4 p-2 rounded`}
                placeholder="Your email address"
              />
              <Text
                className={`text-sm font-semibold mb-2`}
                style={{
                  color: invertTextColor,
                }}
              >
                Mobile Number
              </Text>
              <TextInput
                className={`h-8 border-1 border-black bg-gray-100 mb-4 p-2 rounded`}
                placeholder="09XXXXXXXX"
              />
              <Text
                className={`text-sm font-semibold mb-2`}
                style={{
                  color: invertTextColor,
                }}
              >
                What would you like to discuss?:
              </Text>
              <TextInput
                className={`border-1 border-black bg-gray-100 mb-4 pt-3 rounded h-24 resize-none`}
                placeholder="Your feedback here"
                textAlignVertical="top"
                multiline
              />
              <TouchableOpacity className={`rounded bg-pink-400 h-10 w-full`}>
                <Text className={`text-center text-lg text-white mt-2.5`}>
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
