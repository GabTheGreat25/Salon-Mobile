import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useAddTestMutation } from "../../state/api/reducer";
import { useFormik } from "formik";
import { createTestValidation } from "../../validation";
import { useNavigation } from "@react-navigation/native";
import { BackIcon } from "@helpers";

export default function () {
  const [addTest, { isLoading, isError }] = useAddTestMutation();
  const navigation = useNavigation();

  const formik = useFormik({
    initialValues: {
      test: "",
    },
    validationSchema: createTestValidation,
    onSubmit: (values) => {
      addTest(values)
        .unwrap()
        .then((response) => {
          console.log("Response from API:", response);
          navigation.navigate("Test");
          formik.resetForm();
        })
        .catch((error) => {
          console.error("Error occurred while adding the test:", error);
        });
    },
  });

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <BackIcon navigateBack={navigation.goBack} />
      <Text>Test Details:</Text>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : isError ? (
        <Text>Error occurred while fetching data.</Text>
      ) : (
        <View>
          <Text>Test Name:</Text>
          <TextInput
            placeholder="Enter test details"
            onChangeText={formik.handleChange("test")}
            onBlur={formik.handleBlur("test")}
            value={formik.values.test}
          />
          {formik.touched.test && formik.errors.test && (
            <Text style={{ color: "red" }}>{formik.errors.test}</Text>
          )}
          <TouchableOpacity
            style={{
              backgroundColor: "blue",
              padding: 10,
              borderRadius: 5,
              marginTop: 10,
            }}
            onPress={formik.handleSubmit}
            disabled={!formik.isValid}
          >
            <Text style={{ color: "white" }}>Create Test</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
