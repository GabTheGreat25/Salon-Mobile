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
import { useGetDeliveryByIdQuery } from "../../state/api/reducer";
import { useNavigation } from "@react-navigation/native";
import { LoadingScreen } from "@components";
import { changeColor } from "@utils";
import { Picker } from "@react-native-picker/picker";
import { BackIcon } from "@helpers";
import { useIsFocused } from "@react-navigation/native";

export default function ({ route }) {
  const { id } = route.params;
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const { data, isLoading, refetch } = useGetDeliveryByIdQuery(id);

  const delivery = data?.details;

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
                {/* <View className="items-center justify-center py-12">
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
                </View> */}
                <Text
                  style={{ color: textColor }}
                  className={`font-semibold text-center pb-6 text-3xl`}
                >
                  View delivery Details
                </Text>
                <Text
                  style={{ color: textColor }}
                  className={`font-semibold text-base`}
                >
                  Company Name
                </Text>
                <TextInput
                  style={{ color: textColor }}
                  className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                  autoCapitalize="none"
                  value={delivery?.company_name}
                />

                <Text
                  style={{ color: textColor }}
                  className={`font-semibold text-base`}
                >
                  Delivery Date
                </Text>
                <TextInput
                  style={{ color: textColor }}
                  className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                  autoCapitalize="none"
                  value={
                    delivery?.date
                      ? new Date(delivery.date).toISOString().split("T")[0]
                      : ""
                  }
                />
                <Text
                  style={{ color: textColor }}
                  className={`font-semibold text-base`}
                >
                  Delivery Price
                </Text>
                <TextInput
                  style={{ color: textColor }}
                  className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                  autoCapitalize="none"
                  value={`₱${delivery?.price ? delivery.price.toString() : ""}`}
                />
                <Text
                  style={{ color: textColor }}
                  className={`font-semibold text-base`}
                >
                  Delivery Status
                </Text>
                <TextInput
                  style={{ color: textColor }}
                  className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                  autoCapitalize="none"
                  value={delivery?.status}
                />

                <Text
                  style={{ color: textColor }}
                  className={`font-semibold text-base`}
                >
                  Product Type
                </Text>
                <TextInput
                  style={{ color: textColor }}
                  className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                  autoCapitalize="none"
                  value={
                    Array.isArray(delivery?.type)
                      ? delivery?.type.join(", ")
                      : delivery?.type
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
                  value={delivery?.product
                    .map((product) => product?.product_name)
                    .join(", ")}
                />
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      )}
    </>
  );
}
