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
} from "react-native";
import { changeColor } from "@utils";
import { BackIcon } from "@helpers";
import { useNavigation } from "@react-navigation/native";
import { LoadingScreen } from "@components";
import { Feather } from "@expo/vector-icons";
import { useFormik } from "formik";
import { useUpdateUserPasswordMutation } from "../../state/api/reducer";
import { updatePasswordValidation } from "../../validation";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

export default function () {
  const navigation = useNavigation();
  const { backgroundColor, textColor, colorScheme } = changeColor();
  const borderColor =
    colorScheme === "dark" ? "border-neutral-light" : "border-neutral-dark";

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [updatePassword, { isLoading }] = useUpdateUserPasswordMutation();

  const auth = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: updatePasswordValidation,
    onSubmit: (values) => {
      const { oldPassword, newPassword, confirmPassword } = values;
      updatePassword({
        id: auth?.user?._id,
        oldPassword,
        newPassword,
        confirmPassword,
      })
        .unwrap()
        .then((response) => {
          Toast.show({
            type: "success",
            position: "top",
            text1: "Users Password Successfully Updated",
            text2: `${response?.message}`,
            visibilityTime: 3000,
            atoggleConfirmPasswordVisibilityutoHide: true,
          });
          formik.resetForm();
          navigation.goBack();
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Updating Users Password",
            text2: `${error?.data?.error?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
        });
    },
  });

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleTextInputFocus = () => {
    setScrollViewHeight(keyboardOpen ? 450 : scroll);
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
            <View className={`flex-1 py-12`}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                decelerationRate="fast"
                scrollEventThrottle={1}
                className={`px-6`}
              >
                <Text
                  style={{ color: textColor }}
                  className={`py-6 font-semibold text-center text-3xl`}
                >
                  Update Your Password
                </Text>
                <Text
                  style={{ color: textColor }}
                  className={`font-semibold text-base mb-1`}
                >
                  Old Password
                </Text>
                <View className={`relative`}>
                  <TextInput
                    style={{ color: textColor }}
                    className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                    placeholder="Enter your old password"
                    placeholderTextColor={textColor}
                    autoCapitalize="none"
                    handleTextInputFocus={handleTextInputFocus}
                    onChangeText={formik.handleChange("oldPassword")}
                    onBlur={formik.handleBlur("oldPassword")}
                    value={formik.values.oldPassword}
                    secureTextEntry={!showOldPassword}
                  />
                  <TouchableOpacity
                    className={`absolute right-4 top-5`}
                    onPress={toggleOldPasswordVisibility}
                  >
                    <Feather
                      name={showOldPassword ? "eye" : "eye-off"}
                      size={24}
                      color={textColor}
                    />
                  </TouchableOpacity>
                </View>
                {formik.touched.oldPassword && formik.errors.oldPassword && (
                  <Text style={{ color: "red" }}>
                    {formik.errors.oldPassword}
                  </Text>
                )}

                <Text
                  style={{ color: textColor }}
                  className={`font-semibold text-base mb-1`}
                >
                  New Password
                </Text>
                <View className={`relative`}>
                  <TextInput
                    style={{ color: textColor }}
                    className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                    placeholder="Enter your new password"
                    placeholderTextColor={textColor}
                    autoCapitalize="none"
                    handleTextInputFocus={handleTextInputFocus}
                    onChangeText={formik.handleChange("newPassword")}
                    onBlur={formik.handleBlur("newPassword")}
                    value={formik.values.newPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    className={`absolute right-4 top-5`}
                    onPress={togglePasswordVisibility}
                  >
                    <Feather
                      name={showPassword ? "eye" : "eye-off"}
                      size={24}
                      color={textColor}
                    />
                  </TouchableOpacity>
                </View>
                {formik.touched.newPassword && formik.errors.newPassword && (
                  <Text style={{ color: "red" }}>
                    {formik.errors.newPassword}
                  </Text>
                )}

                <Text
                  style={{ color: textColor }}
                  className={`font-semibold text-base mb-1`}
                >
                  Confirm Password
                </Text>
                <View className={`relative`}>
                  <TextInput
                    style={{ color: textColor }}
                    className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                    placeholder="Confirm your password"
                    placeholderTextColor={textColor}
                    autoCapitalize="none"
                    handleTextInputFocus={handleTextInputFocus}
                    onChangeText={formik.handleChange("confirmPassword")}
                    onBlur={formik.handleBlur("confirmPassword")}
                    value={formik.values.confirmPassword}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    className={`absolute right-4 top-5`}
                    onPress={toggleConfirmPasswordVisibility}
                  >
                    <Feather
                      name={showConfirmPassword ? "eye" : "eye-off"}
                      size={24}
                      color={textColor}
                    />
                  </TouchableOpacity>
                </View>
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <Text style={{ color: "red" }}>
                      {formik.errors.confirmPassword}
                    </Text>
                  )}

                <View
                  className={`mt-4 items-center justify-center flex-col
                    `}
                >
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
