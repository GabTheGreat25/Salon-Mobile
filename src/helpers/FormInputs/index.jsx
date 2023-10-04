import React from "react";
import { TextInput } from "react-native";
import { changeColor } from "@utils";

export default function ({
  initialState,
  formData,
  handleTextInputFocus,
  handleTextInputBlur,
  handleInputChange,
  borderColor,
  dimensionLayout,
}) {
  const { textColor } = changeColor();
  return (
    <>
      {Object.keys(initialState).map((field) => (
        <TextInput
          key={field}
          style={{ color: textColor }}
          className={`border-b ${
            dimensionLayout ? "mb-4" : "mb-3"
          } ${borderColor}`}
          placeholder={`Enter your ${field}`}
          placeholderTextColor={textColor}
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
