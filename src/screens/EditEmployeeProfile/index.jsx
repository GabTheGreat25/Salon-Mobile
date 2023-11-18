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
import { useUpdateUserMutation } from "../../state/api/reducer";
import { useFormik } from "formik";
import { editUserInformationValidation } from "../../validation";
import { useNavigation } from "@react-navigation/native";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import { LoadingScreen } from "@components";
import { dimensionLayout, changeColor } from "@utils";
import { useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";

export default function () {
  const auth = useSelector((state) => state.auth);
  console.log(auth);
  const navigation = useNavigation();

  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const isDimensionLayout = dimensionLayout();
  const { backgroundColor, textColor, colorScheme } = changeColor();
  const borderColor =
    colorScheme === "dark" ? "border-neutral-light" : "border-neutral-dark";
  const [selectedImages, setSelectedImages] = useState([]);

  const scroll = 485;

  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(scroll);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: auth?.user?.name || "",
      email: auth?.user?.email || "",
      contact_number: auth?.user?.contact_number || "",
    },
    validationSchema: editUserInformationValidation,
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

      formData.append("email", values.email);
      formData.append("name", values.name);
      formData.append("contact_number", values.contact_number);

      updateUser({ id: auth?.user?._id, payload: formData })
        .unwrap()
        .then((response) => {
          Toast.show({
            type: "success",
            position: "top",
            text1: "Employee Details Successfully Updated",
            text2: `${response?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
          navigation.navigate("EmployeeDashboard");
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Updating Employee Details",
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

  const handleUpdatePassword = () => {
    navigation.navigate("UpdateUserPassword");
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
            <View
              className={`justify-start ${
                isDimensionLayout
                  ? "mt-3 flex-col items-center"
                  : "flex-row items-start"
              }`}
            >
              <Image
                source={{
                  uri: auth?.user?.image[0]?.url,
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
                  Update Your Details
                </Text>
                <KeyboardAvoidingView
                  behavior="padding"
                  className={`${
                    isDimensionLayout ? "h-[450px] w-[300px]" : "w-[375px]"
                  }`}
                >
                  <ScrollView
                    contentContainerStyle={{ height: scrollViewHeight }}
                    showsVerticalScrollIndicator={scrollViewHeight > 435}
                    scrollEnabled={scrollViewHeight > 435}
                    decelerationRate="fast"
                    scrollEventThrottle={1}
                  >
                    <Text
                      style={{ color: textColor }}
                      className={`font-semibold text-base`}
                    >
                      Name
                    </Text>
                    <TextInput
                      style={{ color: textColor }}
                      className={`border-b ${
                        isDimensionLayout ? "mb-4" : "mb-3"
                      } ${borderColor}`}
                      placeholder="Enter your name"
                      placeholderTextColor={textColor}
                      autoCapitalize="none"
                      handleTextInputFocus={handleTextInputFocus}
                      onChangeText={formik.handleChange("name")}
                      onBlur={formik.handleBlur("name")}
                      value={formik.values.name}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <Text style={{ color: "red" }}>{formik.errors.name}</Text>
                    )}
                    <Text
                      style={{ color: textColor }}
                      className={`font-semibold text-base`}
                    >
                      Email
                    </Text>
                    <TextInput
                      style={{ color: textColor }}
                      className={`border-b ${
                        isDimensionLayout ? "mb-4" : "mb-3"
                      } ${borderColor}`}
                      placeholder="Enter your email"
                      placeholderTextColor={textColor}
                      autoCapitalize="none"
                      handleTextInputFocus={handleTextInputFocus}
                      onChangeText={formik.handleChange("email")}
                      onBlur={formik.handleBlur("email")}
                      value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <Text style={{ color: "red" }}>
                        {formik.errors.email}
                      </Text>
                    )}
                    <Text
                      style={{ color: textColor }}
                      className={`font-semibold text-base`}
                    >
                      Contact Number
                    </Text>
                    <TextInput
                      style={{ color: textColor }}
                      className={`border-b ${
                        dimensionLayout ? "mb-4" : "mb-3"
                      } ${borderColor}`}
                      placeholder="Enter your contact number"
                      placeholderTextColor={textColor}
                      autoCapitalize="none"
                      handleTextInputFocus={handleTextInputFocus}
                      onChangeText={formik.handleChange("contact_number")}
                      onBlur={formik.handleBlur("contact_number")}
                      value={formik.values.contact_number}
                      keyboardType="numeric"
                    />
                    {formik.touched.contact_number &&
                      formik.errors.contact_number && (
                        <Text style={{ color: "red" }}>
                          {formik.errors.contact_number}
                        </Text>
                      )}
                    <Text
                      style={{ color: textColor }}
                      className={`${borderColor} font-semibold text-base`}
                    >
                      Update Your Image
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
                      <TouchableOpacity
                        onPress={handleUpdatePassword}
                        className={`border border-solid mb-2 rounded-lg ${
                          isDimensionLayout ? "mx-10 mt-12" : "mx-20 mt-6"
                        }`}
                        style={{ borderColor: textColor }}
                      >
                        <View
                          className={`flex justify-center items-center flex-row gap-x-4 py-2`}
                        >
                          <Feather name="key" size={30} color={textColor} />
                          <Text
                            className={`text-lg font-base`}
                            style={{ color: textColor }}
                          >
                            Change Password
                          </Text>
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
