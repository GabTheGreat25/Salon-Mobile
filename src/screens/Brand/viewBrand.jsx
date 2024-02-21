import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  SafeAreaView,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
} from "react-native";
import { useGetBrandByIdQuery } from "../../state/api/reducer";
import { useNavigation } from "@react-navigation/native";
import { LoadingScreen } from "@components";
import { changeColor } from "@utils";
import { BackIcon } from "@helpers";
import { useIsFocused } from "@react-navigation/native";

export default function ({ route }) {
  const { id } = route.params;
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const { data, isLoading, refetch } = useGetBrandByIdQuery(id);

  const brand = data?.details;

  useEffect(() => {
    const fetchData = async () => {
      if (isFocused) refetch();
    };
    fetchData();
  }, [isFocused]);

  const { backgroundColor, textColor, colorScheme } = changeColor();
  const borderColor =
    colorScheme === "dark" ? "border-neutral-light" : "border-neutral-dark";

  return (
    <>
      {isLoading ? (
        <View
          className={`flex-1 justify-center items-center bg-primary-default`}
        >
          <LoadingScreen />
        </View>
      ) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView
            style={{ backgroundColor }}
            className={`relative flex-1`}
          >
            <BackIcon navigateBack={navigation.goBack} textColor={textColor} />
            <KeyboardAvoidingView behavior="height">
              <ScrollView
                showsVerticalScrollIndicator={false}
                decelerationRate="fast"
                scrollEventThrottle={1}
                className={`px-6`}
              >
                <Text
                  style={{ color: textColor }}
                  className={`font-semibold text-center pb-6 text-3xl`}
                >
                  View Brand Details
                </Text>
                <Text
                  style={{ color: textColor }}
                  className={`font-semibold text-base`}
                >
                  Brand Name
                </Text>
                <TextInput
                  style={{ color: textColor }}
                  className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                  autoCapitalize="none"
                  value={brand?.brand_name}
                />
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      )}
    </>
  );
}
