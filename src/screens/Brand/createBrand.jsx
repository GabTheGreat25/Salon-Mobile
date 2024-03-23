import React from "react";
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
import { useAddBrandMutation } from "../../state/api/reducer";
import { createBrandValidation } from "../../validation";
import Toast from "react-native-toast-message";

export default function () {
  const navigation = useNavigation();
  const { backgroundColor, textColor, colorScheme } = changeColor();

  const borderColor = colorScheme === "dark" ? "#e5e5e5" : "#212B36";

  const [addBrand, { isLoading }] = useAddBrandMutation();
  const formik = useFormik({
    initialValues: {
      brand_name: "",
    },
    validationSchema: createBrandValidation,
    onSubmit: (values) => {
      addBrand(values)
        .unwrap()
        .then((response) => {
          navigation.navigate("Brand");
          formik.resetForm();
          Toast.show({
            type: "success",
            position: "top",
            text1: "Brand Successfully Created",
            text2: `${response?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Creating Brand",
            text2: `${error?.data?.error?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
        });
    },
  });

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
              className={`relative flex-1`}
            >
              <BackIcon
                navigateBack={navigation.goBack}
                textColor={textColor}
              />
              <View className={`relative flex-1 pt-12`}>
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
                    Create Brand
                  </Text>
                  <TextInput
                    style={{ color: textColor }}
                    className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                    placeholder="Enter your brand name"
                    placeholderTextColor={textColor}
                    autoCapitalize="none"
                    onChangeText={formik.handleChange("brand_name")}
                    onBlur={formik.handleBlur("brand_name")}
                    value={formik.values.brand_name}
                  />
                  {formik.touched.brand_name && formik.errors.brand_name && (
                    <Text style={{ color: "red" }}>
                      {formik.errors.brand_name}
                    </Text>
                  )}

                  <View className={`my-4 items-center justify-center flex-col`}>
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
