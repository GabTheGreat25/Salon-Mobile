import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import { LoadingScreen } from "@components";
import { useGetAppointmentHistoryByBeauticianIdQuery } from "../../state/api/reducer";
import { changeColor } from "@utils";
import { useIsFocused } from "@react-navigation/native";

const AppointmentItem = ({ item }) => {
  const { colorScheme } = changeColor();
  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#FFC0CB";
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    };
    return new Date(dateString).toLocaleDateString("en-PH", options);
  };

  return (
    <View
      style={{
        backgroundColor: invertBackgroundColor,
      }}
      className={`p-5 m-2 rounded-lg`}
    >
      <View className={`flex flex-row`}>
        <View className={`flex justify-center items-center`}>
          {item?.appointment?.customer?.image?.length > 0 && (
            <Image
              key={
                item?.appointment?.customer?.image[
                  Math.floor(
                    Math.random() * item?.appointment?.customer?.image?.length
                  )
                ]?.public_id
              }
              source={{
                uri: item?.appointment?.customer?.image[
                  Math.floor(
                    Math.random() * item?.appointment?.customer?.image?.length
                  )
                ]?.url,
              }}
              className={`w-48 h-48 rounded-full`}
              resizeMode="contain"
            />
          )}
        </View>
        <View>
          <View className={`flex flex-row justify-start items-center mb-1`}>
            <Text
              style={{
                color: invertTextColor,
              }}
              className={`capitalize font-base text-xl`}
            >
              Name:{" "}
              {item?.appointment?.customer?.name?.length > 12
                ? `${item?.appointment?.customer?.name.substring(0, 12)}..`
                : item?.appointment?.customer?.name}
            </Text>
          </View>
          <View className={`flex flex-row justify-start items-center mb-1`}>
            <Text
              style={{
                color: invertTextColor,
              }}
              className={`font-base text-xl`}
            >
              Price: ₱{item?.appointment?.price}
            </Text>
          </View>
          <View className={`flex flex-row justify-start items-center mb-1`}>
            <Text
              style={{
                color: invertTextColor,
              }}
              className={`font-base text-xl`}
            >
              Services:{" "}
            </Text>
            <View className={`flex-row flex-wrap`}>
              {item?.appointment?.service?.map((s) => (
                <Text
                  key={s?._id}
                  style={{
                    color: invertTextColor,
                  }}
                  className={`font-base text-xl`}
                >
                  {s?.service_name?.length > 8
                    ? `${s?.service_name.substring(0, 8)}..`
                    : s?.service_name}
                </Text>
              ))}
            </View>
          </View>
          <View className={`flex flex-row justify-start items-center mb-1`}>
            <Text
              style={{
                color: invertTextColor,
              }}
              className={`font-base text-xl`}
            >
              Status:{" "}
            </Text>
            <Text
              style={{
                color: invertTextColor,
              }}
              className={`capitalize font-base text-xl`}
            >
              {item?.status}
            </Text>
          </View>
        </View>
      </View>

      <View className={`mt-2`}>
        <View className={`flex flex-row justify-start items-center mb-2`}>
          <Text
            style={{
              color: invertTextColor,
            }}
            className={`font-base text-xl`}
          >
            Date:{" "}
          </Text>
          <TouchableOpacity
            className={`font-base text-xl bg-primary-accent rounded-lg px-5 py-2 w-5/6 ml-1`}
            disabled
          >
            <Text
              style={{
                color: invertTextColor,
              }}
              className={`font-base text-xl`}
            >
              {item?.appointment?.date && formatDate(item?.appointment?.date)}
            </Text>
          </TouchableOpacity>
        </View>
        <View className={`flex flex-row justify-start items-center my-2`}>
          <Text
            style={{
              color: invertTextColor,
            }}
            className={`font-base text-xl`}
          >
            Time:{" "}
          </Text>
          <TouchableOpacity
            className={`font-base text-xl bg-primary-accent rounded-lg px-5 py-2 w-5/6`}
            disabled
          >
            <Text
              style={{
                color: invertTextColor,
              }}
              className={`font-base text-xl`}
            >
              {item?.appointment?.time && item?.appointment?.time.length > 0
                ? item.appointment.time.length === 1
                  ? `${item.appointment.time[0]}`
                  : `${item.appointment.time[0]} to ${
                      item.appointment.time[item.appointment.time.length - 1]
                    }`
                : ""}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default function ({ route }) {
  const { id } = route.params;
  const isFocused = useIsFocused();

  const { data, isLoading, refetch } =
    useGetAppointmentHistoryByBeauticianIdQuery(id);

  useEffect(() => {
    const fetchData = async () => {
      if (isFocused) refetch();
    };
    fetchData();
  }, [isFocused]);

  const { backgroundColor } = changeColor();

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
            <FlatList
              data={data?.details || []}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => <AppointmentItem item={item} />}
            />
          </SafeAreaView>
        </>
      )}
    </>
  );
}
