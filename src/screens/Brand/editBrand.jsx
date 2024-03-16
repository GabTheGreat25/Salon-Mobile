import React, { useEffect } from "react";
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
  useUpdateBrandMutation,
  useGetBrandByIdQuery,
} from "../../state/api/reducer";
import { useFormik } from "formik";
import { editBrandValidation } from "../../validation";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { LoadingScreen } from "@components";
import { changeColor } from "@utils";
import { BackIcon } from "@helpers";
import { useIsFocused } from "@react-navigation/native";

export default function ({ route }) {
  const { id } = route.params;
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const { data, isLoading: isBrandLoading, refetch } = useGetBrandByIdQuery(id);

  useEffect(() => {
    const fetchData = async () => {
      if (isFocused) refetch();
    };
    fetchData();
  }, [isFocused]);

  const [updateBrand, { isLoading }] = useUpdateBrandMutation();

  const { backgroundColor, textColor, colorScheme } = changeColor();
  const borderColor =
    colorScheme === "dark" ? "border-neutral-light" : "border-neutral-dark";

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      brand_name: data?.details?.brand_name || "",
    },
    validationSchema: editBrandValidation,
    onSubmit: (values) => {
      updateBrand({ id: data?.details?._id, payload: values })
        .unwrap()
        .then((response) => {
          refetch();
          Toast.show({
            type: "success",
            position: "top",
            text1: "Brand Details Successfully Updated",
            text2: `${response?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
          navigation.navigate("Brand");
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Updating Brand Details",
            text2: `${error?.data?.error?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
        });
    },
  });

  return (
    <>
      {isLoading || isBrandLoading ? (
        <View
          className={`flex-1 justify-center items-center bg-primary-default`}
        >
          <LoadingScreen />
        </View>
      ) : (
        <>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView
              style={{ backgroundColor }}
              className={`relative flex-1 pt-12`}
            >
              <BackIcon
                navigateBack={navigation.goBack}
                textColor={textColor}
              />
              <KeyboardAvoidingView behavior="height">
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  decelerationRate="fast"
                  scrollEventThrottle={1}
                  className={`px-6`}
                >
                  <View className="pb-2">
                    <Text
                      style={{ color: textColor }}
                      className={`font-semibold text-center pb-6 text-3xl`}
                    >
                      Edit Brand Details
                    </Text>
                    <Text
                      style={{ color: textColor }}
                      className={`font-semibold text-base`}
                    >
                      Brand Name
                    </Text>
                    <TextInput
                      style={{ color: textColor }}
                      className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                      placeholder="Enter your brand name"
                      placeholderTextColor={textColor}
                      autoCapitalize="none"
                      onChangeText={formik.handleChange("brand_name")}
                      onBlur={formik.handleBlur("brand_name")}
                      value={formik.values.brand_name}
                    />
                    {formik.touched.brand_name && formik.errors.brand_name && (
                      <Text style={{ color: "red" }}>
                        {formik.errors.brand_name}
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
        </>
      )}
    </>
  );
}
