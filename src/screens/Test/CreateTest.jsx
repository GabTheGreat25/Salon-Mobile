import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFormik } from "formik";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useAddTestMutation } from "../../state/api/reducer";
import { createTestValidation } from "../../validation";
import { BackIcon } from "@helpers";
import { LoadingScreen } from "@components";

export default function () {
  const [addTest, { isLoading, isError }] = useAddTestMutation();
  const navigation = useNavigation();
  const [selectedImages, setSelectedImages] = useState([]);

  const formik = useFormik({
    initialValues: {
      test: "",
    },
    validationSchema: createTestValidation,
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

      formData.append("test", values.test);

      try {
        const response = await addTest(formData).unwrap();
        console.log("Response from API:", response);
        navigation.navigate("Test");
        formik.resetForm();
      } catch (error) {
        console.error("Error occurred while adding the test:", error);
      }
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
          setSelectedImages([...selectedImages, manipulatedImage]);
        }
      } catch (error) {
        console.error("Image manipulation error:", error);
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
          console.error("Image manipulation error:", error);
        }
      }

      setSelectedImages([...selectedImages, ...newImages]);
    }
  };

  return (
    <View
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      className={`bg-primary-default`}
    >
      <BackIcon navigateBack={navigation.goBack} />
      {isLoading ? (
        <LoadingScreen />
      ) : isError ? (
        <Text>Error occurred while fetching data.</Text>
      ) : (
        <>
          <Text>Test Details:</Text>
          <View>
            {selectedImages?.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image.uri }}
                style={{ width: 200, height: 200, marginBottom: 10 }}
              />
            ))}
            <Text>Test Name:</Text>
            <TextInput
              placeholder="Enter test details"
              onChangeText={formik.handleChange("test")}
              onBlur={formik.handleBlur("test")}
              value={formik.values.test}
            />
            {formik.touched.test && formik.errors.test && (
              <Text style={{ color: "red" }}>{formik.errors.test}</Text>
            )}
            <TouchableOpacity
              style={{
                backgroundColor: "blue",
                padding: 10,
                borderRadius: 5,
                marginTop: 10,
              }}
              onPress={formik.handleSubmit}
              disabled={!formik.isValid}
            >
              <Text style={{ color: "white" }}>Create Test</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={takePicture}>
              <Text>Take a Picture</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={selectImages}>
              <Text>Select Images</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}
