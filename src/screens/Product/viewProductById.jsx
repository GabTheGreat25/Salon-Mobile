import React, { useEffect } from "react";
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

  const { data, isLoading, refetch } = useGetProductByIdQuery(id);
  const product = data?.details;
  const {
    data: brand,
    isLoading: brandLoading,
    refetch: refetchBrand,
  } = useGetBrandsQuery();

  useEffect(() => {
    const fetchData = async () => {
      if (isFocused) {
        await Promise.all([refetch(), refetchBrand()]);
      }
    };
    fetchData();
  }, [isFocused]);

  const { backgroundColor, textColor, borderColor } = changeColor();

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
                    style={{ color: textColor, borderColor }}
                    placeholderTextColor={textColor}
                    className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2`}
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
                    style={{ borderColor }}
                    className={`border-[1.5px]  font-normal rounded-full my-3`}
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
                    style={{ color: textColor, borderColor }}
                    placeholderTextColor={textColor}
                    className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2`}
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
                      borderColor,
                    }}
                    placeholderTextColor={textColor}
                    className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-lg my-2`}
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
                    style={{ color: textColor, borderColor }}
                    placeholderTextColor={textColor}
                    className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2`}
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
