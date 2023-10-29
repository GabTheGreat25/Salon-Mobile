import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import {
  useUpdateTestMutation,
  useGetTestByIdQuery,
} from "../../state/api/reducer";
import { useFormik } from "formik";
import { editTestValidation } from "../../validation";
import { useNavigation } from "@react-navigation/native";
import { BackIcon } from "@helpers";

export default function ({ route }) {
  const { id } = route.params;
  const navigation = useNavigation();

  const { data, isLoading, isError } = useGetTestByIdQuery(id);

  const [updateTest] = useUpdateTestMutation();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      test: data?.details?.test || "",
    },
    validationSchema: editTestValidation,
    onSubmit: (values) => {
      updateTest({ id: data?.details?._id, payload: values })
        .unwrap()
        .then((response) => {
          console.log("Response from API:", response);
          navigation.navigate("Test");
        })
        .catch((error) => {
          console.error("Error occurred while updating the test:", error);
        });
    },
  });

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <BackIcon navigateBack={navigation.goBack} />
      <Text>Edit Test</Text>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : isError ? (
        <Text>Error occurred while fetching data.</Text>
      ) : (
        <>
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
            <Text style={{ color: "white" }}>Update Test</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
