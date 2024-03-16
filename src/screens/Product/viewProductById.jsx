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
import {
  useGetProductByIdQuery,
  useGetBrandsQuery,
} from "../../state/api/reducer";
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

  const { data: brand, isLoading: brandLoading } = useGetBrandsQuery();
  const { data, isLoading, refetch } = useGetProductByIdQuery(id);

  const product = data?.details;

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
      {isLoading || brandLoading ? (
        <View
          className={`flex-1 justify-center items-center bg-primary-default`}
        >
          <LoadingScreen />
        </View>
      ) : (
        <>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView
              style={{ backgroundColor }}
              className={`relative flex-1 pt-12`}
            >
              <BackIcon
                navigateBack={navigation.goBack}
                textColor={textColor}
              />
              <KeyboardAvoidingView behavior="height">
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  decelerationRate="fast"
                  scrollEventThrottle={1}
                  className={`px-6`}
                >
                  <View className="items-center justify-center pb-6">
                    <Image
                      key={
                        data?.details?.image[
                          Math.floor(
                            Math.random() * data?.details?.image?.length
                          )
                        ]?.public_id
                      }
                      source={{
                        uri: data?.details?.image[
                          Math.floor(
                            Math.random() * data?.details?.image?.length
                          )
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
                    View Product Details
                  </Text>
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Product Name
                  </Text>
                  <TextInput
                    style={{ color: textColor }}
                    className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                    autoCapitalize="none"
                    value={product?.product_name}
                    editable={false}
                  />

                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Product Brand
                  </Text>

                  <View
                    className={`border-[1.5px]  font-normal rounded-full my-3 ${borderColor}`}
                  >
                    <Picker
                      selectedValue={product?.brand}
                      style={{ color: textColor }}
                      dropdownIconColor={textColor}
                      enabled={false}
                    >
                      <Picker.Item label="Select Brand" value="" />
                      {brand?.details
                        ?.filter((b) => b._id === product?.brand)
                        .map((b) => (
                          <Picker.Item
                            key={b?._id}
                            label={b?.brand_name}
                            value={b?._id}
                            color={textColor}
                          />
                        ))}
                    </Picker>
                  </View>

                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Product Category
                  </Text>
                  <TextInput
                    style={{ color: textColor }}
                    className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                    autoCapitalize="none"
                    value={
                      Array.isArray(product?.type)
                        ? product?.type.join(", ")
                        : product?.type
                    }
                    editable={false}
                  />
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Add ingredients of the product
                  </Text>
                  <TextInput
                    style={{
                      color: textColor,
                      height: 100,
                      textAlignVertical: "top",
                    }}
                    className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-lg my-2 ${borderColor}`}
                    autoCapitalize="none"
                    multiline={true}
                    value={product?.ingredients}
                    editable={false}
                  />

                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Product Status
                  </Text>
                  <TextInput
                    style={{ color: textColor }}
                    className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                    autoCapitalize="none"
                    value={product?.isNew ? "New Product" : "Old Product"}
                    editable={false}
                  />
                </ScrollView>
              </KeyboardAvoidingView>
            </SafeAreaView>
          </TouchableWithoutFeedback>
        </>
      )}
    </>
  );
}
