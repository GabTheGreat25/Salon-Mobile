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
import { useLoginMutation } from "../../state/api/reducer";
import { useFormik } from "formik";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { Feather } from "@expo/vector-icons";

export default function ({
  title,
  description,
  socialMediaIcons,
  navigateBack,
  buttonTitle,
  linkNavigateTo,
  linkTitle,
  divider,
  showComponent,
  footerTitle,
  footerLink,
  footerLinkTitle,
  dimensionLayout,
}) {
  const { backgroundColor, textColor, colorScheme } = changeColor();
  const imageSource = colorScheme === "dark" ? salonLogoWhite : salonLogo;
  const borderColor =
    colorScheme === "dark" ? "border-neutral-light" : "border-neutral-dark";
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [isPasswordVisible, setPasswordVisibility] = useState(false);

  const [login, { isError, isLoading }] = useLoginMutation();
  const navigation = useNavigation();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      login(values)
        .unwrap()
        .then((response) => {
          console.log("Response from API:", response);
          navigation.navigate("Test");
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ backgroundColor }} className={`relative flex-1`}>
        <BackIcon navigateBack={navigateBack} textColor={textColor} />
        <KeyboardAvoidingView
          behavior="height"
          className={`flex-1 justify-center items-center ${
            dimensionLayout ? "flex-col" : "flex-row mb-10"
          }`}
        >
          <View className={`w-[300px] h-[300px] justify-center items-center`}>
            <Image source={imageSource} resizeMode="contain" />
          </View>
          <View className={`items-center justify-start`}>
            <Text
              style={{ color: textColor }}
              className={`font-semibold mt-5 text-3xl text-center`}
            >
              {title}
            </Text>
            <Text
              style={{ color: textColor }}
              className={`mt-1 mb-2 text-base font-base text-center`}
            >
              {description}
            </Text>
            <View className={`${dimensionLayout ? "w-[300px]" : "w-[375px]"}`}>
              <TextInput
                style={{ color: textColor }}
                className={`border-b ${
                  dimensionLayout ? "mb-4" : "mb-3"
                } ${borderColor}`}
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
              <TextInput
                style={{ color: textColor }}
                className={`border-b ${
                  dimensionLayout ? "mb-4" : "mb-3"
                } ${borderColor}`}
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
                style={{ position: "absolute", top: 40, right: 15 }}
                onPress={togglePasswordVisibility}
              >
                <Feather
                  name={isPasswordVisible ? "eye" : "eye-off"}
                  size={24}
                  color={textColor}
                />
              </TouchableOpacity>
              {formik.touched.password && formik.errors.password && (
                <Text style={{ color: "red" }}>{formik.errors.password}</Text>
              )}
              <View
                className={`items-center ${
                  dimensionLayout
                    ? "flex-col justify-start"
                    : "flex-row gap-x-6 justify-center"
                }`}
              >
                <TouchableOpacity
                  onPress={formik.handleSubmit}
                  disabled={!formik.isValid}
                >
                  <View
                    className={`w-full mb-1 ${
                      dimensionLayout ? "mt-0" : "mt-2"
                    }`}
                  >
                    <View
                      className={`py-[8px] px-8 rounded-lg bg-primary-accent`}
                    >
                      <Text
                        className={`font-semibold text-center ${
                          dimensionLayout ? "text-lg" : "text-base"
                        }`}
                        style={{ color: textColor }}
                      >
                        {buttonTitle}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                {showComponent && (
                  <TouchableOpacity
                    onPress={linkNavigateTo}
                    disabled={!formik.isValid}
                  >
                    <Text
                      className={`mt-1 text-base underline`}
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
                <Text
                  className={`${dimensionLayout ? "my-3" : "mt-0 mb-2"}`}
                  style={{ color: textColor }}
                >
                  {divider}
                </Text>
                <View
                  className={`flex-row justify-center ${
                    dimensionLayout ? "gap-x-5" : "gap-x-6"
                  }`}
                >
                  {socialMediaIcons.map((icon) => (
                    <TouchableOpacity key={icon.key}>
                      <Image
                        sclassName={`w-[40px] h-[40px]`}
                        source={icon.source}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                <View className={`my-2 gap-x-3 flex-row`}>
                  <Text style={{ color: textColor }} className={`text-base`}>
                    {footerTitle}
                  </Text>
                  <TouchableOpacity onPress={footerLink}>
                    <Text className={`text-primary-accent text-base`}>
                      {footerLinkTitle}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
