import React from "react";
import { Text, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { changeColor } from "@utils";
import { useNavigation } from "@react-navigation/native";

export default function () {
  const { textColor, backgroundColor } = changeColor();

  const navigation = useNavigation();

  const terms = () => {
    navigation.navigate("BeauticianAccepted");
  };

  const policy = () => {
    navigation.navigate("BeauticianPrivacy");
  };

  return (
    <>
      <SafeAreaView style={{ backgroundColor }} className={`flex-1`}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          decelerationRate="fast"
          scrollEventThrottle={1}
          style={{
            backgroundColor,
          }}
          className={`pt-4 px-4`}
        >
          <Text
            className={`text-3xl font-semibold pb-4`}
            style={{
              color: textColor,
            }}
          >
            How can we help?
          </Text>
          <TouchableOpacity
          onPress={terms}
            className={`px-4 mb-3 flex-row justify-between items-center w-full `}
          >
            <Text
              className={`text-lg font-semibold`}
              style={{
                color: textColor,
              }}
            >
              Terms And Conditions
            </Text>
            <Feather name="chevron-right" size={40} color={textColor} />
          </TouchableOpacity>
          <TouchableOpacity
          onPress={policy}
            className={`px-4 mb-3 flex-row justify-between items-center w-full `}
          >
            <Text
              className={`text-lg font-semibold`}
              style={{
                color: textColor,
              }}
            >
              Privacy Policy
            </Text>
            <Feather name="chevron-right" size={40} color={textColor} />
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
