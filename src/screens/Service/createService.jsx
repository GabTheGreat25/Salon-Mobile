import React, { useState, useEffect } from "react";
import {
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
import { changeColor } from "@utils";
import { BackIcon } from "@helpers";
import { useNavigation } from "@react-navigation/native";
import { LoadingScreen } from "@components";
import { dimensionLayout } from "@utils";
import { useFormik } from "formik";
import {
  useAddServiceMutation,
  useGetServicesQuery,
  useGetProductsQuery,
} from "../../state/api/reducer";
import { createServiceValidation } from "../../validation";
import Toast from "react-native-toast-message";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";

export default function () {
  const navigation = useNavigation();
  const isDimensionLayout = dimensionLayout();
  const { backgroundColor, textColor, colorScheme } = changeColor();

  const borderColor = colorScheme === "dark" ? "#e5e5e5" : "#212B36";

  const scroll = 425;

  const { data } = useGetProductsQuery();
  const { refetch: refetchServices } = useGetServicesQuery();
  const [addService, { isLoading }] = useAddServiceMutation();
  const [selectedImages, setSelectedImages] = useState([]);

  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(scroll);

  const formik = useFormik({
    initialValues: {
      service_name: "",
      description: "",
      price: "",
      product: "",
    },
    validationSchema: createServiceValidation,
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
      formData.append("service_name", values.service_name);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("product", values.product);

      addService(formData)
        .unwrap()
        .then((response) => {
          refetchServices();
          navigation.navigate("Service");
          setSelectedImages([]);
          formik.resetForm();
          Toast.show({
            type: "success",
            position: "top",
            text1: "Service Successfully Created",
            text2: `${response?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Creating Service",
            text2: `${error?.data?.error?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
        });
    },
  });

  const handleTextInputFocus = () => {
    setScrollViewHeight(keyboardOpen ? 450 : scroll);
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
        setScrollViewHeight(450);
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
            <View
              className={`flex-1 items-center justify-center ${
                isDimensionLayout ? "mt-20" : "mt-10"
              }`}
            >
              <Text
                style={{ color: textColor }}
                className={`my-10 font-semibold text-center ${
                  isDimensionLayout ? "text-3xl" : "text-2xl"
                }`}
              >
                Create Service
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
                  scrollEnabled={scrollViewHeight > 350}
                  decelerationRate="fast"
                  scrollEventThrottle={1}
                >
                  <TextInput
                    style={{ color: textColor }}
                    className={`border-b mb-3 ${borderColor}`}
                    placeholder="Enter your service name"
                    placeholderTextColor={textColor}
                    autoCapitalize="none"
                    handleTextInputFocus={handleTextInputFocus}
                    onChangeText={formik.handleChange("service_name")}
                    onBlur={formik.handleBlur("service_name")}
                    value={formik.values.service_name}
                  />
                  {formik.touched.service_name &&
                    formik.errors.service_name && (
                      <Text style={{ color: "red" }}>
                        {formik.errors.service_name}
                      </Text>
                    )}

                  <TextInput
                    style={{ color: textColor }}
                    className={`border-b mb-3 ${borderColor}`}
                    placeholder="Enter your description"
                    placeholderTextColor={textColor}
                    autoCapitalize="none"
                    handleTextInputFocus={handleTextInputFocus}
                    onChangeText={formik.handleChange("description")}
                    onBlur={formik.handleBlur("description")}
                    value={formik.values.description}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <Text style={{ color: "red" }}>
                      {formik.errors.description}
                    </Text>
                  )}

                  <TextInput
                    style={{ color: textColor }}
                    className={`border-b mb-3 ${borderColor}`}
                    placeholder="Enter the price"
                    placeholderTextColor={textColor}
                    keyboardType="numeric"
                    autoCapitalize="none"
                    handleTextInputFocus={handleTextInputFocus}
                    onChangeText={formik.handleChange("price")}
                    onBlur={formik.handleBlur("price")}
                    value={formik.values.price}
                  />
                  {formik.touched.price && formik.errors.price && (
                    <Text style={{ color: "red" }}>{formik.errors.price}</Text>
                  )}

                  <Picker
                    selectedValue={formik.values.product}
                    style={{ color: textColor }}
                    dropdownIconColor={textColor}
                    onValueChange={(itemValue) =>
                      formik.setFieldValue("product", itemValue)
                    }
                  >
                    <Picker.Item label="Select Product" value="" />
                    {data?.details?.map((product) => (
                      <Picker.Item
                        key={product._id}
                        label={product.product_name}
                        value={product._id}
                      />
                    ))}
                  </Picker>
                  {formik.touched.product && formik.errors.product && (
                    <Text style={{ color: "red" }}>
                      {formik.errors.product}
                    </Text>
                  )}
                  <Text
                    style={{ color: textColor }}
                    className={`${borderColor} font-semibold text-base`}
                  >
                    Add your image
                  </Text>
                  <View className={`flex-row gap-x-2 my-1`}>
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

                  <View
                    className={`mt-4 items-center justify-center ${
                      isDimensionLayout ? "flex-col" : "flex-row gap-x-2"
                    }`}
                  >
                    <TouchableOpacity
                      onPress={formik.handleSubmit}
                      disabled={!formik.isValid}
                    >
                      <View className={`mb-2 flex justify-center items-center`}>
                        <View
                          className={`py-2 rounded-lg bg-primary-accent w-[175px]
                          } ${!formik.isValid ? "opacity-50" : "opacity-100"}`}
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
          </SafeAreaView>
        </TouchableWithoutFeedback>
      )}
    </>
  );
}
