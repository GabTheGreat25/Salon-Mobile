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
} from "react-native";
import { changeColor } from "@utils";
import { BackIcon } from "@helpers";
import salonLogo from "@assets/salon-logo.png";
import salonLogoWhite from "@assets/salon-logo-white.png";
import { useForgotPasswordMutation } from "../../state/api/reducer";
import { forgotPasswordValidation } from "../../validation";
import { useFormik } from "formik";
import Toast from "react-native-toast-message";
import { LoadingScreen } from "@components";
import { useNavigation } from "@react-navigation/native";

export default function () {
  const navigation = useNavigation();
  const { backgroundColor, textColor, borderColor, colorScheme } =
    changeColor();

  const imageSource = colorScheme === "dark" ? salonLogoWhite : salonLogo;
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgotPasswordValidation,
    onSubmit: (values) => {
      forgotPassword(values?.email)
        .unwrap()
        .then((response) => {
          formik.resetForm();
          Toast.show({
            type: "success",
            position: "top",
            text1: "Code Sent Successfully",
            text2: `${response?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });

          navigation.navigate("ResetPassword");
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Email not found",
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
                className={`flex-1 justify-center items-center flex-col`}
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
                    Forget Password?
                  </Text>
                  <Text
                    style={{ color: textColor }}
                    className={`my-2 text-xl font-base text-center`}
                  >
                    Please enter your email to reset you password.
                  </Text>
                  <View className={`w-[300px]`}>
                    <TextInput
                      style={{ color: textColor, borderColor }}
                      className={`border-b mt-4 pb-1 text-lg`}
                      placeholder="Enter your email"
                      placeholderTextColor={textColor}
                      autoCapitalize="none"
                      handleTextInputFocus={handleTextInputFocus}
                      onChangeText={formik.handleChange("email")}
                      onBlur={formik.handleBlur("email")}
                      value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <Text style={{ color: "red" }}>
                        {formik.errors.email}
                      </Text>
                    )}
                    <View className={`items-center flex-col justify-start`}>
                      <TouchableOpacity
                        onPress={formik.handleSubmit}
                        disabled={!formik.isValid}
                      >
                        <View className={`w-full mt-1 mb-3`}>
                          <View
                            className={`py-[8px] mt-8 px-8 rounded-lg bg-primary-accent ${
                              !formik.isValid ? "opacity-50" : "opacity-100"
                            }`}
                          >
                            <Text
                              className={`font-semibold text-center text-lg`}
                              style={{ color: textColor }}
                            >
                              Continue
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </KeyboardAvoidingView>
            </SafeAreaView>
          </TouchableWithoutFeedback>
        </>
      )}
    </>
  );
}
