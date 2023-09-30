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
  BackHandler,
} from "react-native";
import { changeColor } from "@utils";
import { BackIcon, FormInputs } from "@helpers";
import salonLogo from "@assets/salon-logo.png";
import salonLogoWhite from "@assets/salon-logo-white.png";

const INITIAL_SCROLLVIEW_HEIGHT = 500;
const KEYBOARD_OPEN_SCROLLVIEW_HEIGHT = 100;

export default function MyComponent({
  initialState,
  title,
  description,
  navigateTo,
  navigateBack,
  buttonTitle,
  footerTitle,
  footerLinkTitle,
  dimensionLayout,
}) {
  const { backgroundColor, textColor, colorScheme } = changeColor();
  const imageSource = colorScheme === "dark" ? salonLogoWhite : salonLogo;
  const borderColor =
    colorScheme === "dark" ? "border-neutral-light" : "border-neutral-dark";

  const [formData, setFormData] = useState({
    ...initialState,
    textColor,
    placeholderColor: textColor,
  });
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(
    INITIAL_SCROLLVIEW_HEIGHT
  );

  const handleInputChange = (field, text) =>
    setFormData({ ...formData, [field]: text });

  const handleTextInputFocus = () => {
    setScrollViewHeight(
      keyboardOpen ? KEYBOARD_OPEN_SCROLLVIEW_HEIGHT : INITIAL_SCROLLVIEW_HEIGHT
    );
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        setScrollViewHeight(INITIAL_SCROLLVIEW_HEIGHT);
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
        setScrollViewHeight(KEYBOARD_OPEN_SCROLLVIEW_HEIGHT);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardOpen(false);
        setScrollViewHeight(INITIAL_SCROLLVIEW_HEIGHT);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ backgroundColor }} className={`relative flex-1`}>
        <BackIcon navigateBack={navigateBack} textColor={textColor} />
        <View
          className={`justify-start ${
            dimensionLayout ? "flex-col items-center" : "flex-row items-start"
          }`}
        >
          <Image
            source={imageSource}
            className={`${
              dimensionLayout ? "w-[60%] h-[60%]" : "ml-10 w-[40%] h-[55%]"
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
                <FormInputs
                  initialState={initialState}
                  formData={formData}
                  dimensionLayout={dimensionLayout}
                  handleTextInputFocus={handleTextInputFocus}
                  handleInputChange={handleInputChange}
                  borderColor={borderColor}
                />
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
