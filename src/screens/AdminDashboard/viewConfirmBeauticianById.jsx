import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
} from "react-native";
import { useGetUserByIdQuery } from "../../state/api/reducer";
import { useNavigation } from "@react-navigation/native";
import { LoadingScreen } from "@components";
import { changeColor } from "@utils";
import { BackIcon } from "@helpers";
import { useIsFocused } from "@react-navigation/native";

export default function ({ route }) {
  const { id } = route.params;
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const { data, isLoading, refetch } = useGetUserByIdQuery(id);

  const user = data?.details;

  useEffect(() => {
    const fetchData = async () => {
      if (isFocused) refetch();
    };
    fetchData();
  }, [isFocused]);

  const { backgroundColor, textColor, colorScheme } = changeColor();
  const borderColor =
    colorScheme === "dark" ? "border-neutral-light" : "border-neutral-dark";

  const datePart = user?.requirement?.date
    ? new Date(user?.requirement?.date).toISOString().split("T")[0]
    : "";

  const timePart = user?.requirement?.time || "";

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
                <View className="items-center justify-center py-12">
                  <Image
                    key={
                      data?.details?.image[
                        Math.floor(Math.random() * data?.details?.image?.length)
                      ]?.public_id
                    }
                    source={{
                      uri: data?.details?.image[
                        Math.floor(Math.random() * data?.details?.image?.length)
                      ]?.url,
                    }}
                    className={`rounded-full w-60 h-60`}
                    resizeMode="cover"
                  />
                </View>
                <Text
                  style={{ color: textColor }}
                  className={`font-semibold text-center pb-6 text-3xl`}
                >
                  Applying Employee's Information
                </Text>
                <Text
                  style={{ color: textColor }}
                  className={`font-semibold text-base`}
                >
                  Employee's Name
                </Text>
                <TextInput
                  style={{ color: textColor }}
                  className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                  autoCapitalize="none"
                  value={user?.name}
                />
                <Text
                  style={{ color: textColor }}
                  className={`font-semibold text-base`}
                >
                  Employee's Registered Email
                </Text>
                <TextInput
                  style={{ color: textColor }}
                  className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                  autoCapitalize="none"
                  value={user?.email}
                />
                <Text
                  style={{ color: textColor }}
                  className={`font-semibold text-base`}
                >
                  Mobile Number
                </Text>
                <TextInput
                  style={{ color: textColor }}
                  className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                  autoCapitalize="none"
                  value={user?.contact_number}
                />

                <Text
                  style={{ color: textColor }}
                  className={`font-semibold text-base`}
                >
                  Date
                </Text>
                <TextInput
                  style={{ color: textColor }}
                  className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                  autoCapitalize="none"
                  value={datePart}
                />
                <Text
                  style={{ color: textColor }}
                  className={`font-semibold text-base`}
                >
                  Time
                </Text>
                <TextInput
                  style={{ color: textColor }}
                  className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                  autoCapitalize="none"
                  value={timePart}
                />
                <Text
                  style={{ color: textColor }}
                  className={`font-semibold text-base`}
                >
                  Employee's Role
                </Text>
                <TextInput
                  style={{ color: textColor }}
                  className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                  autoCapitalize="none"
                  value={user?.roles?.join(", ")}
                />
                <Text
                  style={{ color: textColor }}
                  className={`font-semibold text-base`}
                >
                  Employee's Category Service
                </Text>
                <TextInput
                  style={{ color: textColor }}
                  className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                  autoCapitalize="none"
                  value={user?.requirement?.job_type}
                />
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      )}
    </>
  );
}
