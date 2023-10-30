import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import {
  useUpdateTestMutation,
  useGetTestByIdQuery,
} from "../../state/api/reducer";
import { useFormik } from "formik";
import { editTestValidation } from "../../validation";
import { useNavigation } from "@react-navigation/native";
import { BackIcon } from "@helpers";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";

export default function ({ route }) {
  const { id } = route.params;
  const navigation = useNavigation();

  const { data, isLoading, isError } = useGetTestByIdQuery(id);

  const [updateTest] = useUpdateTestMutation();

  const [selectedImages, setSelectedImages] = useState([]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      test: data?.details?.test || "",
    },
    validationSchema: editTestValidation,
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

      formData.append("test", values.test);

      updateTest({ id: data?.details?._id, payload: formData })
        .unwrap()
        .then((response) => {
          console.log("Response from API:", response);
          navigation.navigate("Test");
        })
        .catch((error) => {
          console.error("Error occurred while updating the test:", error);
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
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <BackIcon navigateBack={navigation.goBack} />
      <Text>Edit Test</Text>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : isError ? (
        <Text>Error occurred while fetching data.</Text>
      ) : (
        <>
          {selectedImages?.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image.uri }}
              style={{ width: 200, height: 200, marginBottom: 10 }}
            />
          ))}
          <Text>Test Details:</Text>
          <TextInput
            placeholder="Enter test details"
            onChangeText={formik.handleChange("test")}
            onBlur={formik.handleBlur("test")}
            value={formik.values.test}
          />
          {formik.touched.test && formik.errors.test && (
            <Text style={{ color: "red" }}>{formik.errors.test}</Text>
          )}
          {data.details?.image?.map((image) => (
            <Image
              key={image?.public_id}
              source={{ uri: image?.url }}
              style={{ width: 75, height: 60 }}
            />
          ))}
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
            <Text style={{ color: "white" }}>Update Test</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={takePicture}>
            <Text>Take a Picture</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={selectImages}>
            <Text>Select Images</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
