import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  TouchableWithoutFeedback,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { BackIcon } from "@helpers";
import { useNavigation } from "@react-navigation/native";
import { changeColor } from "@utils";
import { reasonSlice } from "../../state/editSchedule/reasonReducer";
import {
  useUpdateScheduleAppointmentMutation,
  useGetAppointmentByIdQuery,
} from "../../state/api/reducer";
import { Feather } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { LoadingScreen } from "@components";
import { useFormik } from "formik";
import { useIsFocused } from "@react-navigation/native";

const windowWidth = Dimensions.get("window").width;

export default function ({ route }) {
  const isFocused = useIsFocused();
  const { id } = route.params;

  const { backgroundColor, textColor, shadowColor } = changeColor();

  const selectedDate = useSelector(
    (state) => state?.transaction?.transactionData?.date || ""
  );

  const selectedTime = useSelector(
    (state) => state?.transaction?.transactionData?.time
  );

  const selectedBeautician = useSelector(
    (state) => state?.transaction?.transactionData?.beautician
  );

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [updateAppointment] = useUpdateScheduleAppointmentMutation();

  const { data, isLoading, refetch } = useGetAppointmentByIdQuery(id);
  const appointments = data?.details;

  useEffect(() => {
    const fetchData = async () => {
      if (isFocused) refetch();
    };
    fetchData();
  }, [isFocused]);

  const reason = useSelector((state) => state.reason);

  const goBack = () => {
    navigation.goBack();
    dispatch(reasonSlice.actions.resetReason());
  };

  const appointmentDate = appointments?.date;
  const appointmentTime = appointments?.time;

  const displayDate =
    selectedDate ||
    (appointmentDate &&
      new Date(appointmentDate).toISOString().split("T")[0]) ||
    "Add Date";

  const displayTime =
    selectedTime && selectedTime.length > 0
      ? selectedTime.length > 1
        ? `${selectedTime[0]} to ${selectedTime[selectedTime.length - 1]}`
        : selectedTime[0]
      : appointmentTime && appointmentTime.length > 0
      ? appointmentTime.join(", ")
      : "Add Time";

  const handleDateTime = () => {
    navigation.navigate("EditChooseDate", {
      id: id,
    });
  };

  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const handleEmployee = () => {
    if (selectedAppointment === null) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Warning",
        text2: "Please select a service first",
        visibilityTime: 3000,
        autoHide: true,
      });
    } else
      navigation.navigate("EditBeautician", { selectedAppointment, id: id });
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      beautician: selectedBeautician || [],
      date: selectedDate || "",
      time: selectedTime || [],
      rebookReason: reason.reasonData.rebookReason || "",
      messageReason: reason.reasonData.messageReason || "",
      isRescheduled: true,
    },
    onSubmit: (values) => {
      updateAppointment({ id: appointments?._id, payload: values })
        .unwrap()
        .then((response) => {
          Toast.show({
            type: "success",
            position: "top",
            text1: "Schedule Successfully Updated",
            text2: `${response?.message}`,
            visibilityTime: 3000,
            autoHide: true,
          });
          dispatch(reasonSlice.actions.resetReason());
          navigation.navigate("Schedule");
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

  return (
    <>
      {isLoading ? (
        <View
          className={`flex-1 justify-center items-center bg-primary-default`}
        >
          <LoadingScreen />
        </View>
      ) : (
        <>
          <SafeAreaView style={{ backgroundColor }} className={`flex-1`}>
            <BackIcon navigateBack={goBack} textColor={textColor} />
            <ScrollView
              showsVerticalScrollIndicator={false}
              decelerationRate="fast"
              scrollEventThrottle={1}
              style={{
                backgroundColor,
              }}
              className={`px-4 mt-14`}
            >
              <ScrollView
                decelerationRate="fast"
                scrollEventThrottle={1}
                showsVerticalScrollIndicator={false}
                className={`pb-6`}
              >
                <View
                  style={{
                    height: 115,
                    width: windowWidth * 0.925,
                  }}
                  className={`flex-col justify-center px-4 mb-1 bg-primary-default rounded-2xl`}
                >
                  <Text
                    style={{ color: textColor }}
                    className={`text-lg font-semibold`}
                  >
                    Appointment Schedule
                  </Text>
                  <View className={`flex-row`}>
                    <Text
                      style={{ color: textColor }}
                      className={`text-base font-semibold`}
                    >
                      {displayDate} | {displayTime}
                    </Text>
                    <TouchableOpacity
                      onPress={handleDateTime}
                      className={`flex-1`}
                    >
                      <View className={`flex-row justify-end items-end`}>
                        <Feather
                          name="chevron-right"
                          size={40}
                          color={textColor}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={handleDateTime}>
                    <Text
                      style={{ color: textColor }}
                      className={`text-xl font-semibold`}
                    >
                      Select Date & Time
                    </Text>
                  </TouchableOpacity>
                </View>
                {appointments?.service?.map((appointment, index) => (
                  <TouchableOpacity
                    key={index ?? null}
                    onPress={() => {
                      const newSelectedAppointment =
                        selectedAppointment === appointment?.type
                          ? null
                          : appointment?.type;
                      setSelectedAppointment(newSelectedAppointment);
                    }}
                    style={{
                      width: windowWidth * 0.925,
                    }}
                    className={`rounded-2xl px-4 pb-4 pt-1 mt-4 mb-2 ${
                      selectedAppointment === appointment?.type
                        ? "bg-primary-accent"
                        : "bg-primary-default"
                    }`}
                  >
                    <View className={`flex-col`}>
                      <View className={`flex-col pt-4 self-center`}>
                        <Image
                          source={{
                            uri:
                              appointment?.image?.length > 0
                                ? appointment?.image[
                                    Math.floor(
                                      Math.random() * appointment?.image?.length
                                    )
                                  ]?.url
                                : null,
                          }}
                          resizeMode="cover"
                          className={`h-[150px] w-[300px]`}
                        />
                        <Text
                          style={{ color: textColor }}
                          className={`text-center text-lg font-semibold pt-4`}
                        >
                          Name: {appointment?.service_name}
                        </Text>
                        <Text
                          style={{ color: textColor }}
                          className={`flex-wrap text-center text-lg font-semibold`}
                        >
                          {appointment?.duration ?? null} | ₱
                          {appointment?.price ?? null}
                        </Text>
                      </View>
                      <View className={`flex-col pt-2`}>
                        <View className={`pt-1`}>
                          <Text
                            style={{ color: textColor }}
                            className={`text-lg font-semibold`}
                          >
                            Product Use: {appointment?.product_name ?? null}
                          </Text>
                          <Text
                            style={{ color: textColor }}
                            className={`text-lg font-semibold`}
                          >
                            Description: {appointment?.description ?? null}
                          </Text>
                          <Text
                            style={{ color: textColor }}
                            className={`text-lg flex-wrap text-start font-semibold`}
                          >
                            For:{" "}
                            {Array.isArray(appointment?.type)
                              ? appointment?.type.join(", ")
                              : "None"}
                          </Text>
                          <Text
                            style={{ color: textColor }}
                            className={`text-lg font-semibold`}
                          >
                            Add Ons:{" "}
                            {appointment?.option_name?.length > 0
                              ? appointment?.option_name
                                  .split(", ")
                                  .map(
                                    (option, index) =>
                                      `${option} - ₱${
                                        appointment?.per_price[index]
                                      }${
                                        index !==
                                        appointment?.option_name.split(", ")
                                          .length -
                                          1
                                          ? ", "
                                          : ""
                                      }`
                                  )
                                  .join("")
                              : "None"}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </ScrollView>
            <View
              style={{
                shadowColor,
                backgroundColor,
                height: 110,
                width: windowWidth,
              }}
              className={`flex-col pt-2 px-10 shadow-2xl`}
            >
              <View
                className={`flex-row gap-x-1 justify-center items-center pb-4`}
              >
                <Feather name="user" size={25} color={textColor} />
                <Text
                  style={{ color: textColor }}
                  className={`text-sm font-medium`}
                >
                  Pick A Beautician
                </Text>
                <View className={`flex-1 justify-end items-end`}>
                  <TouchableOpacity onPress={handleEmployee}>
                    <View className={`flex-row`}>
                      <Text
                        className={`text-base font-medium text-primary-default`}
                      >
                        Add Beautician
                      </Text>
                      <Feather name="chevron-right" size={25} color="#FFB6C1" />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableWithoutFeedback
                onPress={formik.handleSubmit}
                disabled={!formik.isValid}
              >
                <View
                  className={`justify-center items-center rounded-md py-2 bg-primary-default ${
                    !formik.isValid ? "opacity-50" : "opacity-100"
                  }`}
                >
                  <Text
                    style={{ color: textColor }}
                    className={`text-center text-xl font-semibold`}
                  >
                    Confirm
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </SafeAreaView>
        </>
      )}
    </>
  );
}
