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
} from "react-native";
import { changeColor } from "@utils";
import { BackIcon, FormInputs } from "@helpers";
import salonLogo from "@assets/salon-logo.png";
import salonLogoWhite from "@assets/salon-logo-white.png";

export default function ({
  initialState,
  title,
  description,
  socialMediaIcons,
  navigateTo,
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
  const [formData, setFormData] = useState({ ...initialState });
  const [keyboardOpen, setKeyboardOpen] = useState(false);

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

  const handleInputChange = (field, text) =>
    setFormData({ ...formData, [field]: text });

  const handleTextInputFocus = () => {
    if (keyboardOpen) {
      return;
    }
    setKeyboardOpen(true);
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
              <FormInputs
                initialState={initialState}
                formData={formData}
                dimensionLayout={dimensionLayout}
                handleTextInputFocus={handleTextInputFocus}
                handleInputChange={handleInputChange}
                borderColor={borderColor}
              />
              <View
                className={`items-center ${
                  dimensionLayout
                    ? "flex-col justify-start"
                    : "flex-row gap-x-6 justify-center"
                }`}
              >
                <TouchableOpacity onPress={navigateTo}>
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
                  <TouchableOpacity onPress={linkNavigateTo}>
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
