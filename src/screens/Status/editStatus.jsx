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
  useUpdateAbsentMutation,
  useGetScheduleByIdQuery,
} from "../../state/api/reducer";
import { useFormik } from "formik";
import { editAbsenceValidation } from "../../validation";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { LoadingScreen } from "@components";
import { changeColor } from "@utils";
import { BackIcon } from "@helpers";
import { Picker } from "@react-native-picker/picker";
import { useIsFocused } from "@react-navigation/native";

export default function ({ route }) {
  const { id } = route.params;
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const {
    data,
    isLoading: isScheduleLoading,
    refetch,
  } = useGetScheduleByIdQuery(id);
  const schedule = data?.details;

  useEffect(() => {
    const fetchData = async () => {
      if (isFocused) refetch();
    };
    fetchData();
  }, [isFocused]);

  const [updateAbsent, { isLoading }] = useUpdateAbsentMutation();

  const { backgroundColor, textColor, colorScheme } = changeColor();
  const borderColor = colorScheme === "dark" ? "#e5e5e5" : "#212B36";

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      beautician: schedule?.beautician || "",
      date: schedule?.date || "",
      status: schedule?.status || "",
      isLeave: false,
      leaveNote: schedule?.leaveNote || "",
      leaveNoteConfirmed: false,
    },
    validationSchema: editAbsenceValidation,
    onSubmit: (values) => {
      updateAbsent({ id: schedule?._id, payload: values })
        .unwrap()
        .then((response) => {
          refetch();
          Toast.show({
            type: "success",
            position: "top",
            text1: "Schedule Details Successfully Updated",
            text2: `${response?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
          navigation.navigate("Status");
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Updating Schedule Details",
            text2: `${error?.data?.error?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
        });
    },
  });

  useEffect(() => {
    formik.setFieldValue("isLeave", formik.values.status === "leave");
    formik.setFieldValue(
      "leaveNoteConfirmed",
      formik.values.status === "leave"
    );

    if (formik.values.status === "absent") {
      formik.setFieldValue("leaveNote", "");
    }
  }, [formik.values.status]);

  return (
    <>
      {isLoading || isScheduleLoading ? (
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
                      className={`font-semibold text-center pb-4 text-3xl`}
                    >
                      Edit Absence
                    </Text>
                    <Text
                      style={{ color: textColor }}
                      className={`font-semibold text-base`}
                    >
                      Absence Date
                    </Text>

                    <TextInput
                      style={{ color: textColor }}
                      className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                      placeholderTextColor={textColor}
                      autoCapitalize="none"
                      editable={false}
                      value={
                        formik.values.date
                          ? new Date(formik.values.date)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                    />
                    {formik.touched.date && formik.errors.date && (
                      <Text style={{ color: "red" }}>{formik.errors.date}</Text>
                    )}

                    <Text
                      style={{ color: textColor }}
                      className={`font-semibold text-base`}
                    >
                      Status
                    </Text>
                    <View
                      className={`border-[1.5px] text-lg font-normal rounded-full my-2 ${borderColor}`}
                    >
                      <Picker
                        selectedValue={formik.values.status}
                        style={{ color: textColor }}
                        dropdownIconColor={textColor}
                        onValueChange={(itemValue) =>
                          formik.setFieldValue("status", itemValue)
                        }
                      >
                        <Picker.Item label="Update Status" value="" />
                        <Picker.Item label="leave" value="leave" />
                        <Picker.Item label="absent" value="absent" />
                      </Picker>
                    </View>

                    {formik.touched.status && formik.errors.status && (
                      <Text style={{ color: "red" }}>
                        {formik.errors.status}
                      </Text>
                    )}

                    <TextInput
                      style={{
                        color: textColor,
                        height: 100,
                        textAlignVertical: "top",
                      }}
                      className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-lg my-2 ${borderColor}`}
                      placeholder="Beautician's Leave Note"
                      placeholderTextColor={textColor}
                      autoCapitalize="none"
                      multiline={true}
                      onChangeText={formik.handleChange("leaveNote")}
                      onBlur={formik.handleBlur("leaveNote")}
                      value={formik.values.leaveNote}
                      editable={formik.values.status !== "absent"}
                    />
                    {formik.touched.leaveNote && formik.errors.leaveNote && (
                      <Text style={{ color: "red" }}>
                        {formik.errors.leaveNote}
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
