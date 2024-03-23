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
  TextInput,
} from "react-native";
import {
  useUpdateProductMutation,
  useGetProductByIdQuery,
  useGetBrandsQuery,
} from "../../state/api/reducer";
import { useFormik } from "formik";
import { editProductValidation } from "../../validation";
import { useNavigation } from "@react-navigation/native";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import { LoadingScreen } from "@components";
import { changeColor } from "@utils";
import { Picker } from "@react-native-picker/picker";
import { BackIcon } from "@helpers";
import { useIsFocused } from "@react-navigation/native";

export default function ({ route }) {
  const { id } = route.params;
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const { data: brand, isLoading: brandLoading } = useGetBrandsQuery();
  const {
    data,
    isLoading: isProductLoading,
    refetch,
  } = useGetProductByIdQuery(id);

  useEffect(() => {
    const fetchData = async () => {
      if (isFocused) refetch();
    };
    fetchData();
  }, [isFocused]);

  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  const { backgroundColor, textColor, colorScheme } = changeColor();
  const borderColor = colorScheme === "dark" ? "#e5e5e5" : "#212B36";
  const [selectedImages, setSelectedImages] = useState([]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      brand: data?.details?.brand || "",
      product_name: data?.details?.product_name || "",
      type: Array.isArray(data?.details?.type)
        ? data.details.type.join(", ")
        : data?.details?.type || "",
      ingredients: data?.details?.ingredients || "",
      isNew: data?.details?.isNew || false,
    },

    validationSchema: editProductValidation,
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

      formData.append("brand", values.brand);
      formData.append("product_name", values.product_name);
      formData.append("type", values.type);
      formData.append("ingredients", values.ingredients);
      formData.append("isNew", values.isNew);

      updateProduct({ id: data?.details?._id, payload: formData })
        .unwrap()
        .then((response) => {
          refetch();
          Toast.show({
            type: "success",
            position: "top",
            text1: "Product Details Successfully Updated",
            text2: `${response?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
          setSelectedImages([]);
          navigation.navigate("Product");
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Updating Product Details",
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

  const [isOpen, setOpen] = useState(data?.details?.isNew || false);

  const handleCheckBoxToggle = () => {
    const newValue = !isOpen;
    setOpen(newValue);
    formik.setFieldValue("isNew", newValue);
  };

  return (
    <>
      {isLoading || isProductLoading || brandLoading ? (
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
              className={`relative flex-1 pb-12`}
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
                  <View className="items-center justify-center pb-6">
                    <Image
                      key={
                        data?.details?.image[
                          Math.floor(
                            Math.random() * data?.details?.image?.length
                          )
                        ]?.public_id
                      }
                      source={{
                        uri: data?.details?.image[
                          Math.floor(
                            Math.random() * data?.details?.image?.length
                          )
                        ]?.url,
                      }}
                      className={`rounded-full w-60 h-60`}
                      resizeMode="cover"
                    />
                  </View>
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-center pb-6 text-3xl`}
                  >
                    Edit Product Details
                  </Text>
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Product Name
                  </Text>
                  <TextInput
                    style={{ color: textColor }}
                    className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                    placeholder="Enter your product name"
                    placeholderTextColor={textColor}
                    autoCapitalize="none"
                    onChangeText={formik.handleChange("product_name")}
                    onBlur={formik.handleBlur("product_name")}
                    value={formik.values.product_name}
                  />
                  {formik.touched.product_name &&
                    formik.errors.product_name && (
                      <Text style={{ color: "red" }}>
                        {formik.errors.product_name}
                      </Text>
                    )}

                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Brand
                  </Text>

                  <View
                    className={`border-[1.5px]  font-normal rounded-full my-3 ${borderColor}`}
                  >
                    <Picker
                      selectedValue={formik.values.brand}
                      style={{ color: textColor }}
                      dropdownIconColor={textColor}
                      onValueChange={(itemValue) =>
                        formik.setFieldValue("brand", itemValue)
                      }
                    >
                      <Picker.Item label="Select Brand" value="" />
                      {brand?.details
                        ?.filter(
                          (b) =>
                            b.brand_name !== "None" && b.brand_name !== "Others"
                        )
                        .map((b) => (
                          <Picker.Item
                            key={b?._id}
                            label={b?.brand_name}
                            value={b?._id}
                            color={textColor}
                          />
                        ))}
                    </Picker>
                  </View>
                  {formik.touched.brand && formik.errors.brand && (
                    <Text style={{ color: "red" }}>{formik.errors.brand}</Text>
                  )}

                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Type
                  </Text>

                  <View
                    className={`border-[1.5px]  font-normal rounded-full my-3 ${borderColor}`}
                  >
                    <Picker
                      selectedValue={formik.values.type}
                      style={{ color: textColor }}
                      dropdownIconColor={textColor}
                      onValueChange={(itemValue) =>
                        formik.setFieldValue("type", itemValue)
                      }
                    >
                      <Picker.Item label="Select Type" value="" />
                      <Picker.Item label="Hands" value="Hands" />
                      <Picker.Item label="Hair" value="Hair" />
                      <Picker.Item label="Feet" value="Feet" />
                      <Picker.Item label="Facial" value="Facial" />
                      <Picker.Item label="Body" value="Body" />
                      <Picker.Item label="Eyelash" value="Eyelash" />
                    </Picker>
                  </View>

                  {formik.touched.type && formik.errors.type && (
                    <Text style={{ color: "red" }}>{formik.errors.type}</Text>
                  )}

                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Add ingredients of the product
                  </Text>
                  <TextInput
                    style={{
                      color: textColor,
                      height: 100,
                      textAlignVertical: "top",
                    }}
                    className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-lg my-2 ${borderColor}`}
                    placeholder="Add Ingredients Here..."
                    placeholderTextColor={textColor}
                    autoCapitalize="none"
                    multiline={true}
                    onChangeText={formik.handleChange("ingredients")}
                    onBlur={formik.handleBlur("ingredients")}
                    value={formik.values.ingredients}
                  />
                  {formik.touched.ingredients && formik.errors.ingredients && (
                    <Text style={{ color: "red" }}>
                      {formik.errors.ingredients}
                    </Text>
                  )}

                  <View className={`flex flex-row`}>
                    <TouchableOpacity
                      onPress={() => handleCheckBoxToggle()}
                      className={`flex-row py-2`}
                    >
                      <View
                        style={{
                          height: 35,
                          width: 35,
                          borderColor: textColor,
                          backgroundColor: backgroundColor,
                        }}
                        className={`flex-row justify-center items-center border-2 rounded mr-3`}
                      >
                        {isOpen && (
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
                        className={`text-2xl font-semibold`}
                      >
                        New Product?
                      </Text>
                    </View>
                  </View>
                  {formik.touched.isNew && formik.errors.isNew && (
                    <Text style={{ color: "red" }}>{formik.errors.isNew}</Text>
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

                  <View className={`flex-col`}>
                    <TouchableOpacity
                      onPress={formik.handleSubmit}
                      disabled={!formik.isValid}
                    >
                      <View className={`mb-4 w-full`}>
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
                </ScrollView>
              </KeyboardAvoidingView>
            </SafeAreaView>
          </TouchableWithoutFeedback>
        </>
      )}
    </>
  );
}
