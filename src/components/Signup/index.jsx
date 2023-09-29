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
}) {
  const { backgroundColor, textColor, colorScheme } = changeColor();
  const imageSource = colorScheme === "dark" ? salonLogoWhite : salonLogo;
  const borderColor =
    colorScheme === "dark" ? "border-neutral-light" : "border-neutral-dark";

  const [isTextInputFocused, setIsTextInputFocused] = useState(false);
  const [formData, setFormData] = useState(initialState);

  const handleTextInputFocus = () => {
    setIsTextInputFocused(true);
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

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  return (
    <SafeAreaView style={{ backgroundColor }} className="relative flex-1">
      <View className="absolute top-3">
        <TouchableOpacity onPress={navigateBack}>
          <Feather name="chevron-left" size={50} color={textColor} />
        </TouchableOpacity>
      </View>
      <View className="items-center justify-start">
        <Image
          source={imageSource}
          className="w-[60%] h-[60%]"
          resizeMode="contain"
        />
        <View className="items-center justify-start flex-1">
          <Text
            style={{ color: formData.textColor }}
            className="my-2 text-3xl font-semibold"
          >
            {title}
          </Text>
          <Text
            style={{ color: formData.textColor }}
            className="mb-2 text-sm font-base"
          >
            {description}
          </Text>
          <KeyboardAvoidingView behavior="padding" className="w-[300px]">
            <ScrollView style={{ height: isTextInputFocused ? 100 : 500 }}>
              {Object.keys(initialState).map((field) => (
                <TextInput
                  key={field}
                  style={{ color: formData.textColor }}
                  className={`border-b mb-6 ${borderColor}`}
                  placeholder={`Enter your ${field}`}
                  placeholderTextColor={formData.placeholderColor}
                  autoCapitalize="none"
                  onFocus={handleTextInputFocus}
                  onBlur={handleTextInputBlur}
                  onChangeText={(text) => handleInputChange(field, text)}
                  value={formData[field]}
                  secureTextEntry={field === "password"}
                  keyboardType={
                    field === "contactNumber" ? "numeric" : "default"
                  }
                />
              ))}
              <View className="items-center justify-start">
                <TouchableOpacity onPress={navigateTo}>
                  <View className={`w-full mb-2`}>
                    <View className={`px-6 py-2 rounded-lg bg-primary-accent`}>
                      <Text
                        className={`text-neutral-light font-semibold text-center text-lg`}
                        style={{ color: textColor }}
                      >
                        {buttonTitle}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <View className="flex-row gap-x-2">
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
  );
}
