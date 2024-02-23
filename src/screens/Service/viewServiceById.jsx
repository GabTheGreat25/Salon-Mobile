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
import { useGetServiceByIdQuery } from "../../state/api/reducer";
import { useNavigation } from "@react-navigation/native";
import { LoadingScreen } from "@components";
import { changeColor } from "@utils";
import { BackIcon } from "@helpers";
import { useIsFocused } from "@react-navigation/native";

export default function ({ route }) {
  const { id } = route.params;
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const { data, isLoading, refetch } = useGetServiceByIdQuery(id);

  const service = data?.details;

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
                  View Service Details
                </Text>
                <Text
                  style={{ color: textColor }}
                  className={`font-semibold text-base`}
                >
                  Service Name
                </Text>
                <TextInput
                  style={{ color: textColor }}
                  className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                  autoCapitalize="none"
                  value={service?.service_name}
                />

                <Text
                  style={{ color: textColor }}
                  className={`font-semibold text-base`}
                >
                  Service Price
                </Text>
                <TextInput
                  style={{ color: textColor }}
                  className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                  autoCapitalize="none"
                  value={`₱${service?.price ? service.price.toString() : ""}`}
                />
                <Text
                  style={{ color: textColor }}
                  className={`font-semibold text-base`}
                >
                  Service Occasion
                </Text>
                <TextInput
                  style={{ color: textColor }}
                  className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                  autoCapitalize="none"
                  value={service?.occassion}
                />

                <Text
                  style={{ color: textColor }}
                  className={`font-semibold text-base`}
                >
                  Service Type
                </Text>
                <TextInput
                  style={{ color: textColor }}
                  className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                  autoCapitalize="none"
                  value={
                    Array.isArray(service?.type)
                      ? service?.type.join(", ")
                      : service?.type
                  }
                />

                <Text
                  style={{ color: textColor }}
                  className={`font-semibold text-base`}
                >
                  Products
                </Text>
                <TextInput
                  style={{ color: textColor }}
                  className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                  autoCapitalize="none"
                  value={service?.product
                    .map((product) => product?.product_name)
                    .join(", ")}
                />
                <Text
                  style={{ color: textColor }}
                  className={`font-semibold text-base`}
                >
                  Service Description
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
                  value={service?.description}
                />
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      )}
    </>
  );
}
