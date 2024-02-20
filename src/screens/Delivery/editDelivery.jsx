import React, { useState, useEffect } from "react";
import {
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
  Alert,
} from "react-native";
import {
  useUpdateDeliveryMutation,
  useGetDeliveryByIdQuery,
  useGetProductsQuery,
  useGetDeliveriesQuery,
} from "../../state/api/reducer";
import { useFormik } from "formik";
import { editDeliveryValidation } from "../../validation";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { LoadingScreen } from "@components";
import { dimensionLayout, changeColor } from "@utils";
import { Picker } from "@react-native-picker/picker";
import { BackIcon } from "@helpers";
import { format } from "date-fns";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function ({ route }) {
  const { id } = route.params;
  const navigation = useNavigation();

  const {
    data,
    isLoading: isDeliveryLoading,
    refetch,
  } = useGetDeliveryByIdQuery(id);
  const { data: products } = useGetProductsQuery();
  const [updateDelivery, { isLoading }] = useUpdateDeliveryMutation();

  const { backgroundColor, textColor, colorScheme } = changeColor();
  const borderColor =
    colorScheme === "dark" ? "border-neutral-light" : "border-neutral-dark";

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      company_name: data?.details?.company_name || "",
      date: data?.details?.date
        ? format(new Date(data.details.date), "yyyy-MM-dd")
        : "",
      status: data?.details?.status || "pending",
      price: data?.details?.price || 0,
      quantity: data?.details?.quantity || 0,
      type: data?.details?.type || "",
      product: data?.details?.product?.map((product) => product._id) || [],
    },
    validationSchema: editDeliveryValidation,
    onSubmit: (values) => {
      updateDelivery({ id: data?.details?._id, payload: values })
        .unwrap()
        .then((response) => {
          refetch();
          Toast.show({
            type: "success",
            position: "top",
            text1: "Delivery Details Successfully Updated",
            text2: `${response?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
          navigation.navigate("Delivery");
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Updating Delivery Details",
            text2: `${error?.data?.error?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
        });
    },
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const showDatepicker = () => {
    setShowDatePicker(true);
    Keyboard.dismiss();
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (event.type === "dismissed") {
      return;
    }

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      console.log("Date before today");
      Alert.alert("Error", "Please select a date from today onwards.");
      return;
    }

    if (selectedDate.getDay() === 1) {
      console.log("Monday selected");
      Alert.alert(
        "Error",
        "We are closed on Mondays. Please select another date."
      );
      return;
    }

    setSelectedDate(selectedDate);
    formik.setFieldValue("date", selectedDate.toISOString().split("T")[0]);
  };

  const [selectedTypes, setSelectedTypes] = useState(data?.details?.type || []);

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

  const handsProducts = products?.details?.filter(
    (product) => product.type === "Hands"
  );
  const hairProducts = products?.details?.filter(
    (product) => product.type === "Hair"
  );
  const feetProducts = products?.details?.filter(
    (product) => product.type === "Feet"
  );
  const faceProducts = products?.details?.filter(
    (product) => product.type === "Face"
  );
  const bodyProducts = products?.details?.filter(
    (product) => product.type === "Body"
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
      {isLoading || isDeliveryLoading ? (
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
            <KeyboardAvoidingView behavior="height">
              <ScrollView
                showsVerticalScrollIndicator={false}
                decelerationRate="fast"
                scrollEventThrottle={1}
                className={`px-6`}
              >
                <View className={`pt-10 pb-2`}>
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-center my-[9px] text-3xl`}
                  >
                    Update Delivery Details
                  </Text>
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Company Name
                  </Text>
                  <TextInput
                    style={{ color: textColor }}
                    className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                    placeholder="Enter your company name"
                    placeholderTextColor={textColor}
                    autoCapitalize="none"
                    onChangeText={formik.handleChange("company_name")}
                    onBlur={formik.handleBlur("company_name")}
                    value={formik.values.company_name}
                  />
                  {formik.touched.company_name &&
                    formik.errors.company_name && (
                      <Text style={{ color: "red" }}>
                        {formik.errors.company_name}
                      </Text>
                    )}
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Date
                  </Text>
                  <TextInput
                    style={{ color: textColor }}
                    className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                    placeholder="Enter date"
                    placeholderTextColor={textColor}
                    onFocus={showDatepicker}
                    value={formik.values.date}
                  />
                  {showDatePicker && (
                    <DateTimePicker
                      value={new Date(formik.values.date)}
                      mode="date"
                      is24Hour={true}
                      display="default"
                      onChange={handleDateChange}
                    />
                  )}
                  {formik.touched.date && formik.errors.date && (
                    <Text style={{ color: "red" }}>{formik.errors.date}</Text>
                  )}
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Status
                  </Text>
                  <View
                    className={`border-[1.5px] text-lg font-normal rounded-full my-2 ${borderColor}`}
                  >
                    <Picker
                      selectedValue={formik.values.status}
                      style={{ color: textColor }}
                      dropdownIconColor={textColor}
                      onValueChange={(itemValue) =>
                        formik.setFieldValue("status", itemValue)
                      }
                    >
                      <Picker.Item label="pending" value="pending" />
                      <Picker.Item label="completed" value="completed" />
                    </Picker>
                  </View>

                  {formik.touched.status && formik.errors.status && (
                    <Text style={{ color: "red" }}>{formik.errors.status}</Text>
                  )}
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Price
                  </Text>
                  <TextInput
                    style={{ color: textColor }}
                    className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                    placeholder="Enter the price"
                    placeholderTextColor={textColor}
                    keyboardType="numeric"
                    autoCapitalize="none"
                    onChangeText={formik.handleChange("price")}
                    onBlur={formik.handleBlur("price")}
                    value={String(formik.values.price)}
                  />
                  {formik.touched.price && formik.errors.price && (
                    <Text style={{ color: "red" }}>{formik.errors.price}</Text>
                  )}
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Quantity
                  </Text>
                  <TextInput
                    style={{ color: textColor }}
                    className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                    placeholder="Enter the quantity"
                    placeholderTextColor={textColor}
                    keyboardType="numeric"
                    autoCapitalize="none"
                    onChangeText={formik.handleChange("quantity")}
                    onBlur={formik.handleBlur("quantity")}
                    value={String(formik.values.quantity)}
                  />
                  {formik.touched.quantity && formik.errors.quantity && (
                    <Text style={{ color: "red" }}>
                      {formik.errors.quantity}
                    </Text>
                  )}

                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-2xl`}
                  >
                    Categories
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
                      onPress={() => handleCheckBoxToggle("Face")}
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
                        {selectedTypes.includes("Face") && (
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
                        Face
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
                  </View>
                  {formik.touched.type && formik.errors.type && (
                    <Text style={{ color: "red" }}>{formik.errors.type}</Text>
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

                  {selectedTypes.includes("Face") ? (
                    <>
                      <Text
                        style={{ color: textColor }}
                        className={`font-semibold text-2xl`}
                      >
                        Face Products
                      </Text>
                      <View
                        className={`flex flex-row justify-start gap-x-4 flex-wrap`}
                      >
                        {faceProducts.map((product) => (
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

                  {formik.touched.product && formik.errors.product && (
                    <Text style={{ color: "red" }}>
                      {formik.errors.product}
                    </Text>
                  )}

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
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      )}
    </>
  );
}
