import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
} from "react-native";
import { changeColor } from "@utils";
import { BackIcon } from "@helpers";
import { useNavigation } from "@react-navigation/native";
import { LoadingScreen } from "@components";
import { Feather } from "@expo/vector-icons";
import { useFormik } from "formik";
import {
  useAddUserMutation,
  useGetHiringsQuery,
} from "../../state/api/reducer";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { createBeauticianValidation } from "../../validation";
import Toast from "react-native-toast-message";
import { Picker } from "@react-native-picker/picker";
import { TextInputMask } from "react-native-masked-text";
import { employeeSlice } from "../../state/auth/employeeReducer";
import { useSelector, useDispatch } from "react-redux";

export default function () {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { data } = useGetHiringsQuery();
  const hiring = data?.details[0];
  const { backgroundColor, textColor, borderColor } = changeColor();

  const [selectedImages, setSelectedImages] = useState([]);
  const [addUser, { isLoading }] = useAddUserMutation();

  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisibility] =
    useState(false);
  const formikValues = useSelector((state) => state.employee.formData);

  const formik = useFormik({
    initialValues: {
      name: formikValues?.name || "",
      age: formikValues?.age || "",
      contact_number: formikValues?.contact_number || "",
      email: formikValues?.email || "",
      password: formikValues?.password || "",
      confirmPassword: formikValues?.confirmPassword || "",
      roles: "Beautician",
      job_type: formikValues?.job_type || "",
      date: hiring?.date,
      time: hiring?.time,
    },
    validationSchema: createBeauticianValidation,
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
      formData.append("name", values.name);
      formData.append("age", values.age);
      formData.append("contact_number", values.contact_number);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("roles", values.roles);
      formData.append("job_type", values.job_type);
      formData.append("date", values?.date);
      formData.append("time", values?.time);

      addUser(formData)
        .unwrap()
        .then((response) => {
          setSelectedImages([]);
          dispatch(employeeSlice.actions.clearFormData());
          navigation.navigate("LoginUser");
          formik.resetForm();
          Toast.show({
            type: "success",
            position: "top",
            text1: "Beautician Successfully Created",
            text2: `${response?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Creating Beautician",
            text2: `${error?.data?.error?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
        });
    },
  });

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisibility(!isConfirmPasswordVisible);
  };

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

  const handlePhoneNumberChange = (event) => {
    let phoneNumber = event.nativeEvent.text.replace(/[-\s]/g, "");
    phoneNumber = phoneNumber.substring(0, 11);
    formik.setFieldValue("contact_number", phoneNumber);
  };

  const [termsAgreed, setTermsAgreed] = useState(false);

  const handleTermsAgreementChange = () => {
    setTermsAgreed(!termsAgreed);
  };

  const handleTermsAndConditions = () => {
    dispatch(employeeSlice.actions.updateFormData(formik.values));
    navigation.navigate("BeauticianRegisterTermsCondition");
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
            className={`relative flex-1 pt-12`}
          >
            <BackIcon navigateBack={navigation.goBack} textColor={textColor} />
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
                  Sign up as Beautician
                </Text>
                <Text
                  style={{ color: textColor }}
                  className={`mb-2 text-lg font-base text-center`}
                >
                  The date of the initial interview will be exactly on{" "}
                  {new Date(hiring?.date).toISOString().split("T")[0]} at{" "}
                  {hiring?.time}.
                </Text>

                <View>
                  <Text
                    style={{ color: textColor }}
                    className={`text-center font-semibold text-xl mb-2`}
                  >
                    Things you need to bring during the interview:
                  </Text>
                  <View className={`mb-2`}>
                    <Text style={{ color: textColor }} className={`text-base`}>
                      <Text
                        style={{ color: textColor }}
                        className={`font-semibold`}
                      >
                        Resume:
                      </Text>{" "}
                      Updated with your contact information, education, and
                      relevant work experience.
                    </Text>
                  </View>
                  <View className={`mb-2`}>
                    <Text style={{ color: textColor }} className={`text-base`}>
                      <Text
                        style={{ color: textColor }}
                        className={`font-semibold`}
                      >
                        Work Samples:
                      </Text>{" "}
                      Showcase your work, including photos of hairstyles,
                      makeovers, or any beauty services you've provided.
                    </Text>
                  </View>
                  <View className={`mb-2`}>
                    <Text style={{ color: textColor }} className={`text-base`}>
                      <Text
                        style={{ color: textColor }}
                        className={`font-semibold`}
                      >
                        Identification:
                      </Text>{" "}
                      Valid government-issued photo ID (driver's license,
                      passport, etc.).
                    </Text>
                  </View>
                </View>

                <TextInput
                  style={{ color: textColor, borderColor }}
                  className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-full my-2`}
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

                <TextInput
                  style={{ color: textColor, borderColor }}
                  className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-full my-2`}
                  placeholder="Enter age"
                  placeholderTextColor={textColor}
                  keyboardType="numeric"
                  onChangeText={formik.handleChange("age")}
                  onBlur={formik.handleBlur("age")}
                  value={formik.values.age}
                />
                {formik.touched.age && formik.errors.age && (
                  <Text style={{ color: "red" }}>{formik.errors.age}</Text>
                )}

                <TextInput
                  style={{ color: textColor, borderColor }}
                  className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-full my-2`}
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

                <TextInputMask
                  style={{ color: textColor, borderColor }}
                  type={"custom"}
                  options={{
                    mask: "9999 - 999 - 9999",
                  }}
                  className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-full my-2`}
                  placeholder="09XX - XXX - XXXX"
                  placeholderTextColor={textColor}
                  autoCapitalize="none"
                  onChange={handlePhoneNumberChange}
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

                <View className={`relative`}>
                  <TextInput
                    style={{ color: textColor, borderColor }}
                    className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-full my-2`}
                    placeholder="Enter your password"
                    placeholderTextColor={textColor}
                    autoCapitalize="none"
                    onChangeText={formik.handleChange("password")}
                    onBlur={formik.handleBlur("password")}
                    value={formik.values.password}
                    secureTextEntry={!isPasswordVisible}
                  />
                  <TouchableOpacity
                    className={`absolute right-4 top-5`}
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
                  <Text style={{ color: "red" }} className={`mb-3`}>
                    {formik.errors.password}
                  </Text>
                )}

                <View className={`relative`}>
                  <TextInput
                    style={{ color: textColor, borderColor }}
                    className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-full my-2`}
                    placeholder="Confirm your password"
                    placeholderTextColor={textColor}
                    autoCapitalize="none"
                    onChangeText={formik.handleChange("confirmPassword")}
                    onBlur={formik.handleBlur("confirmPassword")}
                    value={formik.values.confirmPassword}
                    secureTextEntry={!isConfirmPasswordVisible}
                  />
                  <TouchableOpacity
                    className={`absolute right-4 top-5`}
                    onPress={toggleConfirmPasswordVisibility}
                  >
                    <Feather
                      name={isConfirmPasswordVisible ? "eye" : "eye-off"}
                      size={24}
                      color={textColor}
                    />
                  </TouchableOpacity>
                </View>
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <Text style={{ color: "red" }} className={`mb-3`}>
                      {formik.errors.confirmPassword}
                    </Text>
                  )}

                <View
                  style={{ borderColor }}
                  className={`border-[1.5px]  font-normal rounded-full my-3`}
                >
                  <Picker
                    selectedValue={formik.values.job_type}
                    style={{ color: textColor }}
                    dropdownIconColor={textColor}
                    onValueChange={(itemValue) =>
                      formik.setFieldValue("job_type", itemValue)
                    }
                  >
                    <Picker.Item label="Select Job Type" value="" />
                    <Picker.Item label="Hands" value="Hands" />
                    <Picker.Item label="Hair" value="Hair" />
                    <Picker.Item label="Feet" value="Feet" />
                    <Picker.Item label="Facial" value="Facial" />
                    <Picker.Item label="Body" value="Body" />
                    <Picker.Item label="Eyelash" value="Eyelash" />
                  </Picker>
                </View>
                {formik.touched.job_type && formik.errors.job_type && (
                  <Text style={{ color: "red" }}>{formik.errors.job_type}</Text>
                )}

                <Text
                  style={{ color: textColor, borderColor }}
                  className={`font-semibold text-xl`}
                >
                  Add Your Image
                </Text>
                <View className={`flex-row gap-x-2 mt-2 mb-6`}>
                  <TouchableOpacity onPress={takePicture}>
                    <Text
                      style={{ color: textColor, borderColor }}
                      className={`text-base`}
                    >
                      Take a Picture
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={selectImages}>
                    <Text
                      style={{ color: textColor, borderColor }}
                      className={`text-base`}
                    >
                      Select Images
                    </Text>
                  </TouchableOpacity>
                  {selectedImages?.length > 0 ? (
                    <Text
                      style={{ color: textColor, borderColor }}
                      className={`text-base`}
                    >
                      Add {selectedImages.length} image
                      {selectedImages.length > 1 ? "s" : ""}
                    </Text>
                  ) : (
                    <Text
                      style={{ color: textColor, borderColor }}
                      className={`text-base`}
                    >
                      No Image
                    </Text>
                  )}
                </View>

                <Text
                  style={{ color: textColor, borderColor }}
                  className={`font-semibold text-xl`}
                >
                  Terms & Conditions
                </Text>
                <Text
                  style={{ color: textColor, borderColor }}
                  className={`font-semibold text-base pb-2`}
                >
                  By registering as a beautician on our platform, you
                  acknowledge and agree to the following terms and conditions.
                </Text>

                <View className={`flex flex-row`}>
                  <TouchableOpacity
                    onPress={() => handleTermsAgreementChange()}
                    className={`flex-row px-4 py-2`}
                  >
                    <View
                      style={{
                        height: 35,
                        width: 35,
                        borderColor,
                        backgroundColor,
                      }}
                      className={`flex-row justify-center items-center border-2 rounded mr-2 mt-2`}
                    >
                      {termsAgreed && (
                        <Text
                          style={{ color: textColor }}
                          className={`text-2xl`}
                        >
                          ✓
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                  <View className={`pt-2 pb-6`}>
                    <Text
                      style={{ color: textColor }}
                      className={`text-base font-semibold`}
                    >
                      {`I agree with Lhanlee Beauty Lounge\n`}
                      <Text
                        className={`text-base font-semibold underline text-primary-accent`}
                        onPress={handleTermsAndConditions}
                      >
                        terms & conditions
                      </Text>
                    </Text>
                  </View>
                </View>

                <View className={`mt-4 items-center justify-start`}>
                  <TouchableOpacity
                    onPress={(e) => {
                      e.preventDefault();
                      if (!termsAgreed) {
                        Toast.show({
                          type: "error",
                          position: "top",
                          text1: "Error Creating Beautician",
                          text2:
                            "Please agree to the Lhanlee Beauty Lounge Terms and conditions.",
                          visibilityTime: 3000,
                          autoHide: true,
                        });
                        return;
                      }
                      formik.handleSubmit(e);
                    }}
                    disabled={!formik.isValid}
                  >
                    <View className={`w-full mb-2`}>
                      <View
                        className={`py-2 px-6 rounded-lg bg-primary-accent ${
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
                      className={`text-base font-semibold`}
                    >
                      Already have an account?
                    </Text>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("LoginUser")}
                    >
                      <Text
                        className={`text-primary-accent text-base font-semibold`}
                      >
                        Log in here
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      )}
    </>
  );
}
