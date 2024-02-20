import React, { useState, useEffect } from "react";
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
  Alert,
} from "react-native";
import {
  useGetAppointmentByIdQuery,
  useUpdateBeauticianAppointmentMutation,
  useGetUsersQuery,
  useGetSchedulesQuery,
} from "../../state/api/reducer";
import { useFormik } from "formik";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { LoadingScreen } from "@components";
import { changeColor } from "@utils";
import { BackIcon } from "@helpers";

export default function ({ route }) {
  const { id } = route.params;
  const navigation = useNavigation();

  const { data, isLoading, refetch } = useGetAppointmentByIdQuery(id);
  const appointment = data?.details;
  const [updateBeauticianAppointment] =
    useUpdateBeauticianAppointmentMutation();
  const { data: user, isLoading: userLoading } = useGetUsersQuery();
  const beauticianList = user?.details || [];
  const { data: schedules, isLoading: scheduleLoading } =
    useGetSchedulesQuery();
  const scheduleList = schedules?.details || [];

  const today = new Date().toISOString().split("T")[0];

  const filteredSchedules = scheduleList.filter((schedule) => {
    const scheduleDate = new Date(schedule.date).toISOString().split("T")[0];
    return scheduleDate === today;
  });

  const activeBeauticians = beauticianList?.filter(
    (beautician) =>
      beautician?.roles?.includes("Beautician") && beautician?.active === true
  );

  const filteredActiveBeauticians = activeBeauticians?.filter((beautician) => {
    const serviceTypes = appointment?.service?.flatMap(
      (service) => service?.type
    );

    const jobType = beautician.requirement?.job_type;

    const isMatching = serviceTypes?.includes(jobType);

    const isAbsentOrOnLeave = filteredSchedules?.some((schedule) => {
      return (
        schedule.beautician?._id === beautician._id &&
        (schedule.status === "absent" || schedule.status === "leave")
      );
    });

    return isMatching && !isAbsentOrOnLeave;
  });

  const { backgroundColor, textColor, colorScheme } = changeColor();
  const borderColor =
    colorScheme === "dark" ? "border-neutral-light" : "border-neutral-dark";

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      beautician:
        appointment?.beautician
          ?.filter((beautician) =>
            filteredActiveBeauticians.some(
              (activeBeautician) => activeBeautician._id === beautician._id
            )
          )
          ?.map((beautician) => beautician._id) || [],
    },
    onSubmit: (values) => {
      const serviceTypes = appointment?.service?.flatMap(
        (service) => service?.type
      );
      const uniqueServiceTypes = Array.from(new Set(serviceTypes));
      const requiredBeauticianCount = uniqueServiceTypes.length;

      if (values.beautician.length !== requiredBeauticianCount) {
        const requiredBeauticianTypes = uniqueServiceTypes
          .map((type) => `${type}`)
          .join(", ");

        Alert.alert(
          "Warning",
          `You must select exactly ${requiredBeauticianCount} beautician(s) for the selected appointment. Required job types: ${requiredBeauticianTypes}`
        );

        return;
      }
      updateBeauticianAppointment({
        id: appointment._id,
        payload: values,
      })
        .unwrap()
        .then((response) => {
          refetch();
          Toast.show({
            type: "success",
            position: "top",
            text1: "Delivery Details Successfully Updated",
            text2: `${response?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
          navigation.goBack();
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Error Updating Delivery Details",
            text2: `${error?.data?.error?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
        });
    },
  });

  const [selectedBeauticians, setSelectedBeauticians] = useState(
    formik.initialValues.beautician || []
  );

  useEffect(() => {
    formik.setFieldValue("beautician", selectedBeauticians);
  }, [selectedBeauticians]);

  const handleCheckBoxToggle = (beauticianId) => {
    setSelectedBeauticians((prevSelected) => {
      const updatedSelected = prevSelected.includes(beauticianId)
        ? prevSelected.filter((id) => id !== beauticianId)
        : [...prevSelected, beauticianId];

      formik.setFieldValue("beautician", updatedSelected);

      return updatedSelected;
    });
  };

  return (
    <>
      {isLoading || userLoading || scheduleLoading ? (
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
                <View className={`pt-10 pb-2`}>
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-center my-[9px] text-3xl`}
                  >
                    Change Appointment Beautician
                  </Text>
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Customer Name
                  </Text>
                  <TextInput
                    style={{ color: textColor }}
                    className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                    value={appointment?.customer?.name}
                    editable={false}
                  />
                  <Text
                    style={{ color: textColor }}
                    className={`font-semibold text-base`}
                  >
                    Appointment Services
                  </Text>
                  <TextInput
                    style={{ color: textColor }}
                    className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                    value={appointment?.service
                      ?.map((s) => s?.service_name)
                      .join(", ")}
                    editable={false}
                  />

                  {filteredActiveBeauticians.map((beautician) => (
                    <View
                      key={beautician._id}
                      className="flex flex-row items-start justify-start space-x-2 my-2"
                    >
                      <TouchableOpacity
                        onPress={() => handleCheckBoxToggle(beautician._id)}
                        className={`mr-2`}
                      >
                        <View
                          style={{
                            height: 35,
                            width: 35,
                            borderColor: textColor,
                            backgroundColor: backgroundColor,
                          }}
                          className={`flex-row justify-center items-center border-2 rounded`}
                        >
                          {selectedBeauticians.includes(
                            beautician._id.toString()
                          ) && (
                            <Text
                              style={{ color: textColor }}
                              className={`text-2xl`}
                            >
                              ✓
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                      <View className={`text-center`}>
                        <Text>
                          {beautician.name} -{" "}
                          {beautician?.requirement?.job_type}
                        </Text>
                      </View>
                    </View>
                  ))}

                  <View className={`mt-4 items-center justify-center flex-col`}>
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
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      )}
    </>
  );
}
