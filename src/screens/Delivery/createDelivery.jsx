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
  Alert,
} from "react-native";
import { changeColor } from "@utils";
import { BackIcon } from "@helpers";
import { useNavigation } from "@react-navigation/native";
import { LoadingScreen } from "@components";
import { useFormik } from "formik";
import {
  useAddDeliveryMutation,
  useGetDeliveriesQuery,
  useGetProductsQuery,
} from "../../state/api/reducer";
import { createDeliveryValidation } from "../../validation";
import Toast from "react-native-toast-message";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function () {
  const navigation = useNavigation();
  const { backgroundColor, textColor, colorScheme } = changeColor();

  const borderColor = colorScheme === "dark" ? "#e5e5e5" : "#212B36";

  const { refetch: refetchDeliveries } = useGetDeliveriesQuery();
  const { data: products } = useGetProductsQuery();

  const [addDelivery, { isLoading }] = useAddDeliveryMutation();

  const formik = useFormik({
    initialValues: {
      company_name: "",
      date: "",
      price: "",
      status: "pending",
      quantity: "",
      type: [],
      product: [],
    },
    validationSchema: createDeliveryValidation,
    onSubmit: (values) => {
      addDelivery(values)
        .unwrap()
        .then((response) => {
          refetchDeliveries();
          navigation.navigate("Delivery");
          formik.resetForm();
          Toast.show({
            type: "success",
            position: "top",
            text1: "Delivery Successfully Created",
            text2: `${response?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Creating Delivery",
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
    if (event.type === "dismissed" || !date) {
      return;
    }

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      Alert.alert("Error", "Please select a date from today onwards.");
      return;
    }

    if (selectedDate.getDay() === 1) {
      Alert.alert(
        "Error",
        "We are closed on Mondays. Please select another date."
      );
      return;
    }

    setSelectedDate(selectedDate);
    formik.setFieldValue("date", selectedDate.toISOString().split("T")[0]);
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView
            style={{ backgroundColor }}
            className={`relative flex-1`}
          >
            <BackIcon navigateBack={navigation.goBack} textColor={textColor} />
            <View className={`pt-12`}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                decelerationRate="fast"
                scrollEventThrottle={1}
                className={`px-6`}
              >
                <Text
                  style={{ color: textColor }}
                  className={`pb-6 font-semibold text-center text-3xl`}
                >
                  Create Delivery
                </Text>
                <TextInput
                  style={{ color: textColor }}
                  className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                  placeholder="Enter your product name"
                  placeholderTextColor={textColor}
                  autoCapitalize="none"
                  onChangeText={formik.handleChange("company_name")}
                  onBlur={formik.handleBlur("company_name")}
                  value={formik.values.company_name}
                />
                {formik.touched.company_name && formik.errors.company_name && (
                  <Text style={{ color: "red" }}>
                    {formik.errors.company_name}
                  </Text>
                )}

                <TextInput
                  style={{ color: textColor }}
                  className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                  placeholder="Enter date"
                  placeholderTextColor={textColor}
                  onFocus={showDatepicker}
                  value={formik.values.date}
                />
                {showDatePicker && (
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
                {formik.touched.date && formik.errors.date && (
                  <Text style={{ color: "red" }}>{formik.errors.date}</Text>
                )}

                <TextInput
                  style={{ color: textColor }}
                  className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                  placeholder="Enter the price"
                  placeholderTextColor={textColor}
                  keyboardType="numeric"
                  autoCapitalize="none"
                  onChangeText={formik.handleChange("price")}
                  onBlur={formik.handleBlur("price")}
                  value={formik.values.price}
                />
                {formik.touched.price && formik.errors.price && (
                  <Text style={{ color: "red" }}>{formik.errors.price}</Text>
                )}

                <TextInput
                  style={{ color: textColor }}
                  className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                  placeholder="Enter the quantity"
                  placeholderTextColor={textColor}
                  keyboardType="numeric"
                  autoCapitalize="none"
                  onChangeText={formik.handleChange("quantity")}
                  onBlur={formik.handleBlur("quantity")}
                  value={formik.values.quantity}
                />
                {formik.touched.quantity && formik.errors.quantity && (
                  <Text style={{ color: "red" }}>{formik.errors.quantity}</Text>
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

                {formik.touched.product && formik.errors.product && (
                  <Text style={{ color: "red" }}>{formik.errors.product}</Text>
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
              </ScrollView>
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      )}
    </>
  );
}
