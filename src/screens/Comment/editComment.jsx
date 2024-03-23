import React, { useState } from "react";
import {
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
  useUpdateCommentMutation,
  useGetCommentByIdQuery,
} from "../../state/api/reducer";
import { useFormik } from "formik";
import { editCommentValidation } from "../../validation";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { LoadingScreen } from "@components";
import { changeColor } from "@utils";
import { BackIcon } from "@helpers";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

export default function ({ route }) {
  const { id } = route.params;
  const navigation = useNavigation();

  const {
    data,
    isLoading: isCommentLoading,
    refetch,
  } = useGetCommentByIdQuery(id);

  const [updateComment, { isLoading }] = useUpdateCommentMutation();

  const { backgroundColor, textColor, colorScheme } = changeColor();
  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#FDB9E5";
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";
  const borderColor = colorScheme === "dark" ? "#e5e5e5" : "#212B36";

  const [selectedImages, setSelectedImages] = useState([]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ratings: data?.details?.ratings || 1,
      description: data?.details?.description || "",
      suggestion: data?.details?.suggestion || "",
      isAnonymous: data?.details?.isAnonymous || "",
    },
    validationSchema: editCommentValidation,
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
      formData.append("ratings", values.ratings);
      formData.append("description", values.description);
      formData.append("suggestion", values.suggestion);
      formData.append("isAnonymous", values.isAnonymous);

      updateComment({ id: data?.details?._id, payload: formData })
        .unwrap()
        .then((response) => {
          refetch();
          Toast.show({
            type: "success",
            position: "top",
            text1: "Comment Details Successfully Updated",
            text2: `${response?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
          setSelectedImages([]);
          navigation.navigate("CustomerComment");
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Updating Comment Details",
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

  const [isOpen, setOpen] = useState(data?.details?.isAnonymous || false);

  const handleCheckBoxToggle = () => {
    const newValue = !isOpen;
    setOpen(newValue);
    formik.setFieldValue("isAnonymous", newValue);
  };

  return (
    <>
      {isLoading || isCommentLoading ? (
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
                      Edit Comment Details
                    </Text>

                    <Text
                      style={{ color: textColor }}
                      className={`font-semibold text-lg`}
                    >
                      Ratings
                    </Text>

                    <View
                      className={`flex-row items-center justify-center flex-wrap gap-x-2 pb-2`}
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Feather
                          key={star}
                          name="star"
                          color={
                            formik.values.ratings >= star ? "#feca57" : "gray"
                          }
                          size={40}
                          onPress={() => formik.setFieldValue("ratings", star)}
                        />
                      ))}
                    </View>

                    <Text
                      style={{ color: textColor }}
                      className={`font-semibold text-lg`}
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
                      placeholder="Add Message Here..."
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
                      className={`font-semibold text-lg`}
                    >
                      Suggesstion
                    </Text>
                    <TextInput
                      style={{
                        color: textColor,
                        height: 100,
                        textAlignVertical: "top",
                      }}
                      className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-lg my-2 ${borderColor}`}
                      placeholder="Add Message Here..."
                      placeholderTextColor={textColor}
                      autoCapitalize="none"
                      multiline={true}
                      onChangeText={formik.handleChange("suggestion")}
                      onBlur={formik.handleBlur("suggestion")}
                      value={formik.values.suggestion}
                    />
                    {formik.touched.suggestion && formik.errors.suggestion && (
                      <Text style={{ color: "red" }}>
                        {formik.errors.suggestion}
                      </Text>
                    )}

                    <View className={`flex flex-row`}>
                      <TouchableOpacity
                        onPress={() => handleCheckBoxToggle()}
                        className={`flex-row px-4 py-2`}
                      >
                        <View
                          style={{
                            height: 35,
                            width: 35,
                            borderColor: invertTextColor,
                            backgroundColor: invertBackgroundColor,
                          }}
                          className={`flex-row justify-center items-center border-2 rounded mr-2`}
                        >
                          {isOpen && (
                            <Text
                              style={{ color: invertTextColor }}
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
                          className={`text-xl font-semibold`}
                        >
                          {isOpen ? "Anonymous" : "Make my comment Anonymous"}
                        </Text>
                      </View>
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
