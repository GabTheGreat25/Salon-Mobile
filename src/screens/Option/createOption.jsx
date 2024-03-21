import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { changeColor } from "@utils";
import { BackIcon } from "@helpers";
import { useNavigation } from "@react-navigation/native";
import { LoadingScreen } from "@components";
import { useFormik } from "formik";
import {
  useAddOptionMutation,
  useGetServicesQuery,
} from "../../state/api/reducer";
import { createOptionValidation } from "../../validation";
import Toast from "react-native-toast-message";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";

export default function () {
  const navigation = useNavigation();
  const { backgroundColor, textColor, colorScheme } = changeColor();

  const borderColor =
    colorScheme === "dark" ? "border-neutral-light" : "border-neutral-dark";
  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#212B36";
  const [addOption, { isLoading }] = useAddOptionMutation();
  const { data: services, isLoading: serviceLoading } = useGetServicesQuery();
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  const formik = useFormik({
    initialValues: {
      option_name: "",
      description: "",
      extraFee: "",
      service: [],
    },
    validationSchema: createOptionValidation,
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
      addOption(formData)
        .unwrap()
        .then((response) => {
          navigation.navigate("Option");
          setSelectedImages([]);
          formik.resetForm();
          Toast.show({
            type: "success",
            position: "top",
            text1: "Option Successfully Created",
            text2: `${response?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Creating Option",
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
    formik.setFieldValue(
      "service",
      formik.values.service === serviceId ? null : serviceId
    );

    const updatedSelectedServices =
      formik.values.service === serviceId
        ? selectedServices.filter((id) => id !== serviceId)
        : [...selectedServices, serviceId];

    setSelectedServices(updatedSelectedServices);
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
              <View className={`flex-1 pb-2`}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  decelerationRate="fast"
                  scrollEventThrottle={1}
                  className={`px-6`}
                >
                  <Text
                    style={{ color: textColor }}
                    className={`pb-4 font-semibold text-center text-3xl`}
                  >
                    Create Option
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
                  {formik.touched.option_name && formik.errors.option_name && (
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
                    onChangeText={formik.handleChange("extraFee")}
                    onBlur={formik.handleBlur("extraFee")}
                    value={formik.values.extraFee}
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
                            borderColor:
                              formik.values.service === service._id
                                ? invertBackgroundColor
                                : backgroundColor,
                            backgroundColor:
                              formik.values.service === service._id
                                ? backgroundColor
                                : invertBackgroundColor,
                          }}
                        >
                          {formik.values.service === service._id && (
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
                  {formik.touched.description && formik.errors.description && (
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

                  <View className={`my-4 items-center justify-center flex-col`}>
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
              </View>
            </SafeAreaView>
          </TouchableWithoutFeedback>
        </>
      )}
    </>
  );
}
