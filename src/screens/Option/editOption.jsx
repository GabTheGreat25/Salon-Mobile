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
  useUpdateOptionMutation,
  useGetOptionByIdQuery,
  useGetServicesQuery,
} from "../../state/api/reducer";
import { useFormik } from "formik";
import { editOptionValidation } from "../../validation";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { LoadingScreen } from "@components";
import { changeColor } from "@utils";
import { BackIcon } from "@helpers";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useIsFocused } from "@react-navigation/native";

export default function ({ route }) {
  const { id } = route.params;
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const { data, isLoading, refetch } = useGetOptionByIdQuery(id);
  useEffect(() => {
    const fetchData = async () => {
      if (isFocused) refetch();
    };
    fetchData();
  }, [isFocused]);

  const option = data?.details;

  const [updateOption] = useUpdateOptionMutation();
  const { data: services, isLoading: serviceLoading } = useGetServicesQuery();

  const { backgroundColor, textColor, colorScheme } = changeColor();
  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#212B36";
  const borderColor =
    colorScheme === "dark" ? "border-neutral-light" : "border-neutral-dark";
  const [selectedImages, setSelectedImages] = useState([]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      option_name: option?.option_name || "",
      description: option?.description || "",
      extraFee: option?.extraFee || "",
      service: option?.service?.map((service) => service._id) || [],
    },

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
      formData.append("option_name", values?.option_name);
      formData.append("description", values?.description);
      formData.append("extraFee", values?.extraFee);
      if (Array.isArray(values?.service)) {
        values.service.forEach((item) => formData.append("service[]", item));
      } else formData.append("service", values?.service);
      updateOption({ id: option?._id, payload: formData })
        .unwrap()
        .then((response) => {
          refetch();
          Toast.show({
            type: "success",
            position: "top",
            text1: "Option Details Successfully Updated",
            text2: `${response?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
          setSelectedImages([]);
          navigation.navigate("Option");
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Updating Option Details",
            text2: `${error?.data?.error?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
        });
    },
  });

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

  const handleServicePress = (serviceId) => {
    let updatedSelectedServices;
    if (formik.values.service.includes(serviceId)) {
      updatedSelectedServices = [];
    } else updatedSelectedServices = [serviceId];

    formik.setFieldValue("service", updatedSelectedServices);
  };

  return (
    <>
      {isLoading || serviceLoading ? (
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
                  <View className="pb-2">
                    <Text
                      style={{ color: textColor }}
                      className={`font-semibold text-center pb-4 text-3xl`}
                    >
                      Edit Add Ons Details
                    </Text>

                    <TextInput
                      style={{ color: textColor }}
                      className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                      placeholder="Enter your option name"
                      placeholderTextColor={textColor}
                      autoCapitalize="none"
                      onChangeText={formik.handleChange("option_name")}
                      onBlur={formik.handleBlur("option_name")}
                      value={formik.values.option_name}
                    />
                    {formik.touched.option_name &&
                      formik.errors.option_name && (
                        <Text style={{ color: "red" }}>
                          {formik.errors.option_name}
                        </Text>
                      )}

                    <TextInput
                      style={{ color: textColor }}
                      className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                      placeholder="Enter price"
                      placeholderTextColor={textColor}
                      keyboardType="numeric"
                      onChangeText={(value) =>
                        formik.handleChange("extraFee")(value.toString())
                      }
                      onBlur={formik.handleBlur("extraFee")}
                      value={formik.values.extraFee.toString()}
                    />
                    {formik.touched.extraFee && formik.errors.extraFee && (
                      <Text style={{ color: "red" }}>
                        {formik.errors.extraFee}
                      </Text>
                    )}

                    <Text
                      style={{ color: textColor }}
                      className={`${borderColor} font-semibold text-xl`}
                    >
                      Services
                    </Text>

                    <View className="flex flex-row flex-wrap justify-start gap-x-4">
                      {services?.details?.map((service) => (
                        <TouchableOpacity
                          key={service._id}
                          onPress={() => handleServicePress(service._id)}
                          className="flex-row py-2 gap-x-2"
                        >
                          <View
                            style={{
                              height: 20,
                              width: 20,
                              borderRadius: 10,
                              borderWidth: 2,
                              borderColor: formik.values.service.includes(
                                service._id
                              )
                                ? invertBackgroundColor
                                : backgroundColor,
                              backgroundColor: formik.values.service.includes(
                                service._id
                              )
                                ? backgroundColor
                                : invertBackgroundColor,
                            }}
                          >
                            {formik.values.service.includes(service._id) && (
                              <View
                                style={{
                                  height: 10,
                                  width: 10,
                                  borderRadius: 5,
                                  backgroundColor: textColor,
                                  alignSelf: "center",
                                  justifySelf: "center",
                                  marginTop: 2,
                                }}
                              />
                            )}
                          </View>
                          <Text
                            style={{ color: textColor }}
                            className="text-lg font-semibold"
                          >
                            {service.service_name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <TextInput
                      style={{
                        color: textColor,
                        height: 100,
                        textAlignVertical: "top",
                      }}
                      className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-lg my-2 ${borderColor}`}
                      placeholder="Enter a description"
                      placeholderTextColor={textColor}
                      autoCapitalize="none"
                      multiline={true}
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
                      className={`${borderColor} font-semibold text-xl`}
                    >
                      Add Your Image
                    </Text>
                    <View className={`flex-row gap-x-2 mt-2 mb-6`}>
                      <TouchableOpacity onPress={takePicture}>
                        <Text
                          style={{ color: textColor }}
                          className={`text-base ${borderColor}`}
                        >
                          Take a Picture
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={selectImages}>
                        <Text
                          style={{ color: textColor }}
                          className={`text-base ${borderColor}`}
                        >
                          Select Images
                        </Text>
                      </TouchableOpacity>
                      {selectedImages?.length > 0 ? (
                        <Text
                          style={{ color: textColor }}
                          className={`text-base ${borderColor}`}
                        >
                          Add {selectedImages.length} image
                          {selectedImages.length > 1 ? "s" : ""}
                        </Text>
                      ) : (
                        <Text
                          style={{ color: textColor }}
                          className={`text-base ${borderColor}`}
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
                        <View className={`my-4 w-full`}>
                          <View
                            className={`py-2 rounded-lg bg-primary-accent mx-20 ${
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
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            </SafeAreaView>
          </TouchableWithoutFeedback>
        </>
      )}
    </>
  );
}
