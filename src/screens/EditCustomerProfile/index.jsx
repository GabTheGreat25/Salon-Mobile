import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
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
import { changeColor } from "@utils";
import { useSelector } from "react-redux";
import { TextInputMask } from "react-native-masked-text";

export default function () {
  const auth = useSelector((state) => state.auth);
  const navigation = useNavigation();

  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const { backgroundColor, textColor, colorScheme } = changeColor();
  const borderColor =
    colorScheme === "dark" ? "border-neutral-light" : "border-neutral-dark";
  const [selectedImages, setSelectedImages] = useState([]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: auth?.user?.name || "",
      email: auth?.user?.email || "",
      contact_number: auth?.user?.contact_number || "",
      description: auth?.user?.information?.description || "",
      allergy: auth?.user?.information?.allergy || "",
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
      formData.append("description", values.description);
      formData.append("allergy", values.allergy);

      updateUser({ id: auth?.user?._id, payload: formData })
        .unwrap()
        .then((response) => {
          Toast.show({
            type: "success",
            position: "top",
            text1: "Customer Details Successfully Updated",
            text2: `${response?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
          setSelectedImages([]);
          navigation.navigate("CustomerDashboard");
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Updating Customer Details",
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
        <>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView
              style={{ backgroundColor }}
              className={`relative flex-1 justify-start pt-12`}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                decelerationRate="fast"
                scrollEventThrottle={1}
                className={`px-6`}
              >
                <View className={`pb-2`}>
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-center pb-4 text-3xl`}
                  >
                    Update Your Details
                  </Text>

                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-xl`}
                  >
                    Name
                  </Text>
                  <TextInput
                    style={{ color: textColor }}
                    className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                    placeholder="Enter your name"
                    placeholderTextColor={textColor}
                    autoCapitalize="none"
                    onChangeText={formik.handleChange("name")}
                    onBlur={formik.handleBlur("name")}
                    value={formik.values.name}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <Text style={{ color: "red" }}>{formik.errors.name}</Text>
                  )}
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-xl`}
                  >
                    Age
                  </Text>
                  <TextInput
                    style={{ color: textColor }}
                    className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                    placeholder="Enter your age"
                    placeholderTextColor={textColor}
                    autoCapitalize="none"
                    onChangeText={(value) =>
                      formik.handleChange("age")(value.toString())
                    }
                    onBlur={formik.handleBlur("age")}
                    value={formik.values.age.toString()}
                    keyboardType="numeric"
                  />
                  {formik.touched.age && formik.errors.age && (
                    <Text style={{ color: "red" }}>{formik.errors.age}</Text>
                  )}

                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-xl`}
                  >
                    Email
                  </Text>
                  <TextInput
                    style={{ color: textColor }}
                    className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                    placeholder="Enter your email"
                    placeholderTextColor={textColor}
                    autoCapitalize="none"
                    onChangeText={formik.handleChange("email")}
                    onBlur={formik.handleBlur("email")}
                    value={formik.values.email}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <Text style={{ color: "red" }}>{formik.errors.email}</Text>
                  )}
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-xl`}
                  >
                    Mobile Number
                  </Text>
                  <TextInputMask
                    style={{ color: textColor }}
                    type={"custom"}
                    options={{
                      mask: "9999 - 999 - 9999",
                    }}
                    className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                    placeholder="09XX - XXX - XXXX"
                    placeholderTextColor={textColor}
                    autoCapitalize="none"
                    onChangeText={handlePhoneNumberChange}
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
                    className={`${borderColor} font-semibold text-xl`}
                  >
                    Update Your Image
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
                  <View
                    className={`flex-row items-center justify-center gap-x-2`}
                  >
                    <TouchableOpacity
                      onPress={formik.handleSubmit}
                      disabled={!formik.isValid}
                    >
                      <View
                        className={`py-2 px-10 rounded-lg bg-primary-accent ${
                          !formik.isValid ? "opacity-50" : "opacity-100"
                        }`}
                      >
                        <Text
                          className={`font-semibold text-center text-base`}
                          style={{ color: textColor }}
                        >
                          Submit
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleUpdatePassword}>
                      <View
                        className={`border border-solid rounded-lg py-2 px-6`}
                      >
                        <Text
                          className={`font-semibold text-center text-base`}
                          style={{ color: textColor }}
                        >
                          Change Pass
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </SafeAreaView>
          </TouchableWithoutFeedback>
        </>
      )}
    </>
  );
}
