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
  useGetSchedulesQuery,
  useDeleteConfirmScheduleMutation,
  useConfirmScheduleMutation,
} from "../../state/api/reducer";
import { LoadingScreen } from "@components";
import Toast from "react-native-toast-message";
import { format } from "date-fns";
import { DataTable } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import { changeColor } from "@utils";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { saveDeletedId, getDeletedIds } from "../../helpers/DeleteItem";

export default function () {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { width: deviceWidth } = Dimensions.get("window");
  const customWidth = deviceWidth * 0.3;

  const { data, isLoading, refetch } = useGetSchedulesQuery();
  const schedules = data?.details;
  useEffect(() => {
    const fetchData = async () => {
      if (isFocused) refetch();
    };
    fetchData();
  }, [isFocused]);

  const { backgroundColor, textColor, colorScheme } = changeColor();

  const borderColor = colorScheme === "dark" ? "#e5e5e5" : "#212B36";

  const [confirmSchedule, { isLoading: isConfirming }] =
    useConfirmScheduleMutation();
  const [deleteConfirmSchedule, { isLoading: isDeleting }] =
    useDeleteConfirmScheduleMutation();

  const [deletedIds, setDeletedIds] = useState([]);

  useEffect(() => {
    const fetchDeletedIds = async () => {
      const ids = await getDeletedIds();
      setDeletedIds(ids);
    };

    fetchDeletedIds();
  }, []);

  const [page, setPage] = useState(0);
  const itemsPerPage = 10;

  const filteredSchedule =
    schedules
      ?.filter((schedule) => schedule.leaveNoteConfirmed === false)
      .filter((schedule) => schedule.isLeave === true)
      .filter((schedule) => !deletedIds.includes(schedule?._id)) || [];

  const totalPageCount = Math.ceil(filteredSchedule.length / itemsPerPage);
  const paginatedData = filteredSchedule.slice(
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

  const handleConfirmSchedule = async (id) => {
    Alert.alert(
      "Beautician Leave",
      "Are you sure you want to accept this Beautician leave?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              const response = await confirmSchedule(id);
              Toast.show({
                type: "success",
                position: "top",
                text1: "Beautician Leave Successfully Confirmed",
                text2: `${response?.data?.message}`,
                visibilityTime: 3000,
                autoHide: true,
              });
            } catch (error) {
              Toast.show({
                type: "error",
                position: "top",
                text1: "Error Confirming Beautician Leave",
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

  const handleDelete = (id) => {
    Alert.alert("Cancel Leave", "Are you sure you want to cancel this leave?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          try {
            const response = await deleteConfirmSchedule(id).unwrap();
            await saveDeletedId(id);
            setDeletedIds((prevIds) => [...prevIds, id]);
            refetch();
            Toast.show({
              type: "success",
              position: "top",
              text1: "Beautician Leave Successfully Cancelled",
              text2: `${response?.message}`,
              visibilityTime: 3000,
              autoHide: true,
            });
          } catch (error) {
            Toast.show({
              type: "error",
              position: "top",
              text1: "Error Deleting Product",
              text2: `${error?.data?.error?.message}`,
              visibilityTime: 3000,
              autoHide: true,
            });
          }
        },
      },
    ]);
  };

  const handleViewLeave = (id)=>{
    navigation.navigate("ViewBeauticianLeave", { id })
  }

  return (
    <>
      {isLoading || isDeleting || isConfirming ? (
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
            <View className={`flex-1 items-center justify-center pt-4`}>
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
                          <Text style={{ color: textColor }}>ID</Text>
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
                            Beautician Name
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
                          <Text style={{ color: textColor }}>Date</Text>
                        </DataTable.Title>
                        <DataTable.Title
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 10,
                            width: customWidth,
                          }}
                        >
                          <Text style={{ color: textColor }}>Leave Note</Text>
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
                              {item?._id}
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
                              {item?.beautician?.name}
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
                              {format(new Date(item?.date), "yyyy-MM-dd")}
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
                              {item?.leaveNote}
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
                              onPress={() => handleViewLeave(item?._id)}
                            >
                              <Feather name="eye" size={24} color="blue" />
                            </TouchableOpacity>

                            <TouchableOpacity
                              onPress={() => handleConfirmSchedule(item?._id)}
                            >
                              <Feather name="check" size={24} color="green" />
                            </TouchableOpacity>
                            <View style={{ width: 10 }} />
                            <TouchableOpacity
                              onPress={() => handleDelete(item?._id)}
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
                    color="#FDA7DF"
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
                    color="#FDA7DF"
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
