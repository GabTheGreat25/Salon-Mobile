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
import { useGetFeedbackByIdQuery } from "../../state/api/reducer";
import { useNavigation } from "@react-navigation/native";
import { LoadingScreen } from "@components";
import { changeColor } from "@utils";
import { BackIcon } from "@helpers";
import { useIsFocused } from "@react-navigation/native";

export default function ({ route }) {
  const { id } = route.params;
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const { data, isLoading, refetch } = useGetCommentByIdQuery(id);

  const comment = data?.details;

  const anonymizeName = (name) => {
    if (!name || name?.length < 2) return "";
    return name[0] + "*".repeat(name?.length - 2) + name[name?.length - 1];
  };

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
                  View Feedback Details
                </Text>
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
                  className={`font-semibold text-base`}
                >
                  Customer Name
                </Text>
                <TextInput
                  style={{ color: textColor }}
                  className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                  autoCapitalize="none"
                  value={
                    feedback?.isAnonymous
                      ? anonymizeName(
                          comment?.transaction?.appointment?.customer?.name
                        )
                      : comment?.transaction?.appointment?.customer?.name
                  }
                />

                <Text
                  style={{ color: textColor }}
                  className={`font-semibold text-base`}
                >
                  Comment Description
                </Text>
                <TextInput
                  style={{
                    color: textColor,
                    height: 100,
                    textAlignVertical: "top",
                  }}
                  className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-lg my-2 ${borderColor}`}
                  placeholder="Add Ingredients Here..."
                  multiline={true}
                  value={comment?.description}
                />

                <Text
                  style={{ color: textColor }}
                  className={`font-semibold text-base`}
                >
                  Comment Suggestion
                </Text>
                <TextInput
                  style={{
                    color: textColor,
                    height: 100,
                    textAlignVertical: "top",
                  }}
                  className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-lg my-2 ${borderColor}`}
                  placeholder="Add Ingredients Here..."
                  multiline={true}
                  value={comment?.suggestion}
                />
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      )}
    </>
  );
}