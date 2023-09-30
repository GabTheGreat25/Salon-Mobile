import React from "react";
import { TextInput } from "react-native";

export default function ({
  initialState,
  formData,
  handleTextInputFocus,
  handleTextInputBlur,
  handleInputChange,
  borderColor,
  dimensionLayout,
}) {
  return (
    <>
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
          onFocus={handleTextInputFocus}
          onBlur={handleTextInputBlur}
          onChangeText={(text) => handleInputChange(field, text)}
          value={formData[field]}
          secureTextEntry={field === "password"}
          keyboardType={field === "contactNumber" ? "numeric" : "default"}
        />
      ))}
    </>
  );
}
