import React from "react";
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { changeColor } from "@utils";
import { BackIcon } from "@helpers";
import { useNavigation } from "@react-navigation/native";
import { LoadingScreen } from "@components";
import { useFormik } from "formik";
import {
  useAddScheduleMutation,
  useGetUsersQuery,
  useGetSchedulesQuery,
} from "../../state/api/reducer";
import { createAbsenceValidation } from "../../validation";
import Toast from "react-native-toast-message";
import { Picker } from "@react-native-picker/picker";

export default function () {
  const navigation = useNavigation();
  const { backgroundColor, textColor, colorScheme } = changeColor();

  const borderColor =
    colorScheme === "dark" ? "border-neutral-light" : "border-neutral-dark";

  const [addSchedule, { isLoading }] = useAddScheduleMutation();
  const { data: user, isLoading: userLoading } = useGetUsersQuery();
  const beauticianList = user?.details || [];

  const activeBeauticians = beauticianList.filter(
    (beautician) =>
      beautician?.roles?.includes("Beautician") && beautician?.active === true
  );

  const { data: schedules, isLoading: schedulesLoading } =
    useGetSchedulesQuery();

  const formik = useFormik({
    initialValues: {
      beautician: "",
      date: new Date(),
      status: "absent",
    },
    validationSchema: createAbsenceValidation,
    onSubmit: (values) => {
      if (Array.isArray(schedules?.details)) {
        const existingSchedule = schedules.details.find(
          (schedule) =>
            schedule.beautician?._id === values.beautician &&
            new Date(schedule.date).toISOString().split("T")[0] ===
              new Date(values.date).toISOString().split("T")[0]
        );

        if (existingSchedule) {
          console.log("existingSchedule", existingSchedule);
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Creating Schedule",
            text2: `Beautician already has a schedule for ${
              new Date(values.date).toISOString().split("T")[0]
            }`,
            visibilityTime: 3000,
            autoHide: true,
          });
          return;
        }
      }

      addSchedule(values)
        .unwrap()
        .then((response) => {
          navigation.navigate("Status");
          formik.resetForm();
          Toast.show({
            type: "success",
            position: "top",
            text1: "Schedule Successfully Created",
            text2: `${response?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Creating Schedule",
            text2: `${error?.data?.error?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
        });
    },
  });

  return (
    <>
      {isLoading || userLoading || schedulesLoading ? (
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
            <View className={`flex-1 py-12`}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                decelerationRate="fast"
                scrollEventThrottle={1}
                className={`px-6`}
              >
                <Text
                  style={{ color: textColor }}
                  className={`py-6 font-semibold text-center text-3xl`}
                >
                  Create Schedule
                </Text>

                <View
                  className={`border-[1.5px]  font-normal rounded-full my-3 ${borderColor}`}
                >
                  <Picker
                    selectedValue={formik.values.beautician}
                    style={{ color: textColor }}
                    dropdownIconColor={textColor}
                    onValueChange={(itemValue) =>
                      formik.setFieldValue("beautician", itemValue)
                    }
                  >
                    <Picker.Item label="Select Beautician" value="" />
                    {activeBeauticians?.map((b) => (
                      <Picker.Item
                        key={b?._id}
                        label={b?.name}
                        value={b?._id}
                        color={textColor}
                      />
                    ))}
                  </Picker>
                </View>
                {formik.touched.beautician && formik.errors.beautician && (
                  <Text style={{ color: "red" }}>
                    {formik.errors.beautician}
                  </Text>
                )}

                <View className={`my-4 items-center justify-center flex-col`}>
                  <TouchableOpacity
                    onPress={formik.handleSubmit}
                    disabled={!formik.isValid}
                  >
                    <View className={`mb-2 flex justify-center items-center`}>
                      <View
                        className={`py-2 rounded-lg bg-primary-accent w-[175px]
                          } ${!formik.isValid ? "opacity-50" : "opacity-100"}`}
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
              </ScrollView>
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      )}
    </>
  );
}
