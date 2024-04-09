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
import { useLoginMutation } from "../../state/api/reducer";
import { loginUserValidation } from "../../validation";
import { useFormik } from "formik";
import Toast from "react-native-toast-message";
import { Feather } from "@expo/vector-icons";

export default function ({
  title,
  description,
  navigateBack,
  buttonTitle,
  linkNavigateTo,
  linkTitle,
  showComponent,
  footerTitle,
  footerLink,
  footerLinkTitle,
}) {
  const { backgroundColor, textColor, borderColor, colorScheme } =
    changeColor();
  const imageSource = colorScheme === "dark" ? salonLogoWhite : salonLogo;
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [isPasswordVisible, setPasswordVisibility] = useState(false);

  const [login] = useLoginMutation();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginUserValidation,
    onSubmit: (values) => {
      login(values)
        .unwrap()
        .then((response) => {
          formik.resetForm();
          Toast.show({
            type: "success",
            position: "top",
            text1: "Login Successful",
            text2: `${response?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Logging In",
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

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!isPasswordVisible);
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView
          style={{ backgroundColor }}
          className={`relative flex-1 pt-6`}
        >
          <BackIcon navigateBack={navigateBack} textColor={textColor} />
          <KeyboardAvoidingView
            behavior="height"
            className={`flex-1 justify-center items-center flex-col`}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              decelerationRate="fast"
              scrollEventThrottle={1}
            >
              <View
                className={`w-[280px] h-[280px] justify-center items-center`}
              >
                <Image source={imageSource} resizeMode="contain" />
              </View>
              <View className={`items-center justify-start`}>
                <Text
                  style={{ color: textColor }}
                  className={`font-semibold mt-8 text-3xl text-center`}
                >
                  {title}
                </Text>
                <Text
                  style={{ color: textColor }}
                  className={`mb-2 text-xl font-base text-center`}
                >
                  {description}
                </Text>
                <View className={`w-[300px]`}>
                  <TextInput
                    style={{ color: textColor, borderColor }}
                    className={`border-b mt-4 mb-1 pb-1 text-lg`}
                    placeholder="Enter your email"
                    placeholderTextColor={textColor}
                    autoCapitalize="none"
                    handleTextInputFocus={handleTextInputFocus}
                    onChangeText={formik.handleChange("email")}
                    onBlur={formik.handleBlur("email")}
                    value={formik.values.email}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <Text style={{ color: "red" }}>{formik.errors.email}</Text>
                  )}
                  <View className={`relative`}>
                    <TextInput
                      style={{ color: textColor, borderColor }}
                      className={`border-b mt-4 mb-1 pb-1 text-lg`}
                      placeholder="Enter your password"
                      placeholderTextColor={textColor}
                      autoCapitalize="none"
                      handleTextInputFocus={handleTextInputFocus}
                      onChangeText={formik.handleChange("password")}
                      onBlur={formik.handleBlur("password")}
                      value={formik.values.password}
                      secureTextEntry={!isPasswordVisible}
                    />
                    <TouchableOpacity
                      className={`absolute right-4 top-4`}
                      onPress={togglePasswordVisibility}
                    >
                      <Feather
                        name={isPasswordVisible ? "eye" : "eye-off"}
                        size={24}
                        color={textColor}
                      />
                    </TouchableOpacity>
                  </View>
                  {formik.touched.password && formik.errors.password && (
                    <Text style={{ color: "red" }}>
                      {formik.errors.password}
                    </Text>
                  )}
                  <View className={`items-center flex-col justify-start pt-4`}>
                    <TouchableOpacity
                      onPress={formik.handleSubmit}
                      disabled={!formik.isValid}
                    >
                      <View className={`w-full mt-2 mb-3`}>
                        <View
                          className={`py-[8px] px-8 rounded-lg bg-primary-accent ${
                            !formik.isValid ? "opacity-50" : "opacity-100"
                          }`}
                        >
                          <Text
                            className={`font-semibold text-center text-lg`}
                            style={{ color: textColor }}
                          >
                            {buttonTitle}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    {showComponent && (
                      <TouchableOpacity onPress={linkNavigateTo}>
                        <Text
                          className={`mt-2 text-lg underline`}
                          style={{ color: textColor }}
                        >
                          {linkTitle}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                {showComponent && (
                  <View className={`justify-center items-center`}>
                    <View className={`mb-4 mt-6 gap-x-1 flex-row`}>
                      <Text
                        style={{ color: textColor }}
                        className={`text-lg font-semibold`}
                      >
                        {footerTitle}
                      </Text>
                      <TouchableOpacity onPress={footerLink}>
                        <Text
                          className={`text-primary-accent text-lg font-semibold`}
                        >
                          {footerLinkTitle}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </>
  );
}
