import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import { changeColor } from "@utils";
import { useNavigation } from "@react-navigation/native";
import { BackIcon } from "@helpers";
import {
  useGetUsersQuery,
  useGetSchedulesQuery,
  useGetAppointmentByIdQuery,
} from "../../state/api/reducer";
import { LoadingScreen } from "@components";
import { useSelector, useDispatch } from "react-redux";
import { transactionSlice } from "../../state/transaction/transactionReducer";
import { useRoute } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { useIsFocused } from "@react-navigation/native";

const windowWidth = Dimensions.get("window").width;

export default function ({ route }) {
  const isFocused = useIsFocused();
  const { id } = route.params;

  const appointmentRoute = useRoute();
  const selectedAppointment = appointmentRoute.params.selectedAppointment;

  const {
    data: appointment,
    isLoading: appointmentLoading,
    refetch,
  } = useGetAppointmentByIdQuery(id);
  const appointmentData = appointment?.details;

  const { data, isLoading, refetch: refetchUsers } = useGetUsersQuery();
  const beautician = data?.details || [];

  const {
    data: allSchedules,
    isLoading: loadingSchedules,
    refetch: refetchSchedules,
  } = useGetSchedulesQuery();
  const schedules =
    allSchedules?.details.filter(
      (schedule) =>
        schedule.leaveNoteConfirmed === true ||
        schedule.status === "absent" ||
        schedule.status === "leave"
    ) || [];

  useEffect(() => {
    const fetchData = async () => {
      if (isFocused) {
        await Promise.all([refetch(), refetchUsers(), refetchSchedules()]);
      }
    };
    fetchData();
  }, [isFocused]);

  const selectedDate = useSelector(
    (state) => state?.transaction?.transactionData?.date
  );

  const selectedBeautician = useSelector(
    (state) => state?.transaction?.transactionData?.beautician
  );

  const { textColor, backgroundColor, shadowColor, colorScheme } =
    changeColor();
  const navigation = useNavigation();
  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#FFB6C1";
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

  const dispatch = useDispatch();

  const activeBeautician = beautician.filter(
    (beautician) =>
      beautician?.roles?.includes("Beautician") && beautician?.active === true
  );

  const getAvailableBeauticians = () => {
    return activeBeautician.filter((beautician) => {
      const beauticianSchedules = schedules.filter(
        (schedule) => schedule.beautician._id === beautician._id
      );

      const hasLeaveNoteConfirmed = beauticianSchedules?.some(
        (schedule) =>
          (schedule.leaveNoteConfirmed ||
            schedule.status === "absent" ||
            schedule.status === "leave") &&
          new Date(schedule.date).toISOString().split("T")[0] === selectedDate
      );

      const jobType = beautician.requirement?.job_type;

      const appointmentMatchesJobType =
        selectedAppointment?.length &&
        (typeof jobType === "string"
          ? selectedAppointment?.includes(jobType)
          : jobType.some((type) => selectedAppointment?.includes(type)));

      return !hasLeaveNoteConfirmed && appointmentMatchesJobType;
    });
  };

  const availableBeauticians = getAvailableBeauticians(selectedDate);

  const beauticianIds = appointmentData?.beautician?.map(
    (beautician) => beautician._id
  );

  const [pickedBeauticians, setPickedBeauticians] = useState(
    selectedBeautician || beauticianIds || []
  );

  const handlePickBeautician = (beautician) => {
    const jobTypes = beautician.requirement?.job_type;

    const isAlreadyPicked = pickedBeauticians.includes(beautician._id);

    if (isAlreadyPicked) {
      const updatedPickedBeauticians = pickedBeauticians.filter(
        (picked) => picked !== beautician._id
      );
      setPickedBeauticians(updatedPickedBeauticians);
    } else {
      const pickedBeauticianTypes = Array.from(
        new Set(
          pickedBeauticians.flatMap((picked) => {
            const pickedBeauticianData = activeBeautician.find(
              (b) => b._id === picked
            );
            return pickedBeauticianData?.requirement?.job_type;
          })
        )
      );

      if (pickedBeauticianTypes.includes(jobTypes)) {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Warning",
          text2: `You have already selected a beautician for the job type: ${jobTypes}`,
          visibilityTime: 3000,
          autoHide: true,
        });
        return;
      }

      setPickedBeauticians((prevPickedBeauticians) => [
        ...prevPickedBeauticians,
        beautician._id,
      ]);
    }
  };

  const handlePress = () => {
    const servicesRequiredByBeauticians = pickedBeauticians.map(
      (beauticianId) => {
        const beauticianData = activeBeautician.find(
          (b) => b._id === beauticianId
        );
        return beauticianData?.requirement?.job_type;
      }
    );

    const allServicesRequired = servicesRequiredByBeauticians.flat();

    const servicesNotCovered = selectedAppointment.filter(
      (service) => !allServicesRequired.includes(service)
    );

    if (servicesNotCovered.length > 0) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Warning",
        text2: `Pick a beautician for: ${servicesNotCovered.join(", ")}`,

        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }

    dispatch(transactionSlice.actions.setBeautician(pickedBeauticians));
    navigation.navigate("EditSchedule", {
      id: id,
    });
  };

  return (
    <>
      {isLoading || appointmentLoading || loadingSchedules ? (
        <View
          className={`flex-1 justify-center items-center bg-primary-default`}
        >
          <LoadingScreen />
        </View>
      ) : (
        <SafeAreaView style={{ backgroundColor }} className={`flex-1`}>
          <BackIcon navigateBack={navigation.goBack} textColor={textColor} />
          <View className={`flex-1 pt-16`}>
            <FlatList
              data={availableBeauticians}
              showsVerticalScrollIndicator={false}
              decelerationRate="fast"
              scrollEventThrottle={1}
              keyExtractor={(item) => item?._id}
              renderItem={({ item }) => (
                <View
                  key={item?._id}
                  style={{
                    backgroundColor: invertBackgroundColor,
                    height: 180,
                    width: windowWidth * 0.925,
                  }}
                  className={`flex-row rounded-lg gap-x-2 px-2 mx-4 mb-3 pt-4`}
                >
                  <Image
                    style={{ width: 150, height: 150 }}
                    key={
                      item.image[Math.floor(Math.random() * item.image?.length)]
                        ?.public_id
                    }
                    source={{
                      uri: item.image[
                        Math.floor(Math.random() * item.image?.length)
                      ]?.url,
                    }}
                    resizeMode="contain"
                  />
                  <View className={`flex-col justify-start items-start`}>
                    <Text
                      style={{
                        color: invertTextColor,
                      }}
                      className={`text-lg font-semibold`}
                    >
                      Name:{" "}
                      {item?.name.length > 13
                        ? `${item?.name.substring(0, 13)}...`
                        : item?.name}
                    </Text>
                    <Text
                      style={{
                        color: invertTextColor,
                      }}
                      className={`text-lg font-semibold`}
                    >
                      Contact: {item?.contact_number}
                    </Text>
                    <Text
                      style={{
                        color: invertTextColor,
                      }}
                      className={`text-lg font-semibold`}
                    >
                      Works On: {item?.requirement?.job_type}
                    </Text>
                    <View className={`self-end`}>
                      <TouchableOpacity
                        onPress={() => handlePickBeautician(item)}
                      >
                        <View
                          style={{
                            backgroundColor,
                          }}
                          className={`rounded-lg py-2 px-6 mt-3`}
                        >
                          <Text
                            style={{ color: textColor }}
                            className={`text-center text-lg font-semibold`}
                          >
                            {pickedBeauticians.some(
                              (picked) => picked === item._id
                            )
                              ? "Unpick"
                              : "Pick"}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            />
          </View>
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
      )}
    </>
  );
}
