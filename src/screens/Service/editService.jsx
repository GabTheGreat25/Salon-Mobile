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
  useUpdateServiceMutation,
  useGetServicesQuery,
  useGetServiceByIdQuery,
  useGetProductsQuery,
} from "../../state/api/reducer";
import { useFormik } from "formik";
import { editServiceValidation } from "../../validation";
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

  const { refetch: refetchServices } = useGetServicesQuery();
  const {
    data,
    isLoading: isServiceLoading,
    refetch,
  } = useGetServiceByIdQuery(id);
  const { data: dataProducts } = useGetProductsQuery();
  const [updateService, { isLoading }] = useUpdateServiceMutation();

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
      service_name: data?.details?.service_name || "",
      description: data?.details?.description || "",
      price: data?.details?.price || 0,
      product: data?.details?.product || "",
    },
    validationSchema: editServiceValidation,
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

      updateService({ id: data?.details?._id, payload: formData })
        .unwrap()
        .then((response) => {
          refetch();
          refetchServices();
          Toast.show({
            type: "success",
            position: "top",
            text1: "Service Details Successfully Updated",
            text2: `${response?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
          setSelectedImages([]);
          navigation.navigate("Service");
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Updating Service Details",
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
      {isLoading || isServiceLoading ? (
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
                  Update Service Details
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
                      Service Name
                    </Text>
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
                    <Text
                      style={{ color: textColor }}
                      className={`font-semibold text-base`}
                    >
                      Description
                    </Text>
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
                    {formik.touched.description &&
                      formik.errors.description && (
                        <Text style={{ color: "red" }}>
                          {formik.errors.description}
                        </Text>
                      )}
                    <Text
                      style={{ color: textColor }}
                      className={`font-semibold text-base`}
                    >
                      Price
                    </Text>
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
                      value={String(formik.values.price)}
                    />
                    {formik.touched.price && formik.errors.price && (
                      <Text style={{ color: "red" }}>
                        {formik.errors.price}
                      </Text>
                    )}
                    <Text
                      style={{ color: textColor }}
                      className={`font-semibold text-base`}
                    >
                      Product Name
                    </Text>
                    <Picker
                      selectedValue={formik.values.product}
                      style={{ color: textColor }}
                      dropdownIconColor={textColor}
                      onValueChange={(itemValue) =>
                        formik.setFieldValue("product", itemValue)
                      }
                    >
                      {data?.details?.product && (
                        <Picker.Item
                          key={data?.details?.product?._id}
                          label={data?.details?.product?.product_name}
                          value={data?.details?.product?._id}
                        />
                      )}
                      {dataProducts?.details
                        ?.filter(
                          (product) =>
                            product._id !== data?.details?.product?._id
                        )
                        .map((product) => (
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
                      Update Service Image
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
