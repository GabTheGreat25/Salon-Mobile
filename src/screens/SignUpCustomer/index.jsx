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
import { useAddUserMutation } from "../../state/api/reducer";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { createCustomerValidation } from "../../validation";
import Toast from "react-native-toast-message";
import { TextInputMask } from "react-native-masked-text";
import { locationSlice } from "../../state/auth/locationReducer";
import { waiverSlice } from "../../state/waiver/waiverReducer";
import { ingredientSlice } from "../../state/ingredient/ingredientReducer";
import { useSelector, useDispatch } from "react-redux";

export default function () {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { backgroundColor, textColor, colorScheme } = changeColor();
  const borderColor =
    colorScheme === "dark" ? "border-neutral-light" : "border-neutral-dark";
  const [selectedImages, setSelectedImages] = useState([]);
  const [addUser, { isLoading }] = useAddUserMutation();

  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisibility] =
    useState(false);
  const waiver = useSelector((state) => state.waiver);
  console.log(waiver);
  const formikValues = useSelector((state) => state.location.formData);

  const formik = useFormik({
    initialValues: {
      name: formikValues?.name || "",
      age: formikValues?.age || "",
      contact_number: formikValues?.contact_number || "",
      email: formikValues?.email || "",
      password: formikValues?.password || "",
      confirmPassword: formikValues?.confirmPassword || "",
      roles: "Customer",
      description: formikValues.description || "",
      allergy: formikValues.allergy || [],
      othersMessage: formikValues.othersMessage || "",
      eSignature: waiver.waiverData.eSignature || "",
    },
    validationSchema: createCustomerValidation,
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
      formData.append("description", values.description);
      values.allergy.forEach((allergy) => {
        let allergyId;
        if (allergy === "Others") {
          allergyId = "Others";
        } else if (allergy === "None") {
          allergyId = "None";
          values.othersMessage = "";
        } else {
          allergyId = allergy?._id;
          values.othersMessage = "";
        }
        formData.append("allergy[]", allergyId);
      });
      formData.append("othersMessage", values.othersMessage);
      formData.append("eSignature", values.eSignature);

      addUser(formData)
        .unwrap()
        .then((response) => {
          setSelectedImages([]);
          dispatch(locationSlice.actions.clearFormData());
          dispatch(ingredientSlice.actions.resetReason());
          dispatch(waiverSlice.actions.resetWaiver());
          navigation.navigate("LoginUser");
          formik.resetForm();
          Toast.show({
            type: "success",
            position: "top",
            text1: "Employee Successfully Created",
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
    dispatch(locationSlice.actions.updateFormData(formik.values));
    navigation.navigate("CustomerTermsCondition");
  };

  const [gender, setGender] = useState("");
  const [hairLength, setHairLength] = useState("");
  const [skinTone, setSkinTone] = useState("");
  const [height, setHeight] = useState("");

  const toggleDescriptionValue = (currentValue, newValue) => {
    let updatedDescription = formik.values.description;
    if (currentValue) {
      updatedDescription = updatedDescription.replace(currentValue, "");
    }
    if (currentValue !== newValue) {
      updatedDescription += newValue;
    }
    formik.setFieldValue("description", updatedDescription);
  };

  const handleGenderChange = (value) => {
    if (!height && !hairLength && !skinTone) {
      toggleDescriptionValue(gender, value);
      setGender(value === gender ? "" : value);
    } else {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Please select Gender first.",
        text2: `You did not select any gender`,
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  };

  const handleHeightChange = (value) => {
    if (gender && !hairLength && !skinTone) {
      toggleDescriptionValue(height, value);
      setHeight(height === value ? "" : value);
    } else {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Please select Height after Gender.",
        text2: `Follow the order of selection.`,
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  };

  const handleHairLengthChange = (value) => {
    if (gender && height && !skinTone) {
      toggleDescriptionValue(hairLength, value);
      setHairLength(hairLength === value ? "" : value);
    } else {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Please select Hair Length after Gender and Height.",
        text2: `Follow the order of selection.`,
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  };

  const handleSkinToneChange = (value) => {
    if (gender && height && hairLength) {
      toggleDescriptionValue(skinTone, value);
      setSkinTone(skinTone === value ? "" : value);
    } else {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Please select Skin Tone after Gender, Height, and Hair Length.",
        text2: `Follow the order of selection.`,
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  };

  const allergies = formik?.values?.allergy;

  const handleWaiver = () => {
    dispatch(locationSlice.actions.updateFormData(formik.values));
    navigation.navigate("Waiver");
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
                  Sign up as Customer
                </Text>
                <Text
                  style={{ color: textColor }}
                  className={`mb-2 text-lg font-base text-center`}
                >
                  Get us some of your information to get a free access to our
                  Lhanlee Beauty Lounge website.
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

                <TextInput
                  style={{ color: textColor }}
                  className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
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
                    style={{ color: textColor }}
                    className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
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
                    style={{ color: textColor }}
                    className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
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

                <TextInput
                  style={{
                    color: textColor,
                    height: 100,
                    textAlignVertical: "top",
                  }}
                  className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-lg my-2 ${borderColor}`}
                  placeholder="Tell us about yourself..."
                  placeholderTextColor={textColor}
                  autoCapitalize="none"
                  multiline={true}
                  onChangeText={formik.handleChange("description")}
                  onBlur={formik.handleBlur("description")}
                  value={formik.values.description}
                  editable={false}
                />
                {formik.touched.description && formik.errors.description && (
                  <Text style={{ color: "red" }}>
                    {formik.errors.description}
                  </Text>
                )}

                <Text
                  style={{ color: textColor }}
                  className={`mb-1 text-lg font-semibold`}
                >
                  Gender
                </Text>
                <View className={`flex-row gap-x-1`}>
                  <TouchableOpacity
                    className={`flex-row pl-2 py-2`}
                    onPress={() => handleGenderChange("Male ")}
                  >
                    <View
                      style={{
                        height: 30,
                        width: 30,
                        borderColor: textColor,
                        backgroundColor,
                      }}
                      className={`flex-row justify-center items-center border-2 rounded mr-2`}
                    >
                      {gender === "Male " && (
                        <Text
                          style={{ color: textColor }}
                          className={`text-xl`}
                        >
                          ✓
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                  <View className={`flex-row justify-center items-start`}>
                    <View className={`pt-2`}>
                      <Text
                        style={{ color: textColor }}
                        className={`text-xl font-semibold`}
                      >
                        Male
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    className={`flex-row pl-2 py-2`}
                    onPress={() => handleGenderChange("Female ")}
                  >
                    <View
                      style={{
                        height: 30,
                        width: 30,
                        borderColor: textColor,
                        backgroundColor,
                      }}
                      className={`flex-row justify-center items-center border-2 rounded mr-2`}
                    >
                      {gender === "Female " && (
                        <Text
                          style={{ color: textColor }}
                          className={`text-xl`}
                        >
                          ✓
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                  <View className={`flex-row justify-center items-start`}>
                    <View className={`pt-2`}>
                      <Text
                        style={{ color: textColor }}
                        className={`text-xl font-semibold`}
                      >
                        Female
                      </Text>
                    </View>
                  </View>
                </View>

                <Text
                  style={{ color: textColor }}
                  className={`mb-1 text-lg font-semibold`}
                >
                  Height
                </Text>
                <View className={`flex-row flex-wrap gap-x-1`}>
                  <TouchableOpacity
                    className={`flex-row pl-2 py-2`}
                    onPress={() => handleHeightChange("Petite ")}
                  >
                    <View
                      style={{
                        height: 30,
                        width: 30,
                        borderColor: textColor,
                        backgroundColor,
                      }}
                      className={`flex-row justify-center items-center border-2 rounded mr-2`}
                    >
                      {height === "Petite " && (
                        <Text
                          style={{ color: textColor }}
                          className={`text-xl`}
                        >
                          ✓
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                  <View className={`flex-row justify-center items-start`}>
                    <View className={`pt-2`}>
                      <Text
                        style={{ color: textColor }}
                        className={`text-xl font-semibold`}
                      >
                        Petite
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    className={`flex-row pl-2 py-2`}
                    onPress={() => handleHeightChange("Average ")}
                  >
                    <View
                      style={{
                        height: 30,
                        width: 30,
                        borderColor: textColor,
                        backgroundColor,
                      }}
                      className={`flex-row justify-center items-center border-2 rounded mr-2`}
                    >
                      {height === "Average " && (
                        <Text
                          style={{ color: textColor }}
                          className={`text-xl`}
                        >
                          ✓
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                  <View className={`flex-row justify-center items-start`}>
                    <View className={`pt-2`}>
                      <Text
                        style={{ color: textColor }}
                        className={`text-xl font-semibold`}
                      >
                        Average
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    className={`flex-row pl-2 py-2`}
                    onPress={() => handleHeightChange("Tall ")}
                  >
                    <View
                      style={{
                        height: 30,
                        width: 30,
                        borderColor: textColor,
                        backgroundColor,
                      }}
                      className={`flex-row justify-center items-center border-2 rounded mr-2`}
                    >
                      {height === "Tall " && (
                        <Text
                          style={{ color: textColor }}
                          className={`text-xl`}
                        >
                          ✓
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                  <View className={`flex-row justify-center items-start`}>
                    <View className={`pt-2`}>
                      <Text
                        style={{ color: textColor }}
                        className={`text-xl font-semibold`}
                      >
                        Tall
                      </Text>
                    </View>
                  </View>
                </View>

                <Text
                  style={{ color: textColor }}
                  className={`mb-1 text-lg font-semibold`}
                >
                  Hair Length
                </Text>
                <View className={`flex-row flex-wrap gap-x-1`}>
                  <TouchableOpacity
                    className={`flex-row pl-2 py-2`}
                    onPress={() => handleHairLengthChange("Long Hair ")}
                  >
                    <View
                      style={{
                        height: 30,
                        width: 30,
                        borderColor: textColor,
                        backgroundColor,
                      }}
                      className={`flex-row justify-center items-center border-2 rounded mr-2`}
                    >
                      {hairLength === "Long Hair " && (
                        <Text
                          style={{ color: textColor }}
                          className={`text-xl`}
                        >
                          ✓
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                  <View className={`flex-row justify-center items-start`}>
                    <View className={`pt-2`}>
                      <Text
                        style={{ color: textColor }}
                        className={`text-xl font-semibold`}
                      >
                        Long
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    className={`flex-row pl-2 py-2`}
                    onPress={() => handleHairLengthChange("Average Hair ")}
                  >
                    <View
                      style={{
                        height: 30,
                        width: 30,
                        borderColor: textColor,
                        backgroundColor,
                      }}
                      className={`flex-row justify-center items-center border-2 rounded mr-2`}
                    >
                      {hairLength === "Average Hair " && (
                        <Text
                          style={{ color: textColor }}
                          className={`text-xl`}
                        >
                          ✓
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                  <View className={`flex-row justify-center items-start`}>
                    <View className={`pt-2`}>
                      <Text
                        style={{ color: textColor }}
                        className={`text-xl font-semibold`}
                      >
                        Average
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    className={`flex-row pl-2 py-2`}
                    onPress={() => handleHairLengthChange("Short Hair ")}
                  >
                    <View
                      style={{
                        height: 30,
                        width: 30,
                        borderColor: textColor,
                        backgroundColor,
                      }}
                      className={`flex-row justify-center items-center border-2 rounded mr-2`}
                    >
                      {hairLength === "Short Hair " && (
                        <Text
                          style={{ color: textColor }}
                          className={`text-xl`}
                        >
                          ✓
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                  <View className={`flex-row justify-center items-start`}>
                    <View className={`pt-2`}>
                      <Text
                        style={{ color: textColor }}
                        className={`text-xl font-semibold`}
                      >
                        Short
                      </Text>
                    </View>
                  </View>
                </View>

                <Text
                  style={{ color: textColor }}
                  className={`mb-1 text-lg font-semibold`}
                >
                  Skin Tone
                </Text>
                <View className={`flex-row flex-wrap gap-x-1`}>
                  <TouchableOpacity
                    className={`flex-row pl-2 py-2`}
                    onPress={() => handleSkinToneChange("Light Skin")}
                  >
                    <View
                      style={{
                        height: 30,
                        width: 30,
                        borderColor: textColor,
                        backgroundColor,
                      }}
                      className={`flex-row justify-center items-center border-2 rounded mr-2`}
                    >
                      {skinTone === "Light Skin" && (
                        <Text
                          style={{ color: textColor }}
                          className={`text-xl`}
                        >
                          ✓
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                  <View className={`flex-row justify-center items-start`}>
                    <View className={`pt-2`}>
                      <Text
                        style={{ color: textColor }}
                        className={`text-xl font-semibold`}
                      >
                        Light
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    className={`flex-row pl-2 py-2`}
                    onPress={() => handleSkinToneChange("Tan Skin")}
                  >
                    <View
                      style={{
                        height: 30,
                        width: 30,
                        borderColor: textColor,
                        backgroundColor,
                      }}
                      className={`flex-row justify-center items-center border-2 rounded mr-2`}
                    >
                      {skinTone === "Tan Skin" && (
                        <Text
                          style={{ color: textColor }}
                          className={`text-xl`}
                        >
                          ✓
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                  <View className={`flex-row justify-center items-start`}>
                    <View className={`pt-2`}>
                      <Text
                        style={{ color: textColor }}
                        className={`text-xl font-semibold`}
                      >
                        Tan
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    className={`flex-row pl-2 py-2`}
                    onPress={() => handleSkinToneChange("Dark Skin")}
                  >
                    <View
                      style={{
                        height: 30,
                        width: 30,
                        borderColor: textColor,
                        backgroundColor,
                      }}
                      className={`flex-row justify-center items-center border-2 rounded mr-2`}
                    >
                      {skinTone === "Dark Skin" && (
                        <Text
                          style={{ color: textColor }}
                          className={`text-xl`}
                        >
                          ✓
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                  <View className={`flex-row justify-center items-start`}>
                    <View className={`pt-2`}>
                      <Text
                        style={{ color: textColor }}
                        className={`text-xl font-semibold`}
                      >
                        Dark
                      </Text>
                    </View>
                  </View>
                </View>

                <View>
                  <Text
                    style={{ color: textColor }}
                    className={`mb-1 text-lg font-semibold`}
                  >
                    Chemical Solution Category
                  </Text>

                  <View className={`flex-row flex-wrap gap-x-1`}>
                    <TouchableOpacity
                      className={`flex-row pl-2 py-2`}
                      onPress={() => {
                        const selectedValue = "None";
                        const updatedSelection = formik.values.allergy.includes(
                          selectedValue
                        )
                          ? formik.values.allergy.filter(
                              (val) => val !== selectedValue
                            )
                          : [...formik.values.allergy, selectedValue];
                        formik.setFieldValue("allergy", updatedSelection);
                      }}
                    >
                      <View
                        style={{
                          height: 30,
                          width: 30,
                          borderColor: textColor,
                          backgroundColor: backgroundColor,
                        }}
                        className={`flex-row justify-center items-center border-2 rounded mr-2`}
                      >
                        {formik.values.allergy.includes("None") && (
                          <Text
                            style={{ color: textColor }}
                            className={`text-xl`}
                          >
                            ✓
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                    <View className={`flex-row justify-center items-start`}>
                      <View className={`pt-2`}>
                        <Text
                          style={{ color: textColor }}
                          className={`text-xl font-semibold`}
                        >
                          None
                        </Text>
                      </View>
                    </View>

                    {!allergies.includes("None") &&
                      !allergies.includes("Others") && (
                        <View className={`flex-row flex-wrap gap-x-2`}>
                          <TouchableOpacity
                            onPress={() => {
                              const updatedAllergy = formik.values.allergy
                                .filter(
                                  (val) => val !== "None" && val !== "Others"
                                )
                                .concat("");
                              formik.setFieldValue("allergy", updatedAllergy);
                              dispatch(
                                locationSlice.actions.updateFormData(
                                  formik.values
                                )
                              );
                              navigation.navigate("Hands");
                            }}
                          >
                            <Text
                              style={{ color: textColor }}
                              className={`text-center text-lg font-semibold`}
                            >
                              Hands
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              const updatedAllergy = formik.values.allergy
                                .filter(
                                  (val) => val !== "None" && val !== "Others"
                                )
                                .concat("");
                              formik.setFieldValue("allergy", updatedAllergy);
                              dispatch(
                                locationSlice.actions.updateFormData(
                                  formik.values
                                )
                              );
                              navigation.navigate("Hair");
                            }}
                          >
                            <Text
                              style={{ color: textColor }}
                              className={`text-center text-lg font-semibold`}
                            >
                              Hair
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              const updatedAllergy = formik.values.allergy
                                .filter(
                                  (val) => val !== "None" && val !== "Others"
                                )
                                .concat("");
                              formik.setFieldValue("allergy", updatedAllergy);
                              dispatch(
                                locationSlice.actions.updateFormData(
                                  formik.values
                                )
                              );
                              navigation.navigate("Feet");
                            }}
                          >
                            <Text
                              style={{ color: textColor }}
                              className={`text-center text-lg font-semibold`}
                            >
                              Feet
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              const updatedAllergy = formik.values.allergy
                                .filter(
                                  (val) => val !== "None" && val !== "Others"
                                )
                                .concat("");
                              formik.setFieldValue("allergy", updatedAllergy);
                              dispatch(
                                locationSlice.actions.updateFormData(
                                  formik.values
                                )
                              );
                              navigation.navigate("Facial");
                            }}
                          >
                            <Text
                              style={{ color: textColor }}
                              className={`text-center text-lg font-semibold`}
                            >
                              Facial
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              const updatedAllergy = formik.values.allergy
                                .filter(
                                  (val) => val !== "None" && val !== "Others"
                                )
                                .concat("");
                              formik.setFieldValue("allergy", updatedAllergy);
                              dispatch(
                                locationSlice.actions.updateFormData(
                                  formik.values
                                )
                              );
                              navigation.navigate("Body");
                            }}
                          >
                            <Text
                              style={{ color: textColor }}
                              className={`text-center text-lg font-semibold`}
                            >
                              Body
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              const updatedAllergy = formik.values.allergy
                                .filter(
                                  (val) => val !== "None" && val !== "Others"
                                )
                                .concat("");
                              formik.setFieldValue("allergy", updatedAllergy);
                              dispatch(
                                locationSlice.actions.updateFormData(
                                  formik.values
                                )
                              );
                              navigation.navigate("Eyelash");
                            }}
                          >
                            <Text
                              style={{ color: textColor }}
                              className={`text-center text-lg font-semibold`}
                            >
                              Eyelash
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}

                    <TouchableOpacity
                      className={`flex-row pl-2 py-2`}
                      onPress={() => {
                        const selectedValue = "Others";
                        const updatedSelection = formik.values.allergy.includes(
                          selectedValue
                        )
                          ? formik.values.allergy.filter(
                              (val) => val !== selectedValue
                            )
                          : [...formik.values.allergy, selectedValue];
                        formik.setFieldValue("allergy", updatedSelection);
                      }}
                    >
                      <View
                        style={{
                          height: 30,
                          width: 30,
                          borderColor: textColor,
                          backgroundColor: backgroundColor,
                        }}
                        className={`flex-row justify-center items-center border-2 rounded mr-2`}
                      >
                        {formik.values.allergy.includes("Others") && (
                          <Text
                            style={{ color: textColor }}
                            className={`text-xl`}
                          >
                            ✓
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                    <View className={`flex-row justify-center items-start`}>
                      <View className={`pt-2`}>
                        <Text
                          style={{ color: textColor }}
                          className={`text-xl font-semibold`}
                        >
                          Others
                        </Text>
                      </View>
                    </View>
                  </View>

                  {formik.values.allergy.includes("Others") && (
                    <View>
                      <Text
                        style={{ color: textColor }}
                        className={`text-xl font-semibold`}
                      >
                        Please specify:{" "}
                      </Text>
                      <TextInput
                        className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                        value={formik.values.othersMessage}
                        onChangeText={formik.handleChange("othersMessage")}
                        onBlur={formik.handleBlur("othersMessage")}
                      />
                    </View>
                  )}
                </View>

                {waiver?.waiverData?.eSignature === "" && (
                  <View className={`items-start justify-start py-2`}>
                    <TouchableOpacity onPress={handleWaiver}>
                      <View className={`w-full mb-2`}>
                        <View
                          className={`py-2 px-6 rounded-lg bg-primary-accent`}
                        >
                          <Text
                            className={`font-semibold text-center text-lg`}
                            style={{ color: textColor }}
                          >
                            Add Waiver
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}

                <Text
                  style={{ color: textColor }}
                  className={`${borderColor} font-semibold text-xl pt-1`}
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

                <Text
                  style={{ color: textColor }}
                  className={`${borderColor} font-semibold text-xl`}
                >
                  Terms & Conditions
                </Text>
                <Text
                  style={{ color: textColor }}
                  className={`${borderColor} font-semibold text-base pb-2`}
                >
                  checking the boxes below, you confirm that you have read and
                  agree to the Salon Appointment Terms and Conditions and
                  understand the non-refundable nature of the reservation fee.
                </Text>

                <View className={`flex flex-row`}>
                  <TouchableOpacity
                    onPress={() => handleTermsAgreementChange()}
                    className={`flex-row px-1 py-2`}
                  >
                    <View
                      style={{
                        height: 35,
                        width: 35,
                        borderColor: textColor,
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
                          text1: "Error Creating Customer",
                          text2:
                            "Please agree to the Lhanlee Beauty Lounge Terms and conditions.",
                          visibilityTime: 3000,
                          autoHide: true,
                        });
                        return;
                      }
                      if (waiver.waiverData.hasWaiver === false) {
                        Toast.show({
                          type: "error",
                          position: "top",
                          text1: "Add Waiver",
                          text2: "A waiver is required to proceed.",
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
