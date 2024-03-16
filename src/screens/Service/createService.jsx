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
import { changeColor } from "@utils";
import { BackIcon } from "@helpers";
import { useNavigation } from "@react-navigation/native";
import { LoadingScreen } from "@components";
import { useFormik } from "formik";
import {
  useAddServiceMutation,
  useGetProductsQuery,
} from "../../state/api/reducer";
import { createServiceValidation } from "../../validation";
import Toast from "react-native-toast-message";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";

export default function () {
  const navigation = useNavigation();
  const { backgroundColor, textColor, colorScheme } = changeColor();

  const borderColor =
    colorScheme === "dark" ? "border-neutral-light" : "border-neutral-dark";

  const { data: products } = useGetProductsQuery();

  const convertToServerFormat = (userInput) => {
    const [hours] = userInput.split(":");
    return hours.trim();
  };

  const [addService, { isLoading }] = useAddServiceMutation();
  const [selectedImages, setSelectedImages] = useState([]);

  const formik = useFormik({
    initialValues: {
      service_name: "",
      description: "",
      type: [],
      occassion: "",
      price: "",
      duration: "",
      warranty: "",
      product: [],
    },
    validationSchema: createServiceValidation,
    onSubmit: (values) => {
      const formData = new FormData();
      const formattedDuration = convertToServerFormat(values?.duration);

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

      formData.append("service_name", values?.service_name);
      formData.append("description", values?.description);
      if (Array.isArray(values?.type)) {
        values.type.forEach((item) => formData.append("type[]", item));
      } else formData.append("type", values?.type);
      formData.append("occassion", values?.occassion);
      formData.append("price", values?.price);
      formData.append("duration", formattedDuration);
      formData.append("warranty", values?.warranty);
      if (Array.isArray(values?.product)) {
        values.product.forEach((item) => formData.append("product[]", item));
      } else formData.append("product", values?.product);
      addService(formData)
        .unwrap()
        .then((response) => {
          navigation.navigate("Service");
          setSelectedImages([]);
          formik.resetForm();
          Toast.show({
            type: "success",
            position: "top",
            text1: "Service Successfully Created",
            text2: `${response?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Creating Service",
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

  const [selectedTypes, setSelectedTypes] = useState([]);

  const handleCheckBoxToggle = (value) => {
    setSelectedTypes((prevOpen) => {
      if (prevOpen.includes(value)) {
        return prevOpen.filter((item) => item !== value);
      } else {
        return [...prevOpen, value];
      }
    });
  };

  useEffect(() => {
    formik.setFieldValue("type", selectedTypes);
  }, [selectedTypes]);

  const handsProducts = products?.details?.filter((product) =>
    product.type.includes("Hands")
  );
  const hairProducts = products?.details?.filter((product) =>
    product.type.includes("Hair")
  );
  const feetProducts = products?.details?.filter((product) =>
    product.type.includes("Feet")
  );
  const facialProducts = products?.details?.filter((product) =>
    product.type.includes("Facial")
  );
  const bodyProducts = products?.details?.filter((product) =>
    product.type.includes("Body")
  );
  const eyeLashProducts = products?.details?.filter((product) =>
    product.type.includes("Eyelash")
  );

  const handleCheckBoxProduct = (selectedProduct) => {
    let updatedProducts;
    const productId = selectedProduct._id;
    if (formik.values.product.includes(productId)) {
      updatedProducts = formik.values.product.filter((id) => id !== productId);
    } else updatedProducts = [...formik.values.product, productId];

    formik.setFieldValue("product", updatedProducts);
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
              className={`relative flex-1 pt-12`}
            >
              <BackIcon
                navigateBack={navigation.goBack}
                textColor={textColor}
              />
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
                    Create Service
                  </Text>
                  <TextInput
                    style={{ color: textColor }}
                    className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                    placeholder="Enter your service name"
                    placeholderTextColor={textColor}
                    autoCapitalize="none"
                    onChangeText={formik.handleChange("service_name")}
                    onBlur={formik.handleBlur("service_name")}
                    value={formik.values.service_name}
                  />
                  {formik.touched.service_name &&
                    formik.errors.service_name && (
                      <Text style={{ color: "red" }}>
                        {formik.errors.service_name}
                      </Text>
                    )}

                  <View
                    className={`border-[1.5px]  font-normal rounded-full my-3 ${borderColor}`}
                  >
                    <Picker
                      selectedValue={formik.values.duration}
                      style={{ color: textColor }}
                      dropdownIconColor={textColor}
                      onValueChange={(itemValue) =>
                        formik.setFieldValue("duration", itemValue)
                      }
                    >
                      <Picker.Item label="Select Duration" value="" />
                      <Picker.Item
                        label="Minimum of 30 minutes"
                        value="Minimum of 30 minutes"
                      />
                      <Picker.Item
                        label="Minimum of 1 hour"
                        value="Minimum of 1 hour"
                      />
                      <Picker.Item
                        label="Minimum of 2 hours"
                        value="Minimum of 2 hours"
                      />
                      <Picker.Item
                        label="Minimum of 3 hours"
                        value="Minimum of 3 hours"
                      />
                    </Picker>
                  </View>
                  {formik.touched.duration && formik.errors.duration && (
                    <Text style={{ color: "red" }}>
                      {formik.errors.duration}
                    </Text>
                  )}

                  <View
                    className={`border-[1.5px]  font-normal rounded-full my-3 ${borderColor}`}
                  >
                    <Picker
                      selectedValue={formik.values.warranty}
                      style={{ color: textColor }}
                      dropdownIconColor={textColor}
                      onValueChange={(itemValue) =>
                        formik.setFieldValue("warranty", itemValue)
                      }
                    >
                      <Picker.Item label="Select Warranty" value="" />
                      <Picker.Item label="1 day" value="1 day" />
                      <Picker.Item label="3 days" value="3 days" />
                      <Picker.Item label="5 days" value="5 days" />
                      <Picker.Item label="1 week" value="1 week" />
                      <Picker.Item label="2 weeks" value="2 weeks" />
                      <Picker.Item label="3 weeks" value="3 weeks" />
                      <Picker.Item label="1 month" value="1 month" />
                    </Picker>
                  </View>
                  {formik.touched.warranty && formik.errors.warranty && (
                    <Text style={{ color: "red" }}>
                      {formik.errors.warranty}
                    </Text>
                  )}

                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-2xl`}
                  >
                    Service Type
                  </Text>
                  <View
                    className={`flex flex-row justify-start gap-x-4 flex-wrap`}
                  >
                    <TouchableOpacity
                      onPress={() => handleCheckBoxToggle("Hands")}
                      className={`flex-row py-2`}
                    >
                      <View
                        style={{
                          height: 35,
                          width: 35,
                          borderColor: textColor,
                          backgroundColor: backgroundColor,
                        }}
                        className={`flex-row justify-center items-center border-2 rounded`}
                      >
                        {selectedTypes.includes("Hands") && (
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
                        Hands
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleCheckBoxToggle("Hair")}
                      className={`flex-row py-2`}
                    >
                      <View
                        style={{
                          height: 35,
                          width: 35,
                          borderColor: textColor,
                          backgroundColor: backgroundColor,
                        }}
                        className={`flex-row justify-center items-center border-2 rounded`}
                      >
                        {selectedTypes.includes("Hair") && (
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
                        Hair
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleCheckBoxToggle("Feet")}
                      className={`flex-row py-2`}
                    >
                      <View
                        style={{
                          height: 35,
                          width: 35,
                          borderColor: textColor,
                          backgroundColor: backgroundColor,
                        }}
                        className={`flex-row justify-center items-center border-2 rounded`}
                      >
                        {selectedTypes.includes("Feet") && (
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
                        Feet
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleCheckBoxToggle("Facial")}
                      className={`flex-row py-2`}
                    >
                      <View
                        style={{
                          height: 35,
                          width: 35,
                          borderColor: textColor,
                          backgroundColor: backgroundColor,
                        }}
                        className={`flex-row justify-center items-center border-2 rounded`}
                      >
                        {selectedTypes.includes("Facial") && (
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
                        Facial
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleCheckBoxToggle("Body")}
                      className={`flex-row py-2`}
                    >
                      <View
                        style={{
                          height: 35,
                          width: 35,
                          borderColor: textColor,
                          backgroundColor: backgroundColor,
                        }}
                        className={`flex-row justify-center items-center border-2 rounded`}
                      >
                        {selectedTypes.includes("Body") && (
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
                        Body
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleCheckBoxToggle("Eyelash")}
                      className={`flex-row py-2`}
                    >
                      <View
                        style={{
                          height: 35,
                          width: 35,
                          borderColor: textColor,
                          backgroundColor: backgroundColor,
                        }}
                        className={`flex-row justify-center items-center border-2 rounded`}
                      >
                        {selectedTypes.includes("Eyelash") && (
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
                        Eyelash
                      </Text>
                    </View>
                  </View>
                  {formik.touched.type && formik.errors.type && (
                    <Text style={{ color: "red" }}>{formik.errors.type}</Text>
                  )}

                  <View
                    className={`border-[1.5px]  font-normal rounded-full my-3 ${borderColor}`}
                  >
                    <Picker
                      selectedValue={formik.values.occassion}
                      style={{ color: textColor }}
                      dropdownIconColor={textColor}
                      onValueChange={(itemValue) =>
                        formik.setFieldValue("occassion", itemValue)
                      }
                    >
                      <Picker.Item label="Select Occassion" value="" />
                      <Picker.Item label="Graduation" value="Graduation" />
                      <Picker.Item label="Js Prom" value="Js Prom" />
                      <Picker.Item label="Halloween" value="Halloween" />
                      <Picker.Item label="Christmas" value="Christmas" />
                      <Picker.Item label="Valentines" value="Valentines" />
                      <Picker.Item label="Wedding" value="Wedding" />
                      <Picker.Item label="New Year" value="New Year" />
                      <Picker.Item label="Birthday" value="Birthday" />
                      <Picker.Item label="None" value="None" />
                    </Picker>
                  </View>
                  {formik.touched.occassion && formik.errors.occassion && (
                    <Text style={{ color: "red" }}>
                      {formik.errors.occassion}
                    </Text>
                  )}

                  <TextInput
                    style={{ color: textColor }}
                    className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                    placeholder="Enter price"
                    placeholderTextColor={textColor}
                    keyboardType="numeric"
                    onChangeText={formik.handleChange("price")}
                    onBlur={formik.handleBlur("price")}
                    value={formik.values.price}
                  />
                  {formik.touched.price && formik.errors.price && (
                    <Text style={{ color: "red" }}>{formik.errors.price}</Text>
                  )}

                  {selectedTypes.includes("Hands") ? (
                    <>
                      <Text
                        style={{ color: textColor }}
                        className={`font-semibold text-2xl`}
                      >
                        Hands Products
                      </Text>
                      <View
                        className={`flex flex-row justify-start gap-x-4 flex-wrap`}
                      >
                        {handsProducts.map((product) => (
                          <TouchableOpacity
                            key={product._id}
                            onPress={() => handleCheckBoxProduct(product)}
                            className={`flex-row gap-x-2 py-2`}
                          >
                            <View
                              style={{
                                height: 30,
                                width: 30,
                                borderColor: textColor,
                                backgroundColor: backgroundColor,
                              }}
                              className={`flex-row justify-center items-center border-2 rounded`}
                            >
                              {formik.values.product.includes(product._id) && (
                                <Text
                                  style={{ color: textColor }}
                                  className={`text-lg`}
                                >
                                  ✓
                                </Text>
                              )}
                            </View>
                            <View className={`pb-6`}>
                              <Text
                                style={{ color: textColor }}
                                className={`text-lg font-semibold`}
                              >
                                {product.product_name}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </>
                  ) : (
                    ""
                  )}

                  {selectedTypes.includes("Hair") ? (
                    <>
                      <Text
                        style={{ color: textColor }}
                        className={`font-semibold text-2xl`}
                      >
                        Hair Products
                      </Text>
                      <View
                        className={`flex flex-row justify-start gap-x-4 flex-wrap`}
                      >
                        {hairProducts.map((product) => (
                          <TouchableOpacity
                            key={product._id}
                            onPress={() => handleCheckBoxProduct(product)}
                            className={`flex-row gap-x-2 py-2`}
                          >
                            <View
                              style={{
                                height: 30,
                                width: 30,
                                borderColor: textColor,
                                backgroundColor: backgroundColor,
                              }}
                              className={`flex-row justify-center items-center border-2 rounded`}
                            >
                              {formik.values.product.includes(product._id) && (
                                <Text
                                  style={{ color: textColor }}
                                  className={`text-lg`}
                                >
                                  ✓
                                </Text>
                              )}
                            </View>
                            <View className={`pb-6`}>
                              <Text
                                style={{ color: textColor }}
                                className={`text-lg font-semibold`}
                              >
                                {product.product_name}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </>
                  ) : (
                    ""
                  )}

                  {selectedTypes.includes("Feet") ? (
                    <>
                      <Text
                        style={{ color: textColor }}
                        className={`font-semibold text-2xl`}
                      >
                        Feet Products
                      </Text>
                      <View
                        className={`flex flex-row justify-start gap-x-4 flex-wrap`}
                      >
                        {feetProducts.map((product) => (
                          <TouchableOpacity
                            key={product._id}
                            onPress={() => handleCheckBoxProduct(product)}
                            className={`flex-row gap-x-2 py-2`}
                          >
                            <View
                              style={{
                                height: 30,
                                width: 30,
                                borderColor: textColor,
                                backgroundColor: backgroundColor,
                              }}
                              className={`flex-row justify-center items-center border-2 rounded`}
                            >
                              {formik.values.product.includes(product._id) && (
                                <Text
                                  style={{ color: textColor }}
                                  className={`text-2xl`}
                                >
                                  ✓
                                </Text>
                              )}
                            </View>
                            <View className={`pb-6`}>
                              <Text
                                style={{ color: textColor }}
                                className={`text-lg font-semibold`}
                              >
                                {product.product_name}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </>
                  ) : (
                    ""
                  )}

                  {selectedTypes.includes("Facial") ? (
                    <>
                      <Text
                        style={{ color: textColor }}
                        className={`font-semibold text-2xl`}
                      >
                        Facial Products
                      </Text>
                      <View
                        className={`flex flex-row justify-start gap-x-4 flex-wrap`}
                      >
                        {facialProducts.map((product) => (
                          <TouchableOpacity
                            key={product._id}
                            onPress={() => handleCheckBoxProduct(product)}
                            className={`flex-row gap-x-2 py-2`}
                          >
                            <View
                              style={{
                                height: 30,
                                width: 30,
                                borderColor: textColor,
                                backgroundColor: backgroundColor,
                              }}
                              className={`flex-row justify-center items-center border-2 rounded`}
                            >
                              {formik.values.product.includes(product._id) && (
                                <Text
                                  style={{ color: textColor }}
                                  className={`text-lg`}
                                >
                                  ✓
                                </Text>
                              )}
                            </View>
                            <View className={`pb-6`}>
                              <Text
                                style={{ color: textColor }}
                                className={`text-lg font-semibold`}
                              >
                                {product.product_name}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </>
                  ) : (
                    ""
                  )}

                  {selectedTypes.includes("Body") ? (
                    <>
                      <Text
                        style={{ color: textColor }}
                        className={`font-semibold text-2xl`}
                      >
                        Body Products
                      </Text>
                      <View
                        className={`flex flex-row justify-start gap-x-4 flex-wrap`}
                      >
                        {bodyProducts.map((product) => (
                          <TouchableOpacity
                            key={product._id}
                            onPress={() => handleCheckBoxProduct(product)}
                            className={`flex-row gap-x-2 py-2`}
                          >
                            <View
                              style={{
                                height: 30,
                                width: 30,
                                borderColor: textColor,
                                backgroundColor: backgroundColor,
                              }}
                              className={`flex-row justify-center items-center border-2 rounded`}
                            >
                              {formik.values.product.includes(product._id) && (
                                <Text
                                  style={{ color: textColor }}
                                  className={`text-lg`}
                                >
                                  ✓
                                </Text>
                              )}
                            </View>
                            <View className={`pb-6`}>
                              <Text
                                style={{ color: textColor }}
                                className={`text-lg font-semibold`}
                              >
                                {product.product_name}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </>
                  ) : (
                    ""
                  )}

                  {selectedTypes.includes("Eyelash") ? (
                    <>
                      <Text
                        style={{ color: textColor }}
                        className={`font-semibold text-2xl`}
                      >
                        Eyelash Products
                      </Text>
                      <View
                        className={`flex flex-row justify-start gap-x-4 flex-wrap`}
                      >
                        {eyeLashProducts.map((product) => (
                          <TouchableOpacity
                            key={product._id}
                            onPress={() => handleCheckBoxProduct(product)}
                            className={`flex-row gap-x-2 py-2`}
                          >
                            <View
                              style={{
                                height: 30,
                                width: 30,
                                borderColor: textColor,
                                backgroundColor: backgroundColor,
                              }}
                              className={`flex-row justify-center items-center border-2 rounded`}
                            >
                              {formik.values.product.includes(product._id) && (
                                <Text
                                  style={{ color: textColor }}
                                  className={`text-lg`}
                                >
                                  ✓
                                </Text>
                              )}
                            </View>
                            <View className={`pb-6`}>
                              <Text
                                style={{ color: textColor }}
                                className={`text-lg font-semibold`}
                              >
                                {product.product_name}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </>
                  ) : (
                    ""
                  )}

                  <TextInput
                    style={{
                      color: textColor,
                      height: 100,
                      textAlignVertical: "top",
                    }}
                    className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-lg my-2 ${borderColor}`}
                    placeholder="Enter your description"
                    placeholderTextColor={textColor}
                    autoCapitalize="none"
                    multiline={true}
                    onChangeText={formik.handleChange("description")}
                    onBlur={formik.handleBlur("description")}
                    value={formik.values.description}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <Text style={{ color: "red" }}>
                      {formik.errors.description}
                    </Text>
                  )}

                  <Text
                    style={{ color: textColor }}
                    className={`${borderColor} font-semibold text-xl`}
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

                  <View className={`mt-4 items-center justify-center flex-col`}>
                    <TouchableOpacity
                      onPress={formik.handleSubmit}
                      disabled={!formik.isValid}
                    >
                      <View className={`mb-2 flex justify-center items-center`}>
                        <View
                          className={`py-2 rounded-lg bg-primary-accent w-[175px]
                          } ${!formik.isValid ? "opacity-50" : "opacity-100"}`}
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
              </View>
            </SafeAreaView>
          </TouchableWithoutFeedback>
        </>
      )}
    </>
  );
}
