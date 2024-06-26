import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  BackHandler,
  TextInput,
  ScrollView,
} from "react-native";
import { changeColor } from "@utils";
import { BackIcon } from "@helpers";
import salonLogo from "@assets/salon-logo.png";
import salonLogoWhite from "@assets/salon-logo-white.png";
import { useResetPasswordMutation } from "../../state/api/reducer";
import { resetPasswordValidation } from "../../validation";
import { useFormik } from "formik";
import Toast from "react-native-toast-message";
import { LoadingScreen } from "@components";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

export default function () {
  const navigation = useNavigation();
  const { backgroundColor, textColor, borderColor, colorScheme } =
    changeColor();
  const imageSource = colorScheme === "dark" ? salonLogoWhite : salonLogo;
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [isNewPasswordVisible, setNewPasswordVisibility] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisibility] =
    useState(false);

  const toggleNewPasswordVisibility = () => {
    setNewPasswordVisibility(!isNewPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisibility(!isConfirmPasswordVisible);
  };

  const formik = useFormik({
    initialValues: {
      verificationCode: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: resetPasswordValidation,
    onSubmit: (values) => {
      const { verificationCode, newPassword, confirmPassword } = values;
      resetPassword({
        verificationCode,
        newPassword,
        confirmPassword,
      })
        .unwrap()
        .then((response) => {
          formik.resetForm();
          Toast.show({
            type: "success",
            position: "top",
            text1: "Reset Successfully",
            text2: `${response?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
          navigation.navigate("LoginUser");
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Reset Failed",
            text2: `${error?.data?.error?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
        });
    },
  });

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        return true;
      }
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardOpen(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardOpen(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleTextInputFocus = () => {
    if (keyboardOpen) {
      return;
    }
    setKeyboardOpen(true);
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
              className={`relative flex-1`}
            >
              <BackIcon
                navigateBack={navigation.goBack}
                textColor={textColor}
              />
              <KeyboardAvoidingView
                behavior="height"
                className={`flex-1 justify-start mt-5 items-center flex-col`}
              >
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  decelerationRate="fast"
                  scrollEventThrottle={1}
                >
                  <View
                    className={`w-[300px] h-[300px] justify-center items-center`}
                  >
                    <Image source={imageSource} resizeMode="contain" />
                  </View>
                  <View className={`items-center justify-start`}>
                    <Text
                      style={{ color: textColor }}
                      className={`font-semibold mt-6 text-3xl text-center`}
                    >
                      Reset Your Password
                    </Text>
                    <Text
                      style={{ color: textColor }}
                      className={`my-2 text-xl font-base text-center`}
                    >
                      Enter the verification code {"\n"}
                      sent from you!
                    </Text>
                    <View className={`w-[300px]`}>
                      <TextInput
                        style={{ color: textColor, borderColor }}
                        className={`border-b my-2 text-lg`}
                        placeholder="Enter your verificationCode"
                        placeholderTextColor={textColor}
                        autoCapitalize="none"
                        handleTextInputFocus={handleTextInputFocus}
                        onChangeText={formik.handleChange("verificationCode")}
                        onBlur={formik.handleBlur("verificationCode")}
                        value={formik.values.verificationCode}
                      />
                      {formik.touched.verificationCode &&
                        formik.errors.verificationCode && (
                          <Text style={{ color: "red" }}>
                            {formik.errors.verificationCode}
                          </Text>
                        )}
                      <View className={`relative`}>
                        <TextInput
                          style={{ color: textColor, borderColor }}
                          className={`border-b mb-4 mt-3 text-lg`}
                          placeholder="Enter your new password"
                          placeholderTextColor={textColor}
                          autoCapitalize="none"
                          handleTextInputFocus={handleTextInputFocus}
                          onChangeText={formik.handleChange("newPassword")}
                          onBlur={formik.handleBlur("newPassword")}
                          value={formik.values.newPassword}
                          secureTextEntry={!isNewPasswordVisible}
                        />
                        <TouchableOpacity
                          className={`absolute right-4 top-3`}
                          onPress={toggleNewPasswordVisibility}
                        >
                          <Feather
                            name={isNewPasswordVisible ? "eye" : "eye-off"}
                            size={24}
                            color={textColor}
                          />
                        </TouchableOpacity>
                      </View>
                      {formik.touched.newPassword &&
                        formik.errors.newPassword && (
                          <Text style={{ color: "red" }} className={`mb-3`}>
                            {formik.errors.newPassword}
                          </Text>
                        )}
                      <View className={`relative`}>
                        <TextInput
                          style={{ color: textColor, borderColor }}
                          className={`border-b mb-4 mt-2  pb-1 text-lg`}
                          placeholder="Enter your confirm password"
                          placeholderTextColor={textColor}
                          autoCapitalize="none"
                          handleTextInputFocus={handleTextInputFocus}
                          onChangeText={formik.handleChange("confirmPassword")}
                          onBlur={formik.handleBlur("confirmPassword")}
                          value={formik.values.confirmPassword}
                          secureTextEntry={!isConfirmPasswordVisible}
                        />
                        <TouchableOpacity
                          className={`absolute right-4 top-3`}
                          onPress={toggleConfirmPasswordVisibility}
                        >
                          <Feather
                            name={isConfirmPasswordVisible ? "eye" : "eye-off"}
                            size={24}
                            color={textColor}
                          />
                        </TouchableOpacity>
                      </View>
                      {formik.touched.confirmPassword &&
                        formik.errors.confirmPassword && (
                          <Text style={{ color: "red" }} className={`mb-3`}>
                            {formik.errors.confirmPassword}
                          </Text>
                        )}
                      <View className={`items-center flex-col justify-start`}>
                        <TouchableOpacity
                          onPress={formik.handleSubmit}
                          disabled={!formik.isValid}
                        >
                          <View className={`w-full mt-1 mb-3`}>
                            <View
                              className={`py-[8px] mt-2 px-8 rounded-lg bg-primary-accent ${
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
