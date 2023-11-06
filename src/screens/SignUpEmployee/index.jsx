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
import { changeColor } from "@utils";
import { BackIcon } from "@helpers";
import { useNavigation } from "@react-navigation/native";
import salonLogo from "@assets/salon-logo.png";
import salonLogoWhite from "@assets/salon-logo-white.png";
import { LoadingScreen } from "@components";
import { dimensionLayout } from "@utils";
import { Feather } from "@expo/vector-icons";
import { useFormik } from "formik";
import { useAddUserMutation } from "../../state/api/reducer";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { createEmployeeValidation } from "../../validation";
import Toast from "react-native-toast-message";
import { Picker } from "@react-native-picker/picker";

export default function () {
  const navigation = useNavigation();
  const isDimensionLayout = dimensionLayout();
  const { backgroundColor, textColor, colorScheme } = changeColor();
  const imageSource = colorScheme === "dark" ? salonLogoWhite : salonLogo;
  const borderColor =
    colorScheme === "dark" ? "border-neutral-light" : "border-neutral-dark";
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [addUser, { isLoading }] = useAddUserMutation();

  const scroll = isDimensionLayout ? 575 : 500;

  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(scroll);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      roles: "Employee",
      contact_number: "",
      job: "",
    },
    validationSchema: createEmployeeValidation,
    onSubmit: async (values) => {
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
      if (selectedDocs.length > 0) {
        selectedDocs.forEach((docs, index) => {
          const docsName = docs.uri.split("/").pop();
          const docsType = "image/" + docsName.split(".").pop();

          formData.append("image", {
            uri: docs.uri,
            name: docsName,
            type: docsType,
          });
        });
      }
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("roles", values.roles);
      formData.append("name", values.name);
      formData.append("contact_number", values.contact_number);
      formData.append("job", values.job);

      try {
        const response = await addUser(formData).unwrap();
        navigation.navigate("Home");
        formik.resetForm();
        Toast.show({
          type: "success",
          position: "top",
          text1: "Employee Successfully Created",
          text2: `${response?.message}`,
          visibilityTime: 3000,
          autoHide: true,
        });
      } catch (error) {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Error Creating Employee",
          text2: `${error?.data?.error?.message}`,
          visibilityTime: 3000,
          autoHide: true,
        });
      }
    },
  });

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!isPasswordVisible);
  };

  const handleTextInputFocus = () => {
    setScrollViewHeight(keyboardOpen ? 650 : scroll);
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
        setScrollViewHeight(650);
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

  const selectDocs = async () => {
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

      const newDocs = [];

      for (const selectedAsset of selectedAssets) {
        try {
          const manipulatedDoc = await ImageManipulator.manipulateAsync(
            selectedAsset.uri,
            [],
            manipulatorOptions
          );

          if (manipulatedDoc) {
            newDocs.push(manipulatedDoc);
          }
        } catch (error) {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Adding Docs",
            text2: `${error}`,
            visibilityTime: 3000,
            autoHide: true,
          });
        }
      }

      setSelectedDocs(newDocs);
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
              className={`justify-start ${
                isDimensionLayout
                  ? "flex-col items-center"
                  : "flex-row items-start"
              }`}
            >
              <Image
                source={imageSource}
                className={`${
                  isDimensionLayout
                    ? "w-[60%] h-[60%]"
                    : "ml-5 mt-16 w-[40%] h-[55%]"
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
                  Sign up as Employee
                </Text>
                <Text
                  style={{ color: textColor }}
                  className={`mb-2 text-sm font-base text-center`}
                >
                  Create your account
                </Text>
                <KeyboardAvoidingView
                  behavior="padding"
                  className={`${
                    isDimensionLayout ? "h-[450px] w-[300px]" : "w-[375px]"
                  }`}
                >
                  <ScrollView
                    contentContainerStyle={{ height: scrollViewHeight }}
                    showsVerticalScrollIndicator={scrollViewHeight > 550}
                    scrollEnabled={scrollViewHeight > 550}
                  >
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
                    <View className={`relative`}>
                      <TextInput
                        style={{ color: textColor }}
                        className={`border-b ${
                          isDimensionLayout ? "mb-4" : "mb-3"
                        } ${borderColor}`}
                        placeholder="Enter your password"
                        placeholderTextColor={textColor}
                        autoCapitalize="none"
                        handleTextInputFocus={handleTextInputFocus}
                        onChangeText={formik.handleChange("password")}
                        onBlur={formik.handleBlur("password")}
                        value={formik.values.password}
                        secureTextEntry={!isPasswordVisible}
                      />
                      <TouchableOpacity
                        className={`absolute right-4`}
                        onPress={togglePasswordVisibility}
                      >
                        <Feather
                          name={isPasswordVisible ? "eye" : "eye-off"}
                          size={24}
                          color={textColor}
                        />
                      </TouchableOpacity>
                    </View>
                    {formik.touched.password && formik.errors.password && (
                      <Text style={{ color: "red" }}>
                        {formik.errors.password}
                      </Text>
                    )}
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
                    <Picker
                      selectedValue={formik.values.job}
                      style={{ color: textColor }}
                      dropdownIconColor={textColor}
                      onValueChange={(itemValue, itemIndex) =>
                        formik.setFieldValue("job", itemValue)
                      }
                    >
                      <Picker.Item label="Select Job" value="" />
                      <Picker.Item label="Stylist" value="Stylist" />
                      <Picker.Item label="Barber" value="Barber" />
                      <Picker.Item
                        label="Nail technician"
                        value="Nail technician"
                      />
                      <Picker.Item label="Receptionist" value="Receptionist" />
                    </Picker>
                    {formik.touched.job && formik.errors.job && (
                      <Text style={{ color: "red" }}>{formik.errors.job}</Text>
                    )}
                    <Text
                      style={{ color: textColor }}
                      className={`${borderColor} font-semibold text-base`}
                    >
                      Add Your Documents (Image Only)
                    </Text>
                    <View className={`flex-row gap-x-2 mt-1 mb-5`}>
                      <TouchableOpacity onPress={selectDocs}>
                        <Text
                          style={{ color: textColor }}
                          className={`${borderColor}`}
                        >
                          Select Docs
                        </Text>
                      </TouchableOpacity>
                      {selectedDocs?.length > 0 ? (
                        <Text
                          style={{ color: textColor }}
                          className={`${borderColor}`}
                        >
                          Add {selectedDocs.length} document
                          {selectedDocs.length > 1 ? "s" : ""}
                        </Text>
                      ) : (
                        <Text
                          style={{ color: textColor }}
                          className={`${borderColor}`}
                        >
                          No Document
                        </Text>
                      )}
                    </View>
                    <View
                      className={`items-center justify-start ${
                        isDimensionLayout ? "flex-col" : "flex-row gap-x-2"
                      }`}
                    >
                      <TouchableOpacity
                        onPress={formik.handleSubmit}
                        disabled={!formik.isValid}
                      >
                        <View className={`w-full mb-2`}>
                          <View
                            className={`py-2 px-6 rounded-lg bg-primary-accent ${
                              isDimensionLayout
                                ? "flex-col"
                                : "flex-row gap-x-2"
                            } ${
                              !formik.isValid ? "opacity-50" : "opacity-100"
                            }`}
                          >
                            <Text
                              className={`font-semibold text-center text-lg`}
                              style={{ color: textColor }}
                            >
                              Sign up
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                      <View className={`gap-x-2 flex-row`}>
                        <Text
                          style={{ color: textColor }}
                          className={`text-base`}
                        >
                          Already have an account?
                        </Text>
                        <TouchableOpacity
                          onPress={() => navigation.navigate("LoginUser")}
                        >
                          <Text className={`text-primary-accent text-base`}>
                            Sign in
                          </Text>
                        </TouchableOpacity>
                      </View>
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
