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
import { useAddExclusionMutation } from "../../state/api/reducer";
import { createExclusionValidation } from "../../validation";
import Toast from "react-native-toast-message";

export default function () {
  const navigation = useNavigation();
  const { backgroundColor, textColor, borderColor } = changeColor();

  const [addExclusion, { isLoading }] = useAddExclusionMutation();
  const formik = useFormik({
    initialValues: {
      ingredient_name: "",
      type: [],
    },
    validationSchema: createExclusionValidation,
    onSubmit: (values) => {
      addExclusion(values)
        .unwrap()
        .then((response) => {
          navigation.navigate("Exclusion");
          formik.resetForm();
          Toast.show({
            type: "success",
            position: "top",
            text1: "Exclusion Successfully Created",
            text2: `${response?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Creating Exclusion",
            text2: `${error?.data?.error?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
        });
    },
  });

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
                    Create Exclusion
                  </Text>
                  <TextInput
                    style={{ color: textColor, borderColor }}
                    className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-full my-2`}
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
                          borderColor,
                          backgroundColor,
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
                          borderColor,
                          backgroundColor,
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
                          borderColor,
                          backgroundColor,
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
                          borderColor,
                          backgroundColor,
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
                          borderColor,
                          backgroundColor,
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
                          borderColor,
                          backgroundColor,
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

                  <View className={`my-4 items-center justify-center flex-col`}>
                    <TouchableOpacity
                      onPress={formik.handleSubmit}
                      disabled={!formik.isValid}
                    >
                      <View className={`mb-2 flex justify-center items-center`}>
                        <View
                          className={`py-2 rounded-lg bg-primary-accent w-[175px] ${
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
              </View>
            </SafeAreaView>
          </TouchableWithoutFeedback>
        </>
      )}
    </>
  );
}
