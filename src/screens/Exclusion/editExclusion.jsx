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
  useUpdateExclusionMutation,
  useGetExclusionByIdQuery,
} from "../../state/api/reducer";
import { useFormik } from "formik";
import { editExclusionValidation } from "../../validation";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { LoadingScreen } from "@components";
import { changeColor } from "@utils";
import { BackIcon } from "@helpers";

export default function ({ route }) {
  const { id } = route.params;
  const navigation = useNavigation();

  const {
    data,
    isLoading: isExclusionLoading,
    refetch,
  } = useGetExclusionByIdQuery(id);
  const ingredients = data?.details;
  console.log(ingredients);

  const [updateExclusion, { isLoading }] = useUpdateExclusionMutation();

  const { backgroundColor, textColor, colorScheme } = changeColor();
  const borderColor =
    colorScheme === "dark" ? "border-neutral-light" : "border-neutral-dark";

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ingredient_name: ingredients?.ingredient_name || "",
      type: ingredients?.type || [],
    },
    validationSchema: editExclusionValidation,
    onSubmit: (values) => {
      values.type = selectedTypes;
      updateExclusion({ id: data?.details?._id, payload: values })
        .unwrap()
        .then((response) => {
          console.log(response);
          refetch();
          Toast.show({
            type: "success",
            position: "top",
            text1: "Exclusion Details Successfully Updated",
            text2: `${response?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
          navigation.navigate("Exclusion");
        })
        .catch((error) => {
          console.log(error);
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Updating Exclusion Details",
            text2: `${error?.data?.error?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
        });
    },
  });

  const [selectedTypes, setSelectedTypes] = useState([]);
  console.log(selectedTypes);

  const handleCheckBoxToggle = (value) => {
    setSelectedTypes((prevSelectedTypes) => {
      if (prevSelectedTypes.includes(value)) {
        return prevSelectedTypes.filter((item) => item !== value);
      } else {
        return [...prevSelectedTypes, value];
      }
    });
  };

  useEffect(() => {
    setSelectedTypes(formik.values.type);
  }, [formik.values.type]);

  return (
    <>
      {isLoading || isExclusionLoading ? (
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
                <View className="pt-10 pb-2">
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-center pb-6 text-3xl`}
                  >
                    Update Exclusion Details
                  </Text>
                  <TextInput
                    style={{ color: textColor }}
                    className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                    placeholder="Enter your exclusion name"
                    placeholderTextColor={textColor}
                    autoCapitalize="none"
                    onChangeText={formik.handleChange("ingredient_name")}
                    onBlur={formik.handleBlur("ingredient_name")}
                    value={formik.values.ingredient_name}
                  />
                  {formik.touched.ingredient_name &&
                    formik.errors.ingredient_name && (
                      <Text style={{ color: "red" }}>
                        {formik.errors.ingredient_name}
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
      )}
    </>
  );
}
