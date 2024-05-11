import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Button,
} from "react-native";
import {
  useGetAppointmentsQuery,
  useConfirmAppointmentMutation,
  useCancelAppointmentMutation,
} from "../../state/api/reducer";
import { LoadingScreen } from "@components";
import Toast from "react-native-toast-message";
import { DataTable } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import { changeColor } from "@utils";
import { useIsFocused, useNavigation } from "@react-navigation/native";

const { width: deviceWidth } = Dimensions.get("window");

export default function () {
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const customWidth = deviceWidth * 0.3;

  const { data, isLoading, refetch } = useGetAppointmentsQuery();

  const appointments = data?.details;
  useEffect(() => {
    const fetchData = async () => {
      if (isFocused) refetch();
    };
    fetchData();
  }, [isFocused]);

  const [cancelAppointment, { isLoading: isConfirming }] =
    useCancelAppointmentMutation();
  const [confirmAppointment, { isLoading: isDeleting }] =
    useConfirmAppointmentMutation();

  const [page, setPage] = useState(0);
  const itemsPerPage = 10;

  const filteredSchedule = appointments?.filter(
    (appointment) => appointment.isRebooked === false
  );

  const totalPageCount = Math.ceil(filteredSchedule?.length / itemsPerPage);
  const paginatedData = filteredSchedule?.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  const handleNextPage = () => {
    if (page < totalPageCount - 1) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const { backgroundColor, textColor, borderColor } = changeColor();

  const handleConfirmAppointment = async (id) => {
    Alert.alert(
      "Customer Reschedule",
      "Are you sure you want to accept this Customer's Reschedule?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              const response = await confirmAppointment(id);
              Toast.show({
                type: "success",
                position: "top",
                text1: "Customer Reschedule Confirmed",
                text2: `${response?.data?.message}`,
                visibilityTime: 3000,
                autoHide: true,
              });
            } catch (error) {
              Toast.show({
                type: "error",
                position: "top",
                text1: "Error Confirming Customer Reschedule",
                text2: `${error?.data?.error?.message}`,
                visibilityTime: 3000,
                autoHide: true,
              });
            }
          },
        },
      ]
    );
  };

  const handleCancelAppointment = (id) => {
    Alert.alert(
      "Customer Reschedule Decline",
      "Are you sure you want to decline this Customer's Reschedule?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            cancelAppointment(id)
              .unwrap()
              .then((response) => {
                Toast.show({
                  type: "success",
                  position: "top",
                  text1: "Customer Reschedule Declined",
                  text2: `${response?.message}`,
                  visibilityTime: 3000,
                  autoHide: true,
                });
              })
              .catch((error) => {
                Toast.show({
                  type: "error",
                  position: "top",
                  text1: "Error Declining Customer Reschedule",
                  text2: `${error?.data?.error?.message}`,
                  visibilityTime: 3000,
                  autoHide: true,
                });
              });
          },
        },
      ]
    );
  };

  const handleViewReschedule = (id) => {
    navigation.navigate("ViewRescheduleAppointment", { id });
  };

  return (
    <>
      {isLoading || isConfirming || isDeleting ? (
        <View
          className={`flex-1 justify-center items-center bg-primary-default`}
        >
          <LoadingScreen />
        </View>
      ) : (
        <>
          <SafeAreaView
            style={{ backgroundColor }}
            className={`relative flex-1`}
          >
            <View className={`flex-1 items-center justify-center`}>
              {paginatedData?.length ? (
                <ScrollView
                  style={{ backgroundColor }}
                  showsVerticalScrollIndicator={false}
                >
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <DataTable>
                      <DataTable.Header
                        style={{
                          backgroundColor,
                          borderBottomWidth: 1,
                          borderBottomColor: borderColor,
                        }}
                      >
                       
                        <DataTable.Title
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 10,
                            width: customWidth,
                          }}
                        >
                          <Text style={{ color: textColor }}>
                            Customer Name
                          </Text>
                        </DataTable.Title>
                        <DataTable.Title
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 10,
                            width: customWidth,
                          }}
                        >
                          <Text style={{ color: textColor }}>
                            Appointment Day
                          </Text>
                        </DataTable.Title>
                        <DataTable.Title
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 10,
                            width: customWidth,
                          }}
                        >
                          <Text style={{ color: textColor }}>
                            Rebook Reason
                          </Text>
                        </DataTable.Title>
                        <DataTable.Title
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 10,
                            width: customWidth,
                          }}
                        >
                          <Text style={{ color: textColor }}>
                            Message Reason
                          </Text>
                        </DataTable.Title>
                        <DataTable.Title
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 10,
                            width: customWidth,
                          }}
                        >
                          <Text style={{ color: textColor }}>Actions</Text>
                        </DataTable.Title>
                      </DataTable.Header>
                      {paginatedData?.map((item) => (
                        <DataTable.Row
                          key={item?._id}
                          style={{
                            backgroundColor,
                            borderBottomWidth: 1,
                            borderBottomColor: borderColor,
                          }}
                        >
                         
                          <DataTable.Cell
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                              padding: 10,
                              width: customWidth,
                            }}
                          >
                            <Text
                              style={{ color: textColor }}
                              numberOfLines={1}
                              ellipsizeMode="tail"
                            >
                              {item?.customer?.name}
                            </Text>
                          </DataTable.Cell>
                          <DataTable.Cell
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                              padding: 10,
                              width: customWidth,
                            }}
                          >
                            <Text
                              style={{ color: textColor }}
                              numberOfLines={1}
                              ellipsizeMode="tail"
                            >
                              {item.date
                                ? `${
                                    new Date(item.date)
                                      .toISOString()
                                      .split("T")[0]
                                  } ${
                                    item.time
                                      ? item.time[0] +
                                        " - " +
                                        item.time[item.time?.length - 1]
                                      : ""
                                  }`
                                : ""}
                            </Text>
                          </DataTable.Cell>
                          <DataTable.Cell
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                              padding: 10,
                              width: customWidth,
                            }}
                          >
                            <Text
                              style={{ color: textColor }}
                              numberOfLines={1}
                              ellipsizeMode="tail"
                            >
                              {item?.rebookReason}
                            </Text>
                          </DataTable.Cell>
                          <DataTable.Cell
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                              padding: 10,
                              width: customWidth,
                            }}
                          >
                            <Text
                              style={{ color: textColor }}
                              numberOfLines={1}
                              ellipsizeMode="tail"
                            >
                              {item?.messageReason}
                            </Text>
                          </DataTable.Cell>
                          <DataTable.Cell
                            style={{
                              width: customWidth,
                              justifyContent: "space-around",
                              alignItems: "center",
                              padding: 10,
                            }}
                          >
                            <TouchableOpacity
                              onPress={() => handleViewReschedule(item?._id)}
                            >
                              <Feather name="eye" size={24} color="green" />
                            </TouchableOpacity>
                            <View style={{ width: 10 }} />
                            <TouchableOpacity
                              onPress={() =>
                                handleConfirmAppointment(item?._id)
                              }
                            >
                              <Feather name="check" size={24} color="blue" />
                            </TouchableOpacity>
                            <View style={{ width: 10 }} />
                            <TouchableOpacity
                              onPress={() => handleCancelAppointment(item?._id)}
                            >
                              <Feather name="delete" size={24} color="red" />
                            </TouchableOpacity>
                          </DataTable.Cell>
                        </DataTable.Row>
                      ))}
                    </DataTable>
                  </ScrollView>
                </ScrollView>
              ) : (
                <View
                  className={`flex-1 justify-center items-center`}
                  style={{ backgroundColor }}
                >
                  <Text style={{ color: textColor }}>No data available.</Text>
                </View>
              )}
              {paginatedData?.length ? (
                <View className={`flex items-center flex-row my-6`}>
                  <Button
                    title="Previous"
                    onPress={handlePrevPage}
                    disabled={page === 0}
                    color="#FFB6C1"
                  />
                  <Text
                    style={{
                      color: textColor,
                    }}
                    className={`px-20`}
                  >{`Page ${page + 1} of ${totalPageCount}`}</Text>
                  <Button
                    title="Next"
                    onPress={handleNextPage}
                    disabled={page === totalPageCount - 1}
                    color="#FFB6C1"
                  />
                </View>
              ) : null}
            </View>
          </SafeAreaView>
        </>
      )}
    </>
  );
}
