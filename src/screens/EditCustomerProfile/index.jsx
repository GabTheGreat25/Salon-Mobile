import React, { useState, useEffect } from "react";
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
import {
  useUpdateUserMutation,
  useGetExclusionsQuery,
} from "../../state/api/reducer";
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

  const { data, isLoading: exclusionLoading } = useGetExclusionsQuery();
  const exclusions = data?.details;

  const { backgroundColor, textColor, colorScheme } = changeColor();
  const borderColor =
    colorScheme === "dark" ? "border-neutral-light" : "border-neutral-dark";
  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#212B36";
  const [selectedImages, setSelectedImages] = useState([]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: auth?.user?.name || "",
      email: auth?.user?.email || "",
      age: auth?.user?.age || "",
      contact_number: auth?.user?.contact_number || "",
      description: auth?.user?.information?.description || "",
      allergy: auth?.user?.information?.allergy || [],
      othersMessage: auth?.user?.information?.othersMessage || "",
      messageDate: auth?.user?.information?.messageDate || "",
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
      formData.append("age", values.age);
      formData.append("contact_number", values.contact_number);
      formData.append("description", values.description);
      values.allergy.forEach((allergy) => {
        let allergyId;
        if (allergy === "Others") {
          allergyId = "Others";
        } else if (allergy === "None") {
          allergyId = "None";
          values.othersMessage = "";
        } else {
          allergyId = allergy;
          values.othersMessage = "";
        }
        formData.append("allergy[]", allergyId);
      });
      formData.append("othersMessage", values?.othersMessage);
      formData.append("messageDate", values?.messageDate);

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

  const handlePhoneNumberChange = (event) => {
    let phoneNumber = event.nativeEvent.text.replace(/[-\s]/g, "");
    phoneNumber = phoneNumber.substring(0, 11);
    formik.setFieldValue("contact_number", phoneNumber);
  };

  const [gender, setGender] = useState(
    auth?.user?.information?.description &&
      auth?.user?.information?.description.includes("Male")
      ? "Male "
      : auth?.user?.information?.description.includes("Female")
      ? "Female "
      : ""
  );
  const [height, setHeight] = useState(
    auth?.user?.information?.description &&
      auth?.user?.information?.description.includes("Petite")
      ? "Petite "
      : auth?.user?.information?.description.includes("Average")
      ? "Average "
      : auth?.user?.information?.description.includes("Tall")
      ? "Tall "
      : ""
  );
  const [hairLength, setHairLength] = useState(
    auth?.user?.information?.description &&
      auth?.user?.information?.description.includes("Long Hair")
      ? "Long Hair "
      : auth?.user?.information?.description.includes("Standard Hair")
      ? "Standard Hair "
      : auth?.user?.information?.description.includes("Short Hair")
      ? "Short Hair "
      : ""
  );
  const [skinTone, setSkinTone] = useState(
    auth?.user?.information?.description &&
      auth?.user?.information?.description.includes("Light Skin")
      ? "Light Skin"
      : auth?.user?.information?.description.includes("Tan Skin")
      ? "Tan Skin"
      : auth?.user?.information?.description.includes("Dark Skin")
      ? "Dark Skin"
      : ""
  );

  const handleGenderChange = (value) => {
    if (gender === value) {
      toggleDescriptionValue(gender, "");
      setGender("");
    } else if (!height && !hairLength && !skinTone) {
      toggleDescriptionValue(gender, value);
      setGender(value);
    } else if (!gender) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Please deselect other options before changing Gender.",
        text2: `Please deselect all first.`,
        visibilityTime: 3000,
        autoHide: true,
      });
    } else {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Please deselect other options before changing Gender.",
        text2: `Please deselect all first.`,
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  };

  const handleHeightChange = (value) => {
    if (height === value) {
      toggleDescriptionValue(height, "");
      setHeight("");
    } else if (gender && !hairLength && !skinTone) {
      toggleDescriptionValue(height, value);
      setHeight(value);
    } else if (!height) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Please select Height after Gender.",
        text2: `Follow the order of selection.`,
        visibilityTime: 3000,
        autoHide: true,
      });
    } else {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Please deselect other options before changing Height.",
        text2: `Follow the order of selection.`,
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  };

  const handleHairLengthChange = (value) => {
    if (hairLength === value) {
      toggleDescriptionValue(hairLength, "");
      setHairLength("");
    } else if (gender && height && !skinTone) {
      toggleDescriptionValue(hairLength, value);
      setHairLength(value);
    } else if (!hairLength) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Please select Hair Length after Gender and Height.",
        text2: `Follow the order of selection.`,
        visibilityTime: 3000,
        autoHide: true,
      });
    } else {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Please deselect other options before changing Hair Length.",
        text2: `Follow the order of selection.`,
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  };

  const handleSkinToneChange = (value) => {
    if (skinTone === value) {
      toggleDescriptionValue(skinTone, "");
      setSkinTone("");
    } else if (gender && height && hairLength) {
      toggleDescriptionValue(skinTone, value);
      setSkinTone(value);
    } else if (!skinTone) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Please select Skin Tone after Gender, Height, and Hair Length.",
        text2: `Follow the order of selection.`,
        visibilityTime: 3000,
        autoHide: true,
      });
    } else {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Please deselect other options before changing Skin Tone.",
        text2: `Follow the order of selection.`,
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  };

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

  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelection = (category) => {
    let updatedAllergies = [...formik.values.allergy];

    if (category === "None" || category === "Others") {
      setSelectedCategory(category);
      updatedAllergies = [category];
    } else {
      if (selectedCategory === category) {
        setSelectedCategory(null);
        const index = updatedAllergies.indexOf(category);
        if (index !== -1) {
          updatedAllergies.splice(index, 1);
        }
      } else {
        setSelectedCategory(category);
        const index = updatedAllergies.indexOf(category);
        if (index === -1) {
          updatedAllergies.push(category);
        }
      }
    }

    updatedAllergies = updatedAllergies.filter(
      (allergy) =>
        !["Hands", "Hair", "Feet", "Facial", "Body", "Eyelash"].includes(
          allergy
        )
    );

    formik.setFieldValue("allergy", updatedAllergies);
  };

  const filteredAllergy = selectedCategory
    ? exclusions.filter((allergy) => allergy.type.includes(selectedCategory))
    : exclusions;

  const handleCheckboxChange = (allergyId) => {
    formik.setFieldValue(
      "allergy",
      formik.values.allergy.includes(allergyId)
        ? formik.values.allergy.filter((id) => id !== allergyId)
        : [...formik.values.allergy, allergyId]
    );
  };

  const [selectedMessageDate, setSelectedMessageDate] = useState(
    formik.values.messageDate
  );

  const radioOptions = [
    { label: "Every 1 minute", value: "1 minute" },
    { label: "Every 1 month", value: "1 month" },
    { label: "Every 2 months", value: "2 months" },
    { label: "Every 4 months", value: "4 months" },
    { label: "Every 6 months", value: "6 months" },
    { label: "Every 1 year", value: "1 year" },
    { label: "Turn Off", value: "stop" },
  ];

  const handleRadioOptions = (option) => {
    formik.setFieldValue("messageDate", option.value);
    setSelectedMessageDate(option.value);
  };

  return (
    <>
      {isLoading || exclusionLoading ? (
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
              className={`relative flex-1 justify-start pt-6`}
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
                    className={`font-semibold text-xl`}
                  >
                    Description
                  </Text>
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
                      onPress={() => handleHairLengthChange("Standard Hair ")}
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
                        {hairLength === "Standard Hair " && (
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
                          Standard
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

                  <Text
                    style={{ color: textColor }}
                    className={`${borderColor} font-semibold text-xl pt-2`}
                  >
                    Chemical Solution Category
                  </Text>

                  <View className={`flex-col`}>
                    <View className={`flex-row items-center gap-x-2`}>
                      <TouchableOpacity
                        className={`pl-2 py-2`}
                        onPress={() => {
                          const selectedValue = "None";
                          const updatedSelection =
                            formik.values.allergy.includes(selectedValue)
                              ? formik.values.allergy.filter(
                                  (val) => val !== selectedValue
                                )
                              : [...formik.values.allergy, selectedValue];
                          formik.setFieldValue("allergy", updatedSelection);
                          setSelectedCategory(null);
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
                    </View>

                    {!formik.values.allergy?.includes("None") &&
                      !formik.values.allergy?.includes("Others") && (
                        <View className={`flex-row flex-wrap gap-2 ml-[.75px]`}>
                          {[
                            "Hands",
                            "Hair",
                            "Feet",
                            "Facial",
                            "Body",
                            "Eyelash",
                          ].map((category, index) => (
                            <TouchableOpacity
                              key={index}
                              onPress={() => {
                                handleCategorySelection(category);
                              }}
                            >
                              <View className={`flex-row items-center gap-x-2`}>
                                <View
                                  style={{
                                    height: 30,
                                    width: 30,
                                    borderColor: textColor,
                                    backgroundColor: backgroundColor,
                                  }}
                                  className={`flex-row justify-center items-center border-2 rounded mr-2`}
                                >
                                  {selectedCategory === category && (
                                    <Text
                                      style={{ color: textColor }}
                                      className={`text-xl`}
                                    >
                                      ✓
                                    </Text>
                                  )}
                                </View>
                                <Text
                                  style={{ color: textColor }}
                                  className={`text-xl font-semibold`}
                                >
                                  {category}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}

                    <View className={`flex-row items-center gap-x-2`}>
                      <TouchableOpacity
                        className={`pl-2 py-2`}
                        onPress={() => {
                          const selectedValue = "Others";
                          const updatedSelection =
                            formik.values.allergy.includes(selectedValue)
                              ? formik.values.allergy.filter(
                                  (val) => val !== selectedValue
                                )
                              : [...formik.values.allergy, selectedValue];
                          formik.setFieldValue("allergy", updatedSelection);
                          setSelectedCategory(null);
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

                  {selectedCategory && (
                    <View className={`flex-row flex-wrap`}>
                      {filteredAllergy.map((allergy) => (
                        <View
                          key={allergy._id}
                          className={`flex-row items-start gap-x-2`}
                        >
                          <TouchableOpacity
                            onPress={() => handleCheckboxChange(allergy._id)}
                            className={`pl-2 py-2`}
                          >
                            <View
                              style={{
                                height: 30,
                                width: 30,
                                borderColor: textColor,
                                backgroundColor: formik.values.allergy.includes(
                                  allergy._id
                                )
                                  ? backgroundColor
                                  : "transparent",
                              }}
                              className={`flex-row justify-center items-center border-2 rounded mr-2`}
                            >
                              {formik.values.allergy.includes(allergy._id) && (
                                <Text
                                  style={{ color: textColor }}
                                  className={`text-xl`}
                                >
                                  ✓
                                </Text>
                              )}
                            </View>
                          </TouchableOpacity>
                          <View
                            className={`flex-row justify-center items-center`}
                          >
                            <View className={`pt-2`}>
                              <Text
                                style={{ color: textColor }}
                                className={`text-xl font-semibold`}
                              >
                                {allergy.ingredient_name}
                              </Text>
                            </View>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}

                  <Text
                    style={{ color: textColor }}
                    className={`${borderColor} font-semibold text-xl pt-2`}
                  >
                    Choose When To Receive Sms Ads
                  </Text>

                  <View className={`flex-row flex-wrap gap-x-1`}>
                    {radioOptions.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        className={`flex-row pl-2 py-2 items-center`}
                        onPress={() => {
                          handleRadioOptions(option);
                        }}
                      >
                        <View
                          style={{
                            height: 20,
                            width: 20,
                            borderRadius: 10,
                            borderWidth: 2,
                            borderColor:
                              formik.values.messageDate === option.value
                                ? invertBackgroundColor
                                : backgroundColor,
                            backgroundColor:
                              formik.values.messageDate === option.value
                                ? backgroundColor
                                : invertBackgroundColor,
                          }}
                        >
                          {selectedMessageDate === option.value && (
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
                        <View
                          className={`flex-row justify-center items-center`}
                        >
                          <View className={`pl-1`}>
                            <Text
                              style={{ color: textColor }}
                              className={`text-lg font-semibold`}
                            >
                              {option.label}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>

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
