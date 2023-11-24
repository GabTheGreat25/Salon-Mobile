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
  BackHandler,
  TextInput,
} from "react-native";
import {
  useUpdateProductMutation,
  useGetProductByIdQuery,
} from "../../state/api/reducer";
import { useFormik } from "formik";
import { editProductValidation } from "../../validation";
import { useNavigation } from "@react-navigation/native";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import { LoadingScreen } from "@components";
import { dimensionLayout, changeColor } from "@utils";
import { Picker } from "@react-native-picker/picker";
import { BackIcon } from "@helpers";

export default function ({ route }) {
  const { id } = route.params;
  const navigation = useNavigation();

  const { data, isLoading: isProductLoading } = useGetProductByIdQuery(id);

  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  const isDimensionLayout = dimensionLayout();
  const { backgroundColor, textColor, colorScheme } = changeColor();
  const borderColor =
    colorScheme === "dark" ? "border-neutral-light" : "border-neutral-dark";
  const [selectedImages, setSelectedImages] = useState([]);

  const scroll = 500;

  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(scroll);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      product_name: data?.details?.product_name || "",
      brand: data?.details?.brand || "",
      type: data?.details?.type || "",
    },
    validationSchema: editProductValidation,
    onSubmit: (values) => {
      const formData = new FormData();
      if (selectedImages.length > 0) {
        selectedImages.forEach((image, index) => {
          const imageName = image.uri.split("/").pop();
          const imageType = "image/" + imageName.split(".").pop();

          formData.append("image", {
            uri: image.uri,
            name: imageName,
            type: imageType,
          });
        });
      }

      formData.append("product_name", values.product_name);
      formData.append("brand", values.brand);
      formData.append("type", values.type);

      updateProduct({ id: data?.details?._id, payload: formData })
        .unwrap()
        .then((response) => {
          Toast.show({
            type: "success",
            position: "top",
            text1: "Product Details Successfully Updated",
            text2: `${response?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
          setSelectedImages([]);
          navigation.navigate("Product");
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Updating Product Details",
            text2: `${error?.data?.error?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
        });
    },
  });

  const handleTextInputFocus = () => {
    setScrollViewHeight(keyboardOpen ? 600 : scroll);
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        setScrollViewHeight(scroll);
        return true;
      }
    );

    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardOpen(true);
        setScrollViewHeight(600);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardOpen(false);
        setScrollViewHeight(scroll);
      }
    );

    return () => {
      backHandler.remove();
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const takePicture = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [3, 2],
      quality: 1,
    });

    if (!result.canceled) {
      const newImage = result.assets[0];

      const manipulatorOptions = {
        compress: 0.5,
        format: ImageManipulator.SaveFormat.JPEG,
      };

      try {
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          newImage.uri,
          [],
          manipulatorOptions
        );

        if (manipulatedImage) {
          setSelectedImages([manipulatedImage]);
        }
      } catch (error) {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Error Adding Image",
          text2: `${error}`,
          visibilityTime: 3000,
          autoHide: true,
        });
      }
    }
  };

  const selectImages = async () => {
    let results = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [3, 2],
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!results.canceled) {
      const selectedAssets = results.assets;

      const manipulatorOptions = {
        compress: 0.5,
        format: ImageManipulator.SaveFormat.JPEG,
      };

      const newImages = [];

      for (const selectedAsset of selectedAssets) {
        try {
          const manipulatedImage = await ImageManipulator.manipulateAsync(
            selectedAsset.uri,
            [],
            manipulatorOptions
          );

          if (manipulatedImage) {
            newImages.push(manipulatedImage);
          }
        } catch (error) {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Adding Image",
            text2: `${error}`,
            visibilityTime: 3000,
            autoHide: true,
          });
        }
      }

      setSelectedImages(newImages);
    }
  };

  return (
    <>
      {isLoading || isProductLoading ? (
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
            <View
              className={`justify-start ${
                isDimensionLayout
                  ? "mt-24 flex-col items-center"
                  : "mt-4 flex-row items-start"
              }`}
            >
              <Image
                source={{
                  uri: data?.details?.image[0]?.url,
                  headers: {
                    Accept: "*/*",
                  },
                }}
                className={`rounded-full ${
                  isDimensionLayout
                    ? "w-[45%] h-[50%]"
                    : "ml-16 mt-12 w-[200px] h-[200px]"
                }`}
                resizeMode="contain"
              />
              <View className={`flex-1 items-center justify-start`}>
                <Text
                  style={{ color: textColor }}
                  className={`font-semibold text-center ${
                    isDimensionLayout ? "my-[9px] text-3xl" : "my-1 text-xl"
                  }`}
                >
                  Update Product Details
                </Text>
                <KeyboardAvoidingView
                  behavior="padding"
                  className={`${
                    isDimensionLayout ? "h-[450px] w-[300px]" : "w-[375px]"
                  }`}
                >
                  <ScrollView
                    contentContainerStyle={{ height: scrollViewHeight }}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={scrollViewHeight > 450}
                    decelerationRate="fast"
                    scrollEventThrottle={1}
                  >
                    <Text
                      style={{ color: textColor }}
                      className={`font-semibold text-base`}
                    >
                      Product Name
                    </Text>
                    <TextInput
                      style={{ color: textColor }}
                      className={`border-b mb-3 ${borderColor}`}
                      placeholder="Enter your product name"
                      placeholderTextColor={textColor}
                      autoCapitalize="none"
                      handleTextInputFocus={handleTextInputFocus}
                      onChangeText={formik.handleChange("product_name")}
                      onBlur={formik.handleBlur("product_name")}
                      value={formik.values.product_name}
                    />
                    {formik.touched.product_name &&
                      formik.errors.product_name && (
                        <Text style={{ color: "red" }}>
                          {formik.errors.product_name}
                        </Text>
                      )}

                    <Text
                      style={{ color: textColor }}
                      className={`font-semibold text-base`}
                    >
                      Brand
                    </Text>

                    <Picker
                      selectedValue={formik.values.brand}
                      style={{ color: textColor }}
                      dropdownIconColor={textColor}
                      onValueChange={(itemValue, itemIndex) =>
                        formik.setFieldValue("brand", itemValue)
                      }
                    >
                      <Picker.Item label="Select Brand" value="" />
                      <Picker.Item label="Palmolive" value="Palmolive" />
                      <Picker.Item label="Dove" value="Dove" />
                      <Picker.Item
                        label="Head and Shoulders"
                        value="Head and Shoulders"
                      />
                      <Picker.Item label="Sunsilk" value="Sunsilk" />
                    </Picker>
                    {formik.touched.brand && formik.errors.brand && (
                      <Text style={{ color: "red" }}>
                        {formik.errors.brand}
                      </Text>
                    )}

                    <Text
                      style={{ color: textColor }}
                      className={`font-semibold text-base`}
                    >
                      Type
                    </Text>

                    <Picker
                      selectedValue={formik.values.type}
                      style={{ color: textColor }}
                      dropdownIconColor={textColor}
                      onValueChange={(itemValue, itemIndex) =>
                        formik.setFieldValue("type", itemValue)
                      }
                    >
                      <Picker.Item label="Select Type" value="" />
                      <Picker.Item label="Shampoo" value="Shampoo" />
                      <Picker.Item label="Soap" value="Soap" />
                      <Picker.Item label="Conditioner" value="Conditioner" />
                      <Picker.Item
                        label="Facial Cleanser"
                        value="Facial Cleanser"
                      />
                    </Picker>
                    {formik.touched.type && formik.errors.type && (
                      <Text style={{ color: "red" }}>{formik.errors.type}</Text>
                    )}

                    <Text
                      style={{ color: textColor }}
                      className={`${borderColor} font-semibold text-base`}
                    >
                      Update Product Image
                    </Text>
                    <View className={`flex-row gap-x-2 mt-1 mb-6`}>
                      <TouchableOpacity onPress={takePicture}>
                        <Text
                          style={{ color: textColor }}
                          className={`${borderColor}`}
                        >
                          Take a Picture
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={selectImages}>
                        <Text
                          style={{ color: textColor }}
                          className={`${borderColor}`}
                        >
                          Select Images
                        </Text>
                      </TouchableOpacity>
                      {selectedImages?.length > 0 ? (
                        <Text
                          style={{ color: textColor }}
                          className={`${borderColor}`}
                        >
                          Add {selectedImages.length} image
                          {selectedImages.length > 1 ? "s" : ""}
                        </Text>
                      ) : (
                        <Text
                          style={{ color: textColor }}
                          className={`${borderColor}`}
                        >
                          No Image
                        </Text>
                      )}
                    </View>
                    <View className={`flex-col`}>
                      <TouchableOpacity
                        onPress={formik.handleSubmit}
                        disabled={!formik.isValid}
                      >
                        <View
                          className={`mb-2 ${
                            isDimensionLayout
                              ? "w-full"
                              : "flex justify-center items-center"
                          }`}
                        >
                          <View
                            className={`py-2 rounded-lg bg-primary-accent ${
                              isDimensionLayout ? "mx-20" : "w-[175px] mx-0"
                            } ${
                              !formik.isValid ? "opacity-50" : "opacity-100"
                            }`}
                          >
                            <Text
                              className={`font-semibold text-center text-lg`}
                              style={{ color: textColor }}
                            >
                              Submit
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                </KeyboardAvoidingView>
              </View>
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      )}
    </>
  );
}
