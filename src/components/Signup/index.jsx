import React, { useState, useEffect } from "react";
import salonLogo from "@assets/salon-logo.png";
import salonLogoWhite from "@assets/salon-logo-white.png";
import {
  Image,
  View,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  BackHandler,
} from "react-native";
import { changeColor } from "@utils";
import { Feather } from "@expo/vector-icons";

export default function ({
  initialState,
  title,
  description,
  navigateBack,
  navigateTo,
  buttonTitle,
  footerTitle,
  footerLinkTitle,
  dimensionLayout,
}) {
  const { backgroundColor, textColor, colorScheme } = changeColor();
  const imageSource = colorScheme === "dark" ? salonLogoWhite : salonLogo;
  const borderColor =
    colorScheme === "dark" ? "border-neutral-light" : "border-neutral-dark";

  const [isTextInputFocused, setIsTextInputFocused] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(500);

  const handleTextInputFocus = () => {
    setIsTextInputFocused(true);

    setScrollViewHeight(keyboardOpen ? 100 : 500);
  };

  const handleTextInputBlur = () => {
    setIsTextInputFocused(false);
  };

  useEffect(() => {
    setFormData({
      ...formData,
      textColor: textColor,
      placeholderColor: textColor,
    });
  }, [colorScheme, textColor]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        setScrollViewHeight(500);
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

        setScrollViewHeight(100);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardOpen(false);

        setScrollViewHeight(500);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleButtonClick = () => {
    setScrollViewHeight(keyboardOpen ? 100 : 500);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ backgroundColor }} className={`relative flex-1`}>
        <View className={`absolute top-3 z-[1000]`}>
          <TouchableOpacity onPress={navigateBack}>
            <Feather name="chevron-left" size={50} color={textColor} />
          </TouchableOpacity>
        </View>
        <View
          className={`justify-start ${
            dimensionLayout ? "flex-col items-center" : "flex-row items-start"
          }`}
        >
          <Image
            source={imageSource}
            className={`${
              dimensionLayout ? "w-[60%] h-[60%]" : "w-[40%] h-[55%]"
            }`}
            resizeMode="contain"
          />
          <View className={`flex-1 items-center justify-start`}>
            <Text
              style={{ color: formData.textColor }}
              className={`font-semibold ${
                dimensionLayout ? "my-2 text-3xl" : "my-1 text-xl"
              }`}
            >
              {title}
            </Text>
            <Text
              style={{ color: formData.textColor }}
              className={`mb-2 text-sm font-base`}
            >
              {description}
            </Text>
            <KeyboardAvoidingView
              behavior="padding"
              className={`${dimensionLayout ? "w-[300px]" : "w-[375px]"}`}
            >
              <ScrollView style={{ height: scrollViewHeight }}>
                {Object.keys(initialState).map((field) => (
                  <TextInput
                    key={field}
                    style={{ color: formData.textColor }}
                    className={`border-b ${
                      dimensionLayout ? "mb-6" : "mb-3"
                    } ${borderColor}`}
                    placeholder={`Enter your ${field}`}
                    placeholderTextColor={formData.placeholderColor}
                    autoCapitalize="none"
                    onFocus={() => {
                      handleTextInputFocus();
                    }}
                    onBlur={() => {
                      handleTextInputBlur();
                    }}
                    onChangeText={(text) => handleInputChange(field, text)}
                    value={formData[field]}
                    secureTextEntry={field === "password"}
                    keyboardType={
                      field === "contactNumber" ? "numeric" : "default"
                    }
                  />
                ))}
                <View
                  className={`items-center justify-start ${
                    dimensionLayout ? "flex-col" : "flex-row gap-x-2"
                  }`}
                >
                  <TouchableOpacity onPress={navigateTo}>
                    <View className={`w-full mb-2`}>
                      <View
                        className={`py-2 px-6 rounded-lg bg-primary-accent ${
                          dimensionLayout ? "flex-col" : "flex-row gap-x-2"
                        }`}
                      >
                        <Text
                          className={`text-neutral-light font-semibold text-center text-lg`}
                          style={{ color: textColor }}
                        >
                          {buttonTitle}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <View className={`gap-x-2 flex-row`}>
                    <Text style={{ color: textColor }} className={`text-base`}>
                      {footerTitle}
                    </Text>
                    <TouchableOpacity>
                      <Text className={`text-primary-accent text-base`}>
                        {footerLinkTitle}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
