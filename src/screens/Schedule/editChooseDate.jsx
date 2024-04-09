import React, { useState, useMemo, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { changeColor } from "@utils";
import { useNavigation } from "@react-navigation/native";
import { BackIcon } from "@helpers";
import { Calendar } from "react-native-calendars";
import { useDispatch, useSelector } from "react-redux";
import { transactionSlice } from "../../state/transaction/transactionReducer";
import {
  useGetTimesQuery,
  useGetAppointmentsQuery,
  useGetAppointmentByIdQuery,
} from "../../state/api/reducer";
import Toast from "react-native-toast-message";
import { useIsFocused } from "@react-navigation/native";
import { LoadingScreen } from "@components";

const windowWidth = Dimensions.get("window").width;

export default function ({ route }) {
  const { id } = route.params;

  const selectedDate = useSelector(
    (state) => state?.transaction?.transactionData?.date
  );
  const selectedTime = useSelector(
    (state) => state?.transaction?.transactionData?.time
  );

  const {
    data: appointment,
    isLoading: appointmentLoading,
    refetch: refetchAppointment,
  } = useGetAppointmentByIdQuery(id);
  const appointmentData = appointment?.details;

  const {
    data: time,
    isLoading: timeLoading,
    refetch: timeRefetch,
  } = useGetTimesQuery();
  const { data, isLoading, refetch } = useGetAppointmentsQuery();

  useEffect(() => {
    const fetchData = async () => {
      if (isFocused) {
        await Promise.all([refetch(), refetchAppointment(), timeRefetch()]);
      }
    };
    fetchData();
  }, [isFocused]);

  const { textColor, backgroundColor, shadowColor, colorScheme } =
    changeColor();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#FFC0CB";
  const revertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#212B36";
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

  const currentDate = new Date();
  const next21Days = new Date(currentDate);
  next21Days.setDate(currentDate.getDate() + 21);

  const nextday = new Date(currentDate);
  nextday.setDate(currentDate.getDate() + 1);

  const minDate = useMemo(() => {
    return nextday.toISOString().split("T")[0];
  }, [nextday]);

  const maxDate = useMemo(() => {
    return next21Days.toISOString().split("T")[0];
  }, [next21Days]);

  const appointmentDate = appointmentData?.date;
  const appointmentTime = appointmentData?.time;

  const [selectedDateTime, setSelectedDateTime] = useState({
    date:
      `${new Date(appointmentDate).toISOString().split("T")[0]}` ||
      selectedDate ||
      null,
    time: appointmentTime || selectedTime || [],
  });

  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    if (selectedDateTime.date) {
      setMarkedDates((prevMarkedDates) => ({
        ...prevMarkedDates,
        [selectedDateTime.date]: {
          selected: true,
          selectedColor: "#FF7086",
        },
      }));
    }
  }, [selectedDateTime.date]);

  const dispatch = useDispatch();

  const handleDayPress = (day) => {
    const updatedMarkedDates = {
      [day.dateString]: {
        selected: !markedDates[day.dateString]?.selected,
        selectedColor: "#FF7086",
      },
    };

    if (!markedDates[day.dateString]?.selected) {
      setSelectedDateTime({ date: day.dateString, time: [] });
    } else {
      setSelectedDateTime({ date: null, time: [] });
    }

    setMarkedDates(updatedMarkedDates);
  };

  const handleTimePress = (time) => {
    if (!selectedDateTime.date) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Warning",
        text2: "Please select a date first",
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }

    const isSelected = selectedDateTime.time.includes(time);

    const conflict = data?.details?.some((appointment) => {
      const formDate = new Date(selectedDateTime.date)
        .toISOString()
        .split("T")[0];
      const existingDate = new Date(appointment.date)
        .toISOString()
        .split("T")[0];

      if (existingDate !== formDate) {
        return false;
      }

      if (
        appointment.time.includes(time) &&
        appointment.customerId !== appointmentData?.customerId
      ) {
        return true;
      }

      if (
        appointment.time.includes(time) &&
        appointment.customerId === appointmentData?.customerId
      ) {
        return false;
      }

      return false;
    });

    if (conflict) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Warning",
        text2: "Appointment slot is already booked by another customer.",
        visibilityTime: 5000,
        autoHide: true,
      });
      return;
    }

    const totalDuration = appointmentData?.service?.reduce((total, service) => {
      const durationParts = service?.duration.split(" ");
      const minDuration = parseInt(durationParts[2]) || 0;

      const isMinutes = durationParts.includes("minutes");
      const durationInHours = isMinutes ? minDuration / 60 : minDuration;

      return total + (isNaN(durationInHours) ? 0 : durationInHours);
    }, 0);

    let updatedTimes;

    if (isSelected) {
      updatedTimes = selectedDateTime.time.filter((t) => t !== time);
    } else {
      const currentTime = selectedDateTime.time || [];

      const totalRoundedUp = Math.ceil(totalDuration);
      const hourText = totalRoundedUp === 1 ? "hour" : "hours";

      if (currentTime.length + 1 <= totalRoundedUp) {
        const isConsecutive =
          currentTime.length === 0 || checkConsecutive(currentTime, time);

        if (!isConsecutive) {
          Toast.show({
            type: "error",
            position: "top",
            text1: "Warning",
            text2: "Please select consecutive time slots",
            visibilityTime: 3000,
            autoHide: true,
          });
          return;
        }

        updatedTimes = [...currentTime, time];
      } else {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Warning",
          text2: `Cannot select more than ${totalRoundedUp} ${hourText}`,
          visibilityTime: 3000,
          autoHide: true,
        });
        return;
      }
    }

    setSelectedDateTime((prev) => ({ ...prev, time: updatedTimes }));
  };

  const checkConsecutive = (times, newTime) => {
    if (times.length === 0) {
      return true;
    }

    const extractHour = (time) => {
      const [hours] = time.split(":");
      return parseInt(hours);
    };

    const lastTime = times[times.length - 1];
    const lastTimeHour = extractHour(lastTime);
    const newTimeHour = extractHour(newTime);

    return newTimeHour === lastTimeHour + 1;
  };

  const hideArrows = currentDate.getMonth() === next21Days.getMonth();

  const handlePress = () => {
    if (!selectedDateTime.date || selectedDateTime.time.length === 0) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Warning",
        text2: "Please select a date and time",
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }

    const totalDuration = appointmentData?.service?.reduce((total, service) => {
      const durationParts = service?.duration.split(" ");
      const minDuration = parseInt(durationParts[2]) || 0;

      const isMinutes = durationParts.includes("minutes");
      const durationInHours = isMinutes ? minDuration / 60 : minDuration;

      return total + (isNaN(durationInHours) ? 0 : durationInHours);
    }, 0);

    const totalRoundedUp = Math.ceil(totalDuration);
    const hourText = totalRoundedUp === 1 ? "hour" : "hours";

    if (selectedDateTime.time.length !== totalRoundedUp) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Warning",
        text2: `Please select exactly ${totalRoundedUp} ${hourText}`,
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }

    dispatch(transactionSlice.actions.setDateTime(selectedDateTime));
    navigation.navigate("EditSchedule", {
      id: id,
    });
  };

  return (
    <>
      {isLoading || timeLoading || appointmentLoading ? (
        <View
          className={`flex-1 justify-center items-center bg-primary-default`}
        >
          <LoadingScreen />
        </View>
      ) : (
        <>
          <SafeAreaView style={{ backgroundColor }} className={`flex-1`}>
            <BackIcon navigateBack={navigation.goBack} textColor={textColor} />
            <ScrollView
              showsVerticalScrollIndicator={false}
              decelerationRate="fast"
              scrollEventThrottle={1}
              style={{
                backgroundColor,
              }}
              className={`px-3 flex-col pt-12`}
            >
              <View>
                <Text
                  style={{ color: textColor }}
                  className={`text-2xl text-center pb-4 font-semibold`}
                >
                  Select date and time
                </Text>
                <Calendar
                  className={`mx-1 px-4 py-4 mb-2 rounded-xl bg-primary-default`}
                  onDayPress={handleDayPress}
                  markedDates={markedDates}
                  markingType={"simple"}
                  theme={{
                    calendarBackground: "#FFC0CB",
                    monthTextColor: "black",
                    textSectionTitleColor: "black",
                    todayTextColor: "#FF1493",
                    arrowColor: "black",
                  }}
                  minDate={minDate}
                  maxDate={maxDate}
                  hideExtraDays={true}
                  hideArrows={hideArrows ? true : false}
                  horizontal={true}
                  pagingEnabled={true}
                />
              </View>
              <Text
                style={{ color: textColor }}
                className={`text-2xl text-center pb-4 font-semibold`}
              >
                Available Time Slot
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                scrollEventThrottle={1}
                style={{
                  backgroundColor: invertBackgroundColor,
                  height: 90,
                  width: windowWidth * 0.925,
                }}
                className={`flex-row rounded mx-1 px-4 pt-4 mb-2`}
              >
                {time?.details?.map(({ _id, time }) => (
                  <TouchableOpacity
                    key={_id}
                    onPress={() => handleTimePress(time)}
                    activeOpacity={1}
                  >
                    <View
                      style={{
                        backgroundColor: selectedDateTime.time.includes(time)
                          ? revertBackgroundColor
                          : backgroundColor,
                        height: 60,
                        width: windowWidth * 0.35,
                      }}
                      className={`rounded justify-center items-center text-center mr-8`}
                    >
                      <Text
                        style={{
                          color: selectedDateTime.time.includes(time)
                            ? invertTextColor
                            : textColor,
                        }}
                        className={`text-lg text-center font-semibold`}
                      >
                        {time}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </ScrollView>
            <View
              style={{
                shadowColor,
                backgroundColor,
                height: 90,
                width: windowWidth,
              }}
              className={`flex-col px-10 py-5 shadow-2xl`}
            >
              <TouchableOpacity onPress={handlePress}>
                <View
                  style={{
                    backgroundColor: invertBackgroundColor,
                  }}
                  className={`justify-center items-center rounded-md py-2`}
                >
                  <Text
                    style={{ color: invertTextColor }}
                    className={`text-center text-xl font-semibold`}
                  >
                    Confirm
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </>
      )}
    </>
  );
}
