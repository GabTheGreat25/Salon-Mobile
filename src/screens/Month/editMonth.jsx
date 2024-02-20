import React from "react";
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
} from "react-native";
import {
  useUpdateMonthMutation,
  useGetMonthByIdQuery,
} from "../../state/api/reducer";
import { useFormik } from "formik";
import { editMonthValidation } from "../../validation";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { LoadingScreen } from "@components";
import { changeColor } from "@utils";
import { BackIcon } from "@helpers";

export default function ({ route }) {
  const { id } = route.params;
  const navigation = useNavigation();

  const { data, isLoading: isMonthLoading, refetch } = useGetMonthByIdQuery(id);

  const [updateMonth, { isLoading }] = useUpdateMonthMutation();

  const { backgroundColor, textColor, colorScheme } = changeColor();
  const borderColor =
    colorScheme === "dark" ? "border-neutral-light" : "border-neutral-dark";

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      message: data?.details?.message || "",
    },
    validationSchema: editMonthValidation,
    onSubmit: (values) => {
      updateMonth({ id: data?.details?._id, payload: values })
        .unwrap()
        .then((response) => {
          refetch();
          Toast.show({
            type: "success",
            position: "top",
            text1: "Month Details Successfully Updated",
            text2: `${response?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
          navigation.navigate("Month");
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Updating Month Details",
            text2: `${error?.data?.error?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
        });
    },
  });

  return (
    <>
      {isLoading || isMonthLoading ? (
        <View
          className={`flex-1 justify-center items-center bg-primary-default`}
        >
          <LoadingScreen />
        </View>
      ) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView
            style={{ backgroundColor }}
            className={`relative flex-1`}
          >
            <BackIcon navigateBack={navigation.goBack} textColor={textColor} />
            <KeyboardAvoidingView behavior="height">
              <ScrollView
                showsVerticalScrollIndicator={false}
                decelerationRate="fast"
                scrollEventThrottle={1}
                className={`px-6`}
              >
                <View className="pt-10 pb-2">
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-center py-6 text-3xl`}
                  >
                    Update Month Details
                  </Text>

                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Message
                  </Text>
                  <TextInput
                    style={{
                      color: textColor,
                      height: 100,
                      textAlignVertical: "top",
                    }}
                    className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-lg my-2 ${borderColor}`}
                    placeholder="Enter a message"
                    placeholderTextColor={textColor}
                    autoCapitalize="none"
                    multiline={true}
                    onChangeText={formik.handleChange("message")}
                    onBlur={formik.handleBlur("message")}
                    value={formik.values.message}
                  />
                  {formik.touched.message && formik.errors.message && (
                    <Text style={{ color: "red" }}>
                      {formik.errors.message}
                    </Text>
                  )}

                  <View className={`flex-col`}>
                    <TouchableOpacity
                      onPress={formik.handleSubmit}
                      disabled={!formik.isValid}
                    >
                      <View className={`my-4 w-full`}>
                        <View
                          className={`py-2 rounded-lg bg-primary-accent mx-20 ${
                            !formik.isValid ? "opacity-50" : "opacity-100"
                          }`}
                        >
                          <Text
                            className={`font-semibold text-center text-lg`}
                            style={{ color: textColor }}
                          >
                            Submit
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      )}
    </>
  );
}
