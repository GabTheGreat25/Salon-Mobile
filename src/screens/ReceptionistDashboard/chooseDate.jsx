import React, { useState, useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { transactionSlice } from "../../state/transaction/transactionReducer";
import {
  useGetTimesQuery,
  useGetAppointmentsQuery,
} from "../../state/api/reducer";
import Toast from "react-native-toast-message";
import { useIsFocused } from "@react-navigation/native";
import { LoadingScreen } from "@components";

const windowWidth = Dimensions.get("window").width;

export default function () {
  const appointment = useSelector((state) => state?.appointment);

  const selectedTime = useSelector(
    (state) => state?.transaction?.transactionData?.time
  );

  const appointmentData = appointment?.appointmentData;

  const { textColor, backgroundColor, shadowColor, colorScheme } =
    changeColor();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#FFC0CB";
  const revertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#212B36";
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

  const {
    data: times,
    isLoading: timeLoading,
    refetch: timeRefetch,
  } = useGetTimesQuery();
  const { data, isLoading, refetch } = useGetAppointmentsQuery();
  const appointments = data.details;

  useEffect(() => {
    const fetchData = async () => {
      if (isFocused) {
        await Promise.all([refetch(), timeRefetch()]);
      }
    };
    fetchData();
  }, [isFocused]);

  const today = new Date();
  const utcOffset = 8 * 60;
  const phTime = new Date(today.getTime() + utcOffset * 60000);
  //! Uncomment the line below if you want to test the time
  // const phTime = new Date(
  //   today.getTime() + utcOffset * 60000 + 9 * 60 * 60 * 1000
  // );

  const formattedDateWithTime = phTime.toISOString();
  const currentTime = formattedDateWithTime.slice(11, 19);
  const formattedDate = phTime.toISOString().split("T")[0];

  const appointmentToday = appointments?.filter((a) => {
    const appointmentDate = new Date(a?.date).toISOString().split("T")[0];
    return appointmentDate === formattedDate;
  });

  const appointmentTimes = appointmentToday?.flatMap((a) => a.time);
  const availableTimes = times?.details?.filter(
    (t) => !appointmentTimes?.includes(t.time)
  );

  const filteredTimes = availableTimes?.filter((time) => {
    const appointmentTime = time?.time;
    const timeParts = appointmentTime.split(" ");
    const [hour, minute] = timeParts[0].split(":");
    const isPM = timeParts[1] === "PM";
    let hour24 = parseInt(hour, 10);

    if (isPM && hour24 !== 12) {
      hour24 += 12;
    } else if (!isPM && hour24 === 12) {
      hour24 = 0;
    }

    const currentHour24 = parseInt(currentTime.slice(0, 2), 10);
    const currentMinute = parseInt(currentTime.slice(3, 5), 10);

    return (
      hour24 > currentHour24 ||
      (hour24 === currentHour24 && parseInt(minute, 10) >= currentMinute)
    );
  });

  const [selectedCustomerTime, setSelectedCustomerTime] = useState({
    time: selectedTime || [],
  });

  const dispatch = useDispatch();

  const handleTimePress = (time) => {
    setSelectedCustomerTime((prev) => {
      const isSelected = prev.time.includes(time);

      const totalDuration = appointmentData.reduce((total, service) => {
        const durationParts = service?.duration.split(" ");
        const minDuration = parseInt(durationParts[2]) || 0;

        const isMinutes = durationParts.includes("minutes");
        const durationInHours = isMinutes ? minDuration / 60 : minDuration;

        return total + (isNaN(durationInHours) ? 0 : durationInHours);
      }, 0);

      let updatedTimes;

      if (isSelected) {
        updatedTimes = prev.time.filter((t) => t !== time);
      } else {
        const currentTime = prev.time || [];

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
            return prev;
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
          return prev;
        }
      }

      return { ...prev, time: updatedTimes };
    });
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

  const handlePress = () => {
    if (selectedCustomerTime.time.length === 0) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Warning",
        text2: "Please select a time",
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }

    const totalDuration = appointmentData.reduce((total, service) => {
      const durationParts = service?.duration.split(" ");
      const minDuration = parseInt(durationParts[2]) || 0;

      const isMinutes = durationParts.includes("minutes");
      const durationInHours = isMinutes ? minDuration / 60 : minDuration;

      return total + (isNaN(durationInHours) ? 0 : durationInHours);
    }, 0);

    const totalRoundedUp = Math.ceil(totalDuration);
    const hourText = totalRoundedUp === 1 ? "hour" : "hours";

    if (selectedCustomerTime.time.length !== totalRoundedUp) {
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

    dispatch(transactionSlice.actions.setDateTime(selectedCustomerTime));
    navigation.navigate("ReceptionistCheckout");
  };

  return (
    <>
      {isLoading || timeLoading ? (
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
              <Text
                style={{ color: textColor }}
                className={`text-2xl text-center pb-4 font-semibold`}
              >
                Select time
              </Text>
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
                  height: 90,
                  width: windowWidth * 0.925,
                }}
                className={`flex-row rounded mx-1 px-4 pt-4 mb-2 bg-primary-variant`}
              >
                {filteredTimes?.length > 0 ? (
                  <React.Fragment>
                    {filteredTimes?.map(({ _id, time }) => (
                      <TouchableOpacity
                        key={_id}
                        onPress={() => handleTimePress(time)}
                        activeOpacity={1}
                      >
                        <View
                          style={{
                            backgroundColor: selectedCustomerTime.time.includes(
                              time
                            )
                              ? revertBackgroundColor
                              : backgroundColor,
                            height: 60,
                            width: windowWidth * 0.35,
                          }}
                          className={`rounded justify-center items-center text-center mr-8`}
                        >
                          <Text
                            style={{
                              color: selectedCustomerTime.time.includes(time)
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
                  </React.Fragment>
                ) : (
                  <Text
                    style={{ color: invertTextColor }}
                    className={`text-center text-2xl font-semibold`}
                  >
                    All Slots Are Occupied For Today
                  </Text>
                )}
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
