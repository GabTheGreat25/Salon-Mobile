import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Image,
  Button,
} from "react-native";
import {
  useGetTransactionsQuery,
  useDeleteTransactionMutation,
} from "../../state/api/reducer";
import { LoadingScreen } from "@components";
import Toast from "react-native-toast-message";
import { BackIcon } from "@helpers";
import { DataTable } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import { changeColor } from "@utils";
import { useNavigation } from "@react-navigation/native";
import { saveDeletedId, getDeletedIds } from "../../helpers/DeleteItem";
import { useIsFocused } from "@react-navigation/native";

export default function () {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { width: deviceWidth } = Dimensions.get("window");
  const customWidth = deviceWidth * 0.3;

  const { data, isLoading, refetch } = useGetTransactionsQuery();
  useEffect(() => {
    const fetchData = async () => {
      if (isFocused) refetch();
    };
    fetchData();
  }, [isFocused]);

  const { backgroundColor, textColor, colorScheme } = changeColor();

  const borderColor = colorScheme === "dark" ? "#e5e5e5" : "#212B36";

  const [deleteTransaction, { isLoading: isDeleting }] =
    useDeleteTransactionMutation();

  const [deletedIds, setDeletedIds] = useState([]);
  const [page, setPage] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchDeletedIds = async () => {
      const ids = await getDeletedIds();
      setDeletedIds(ids);
    };

    fetchDeletedIds();
  }, []);

  const handleEditTransaction = (id) => {
    navigation.navigate("EditTransaction", { id });
  };

  const handleDeleteTransaction = async (id) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const response = await deleteTransaction(id).unwrap();
              await saveDeletedId(id);
              setDeletedIds((prevIds) => [...prevIds, id]);
              refetch();
              Toast.show({
                type: "success",
                position: "top",
                text1: "Transaction Successfully Deleted",
                text2: `${response?.message}`,
                visibilityTime: 3000,
                autoHide: true,
              });
            } catch (error) {
              Toast.show({
                type: "error",
                position: "top",
                text1: "Error Deleting Transaction",
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

  const filteredData =
    data?.details?.filter((item) => !deletedIds.includes(item?._id)) || [];

  const totalPageCount = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
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

  const handleViewTransaction = (id) => {
    navigation.navigate("ViewTransaction", { id });
  };

  return (
    <>
      {isLoading || isDeleting ? (
        <View
          className={`flex-1 justify-center items-center bg-primary-default`}
        >
          <LoadingScreen />
        </View>
      ) : (
        <SafeAreaView style={{ backgroundColor }} className={`relative flex-1`}>
          <BackIcon navigateBack={navigation.goBack} textColor={textColor} />
          <View className={`flex-1 items-center justify-center pt-12`}>
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
                        <Text style={{ color: textColor }}>Payment Method</Text>
                      </DataTable.Title>
                      <DataTable.Title
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          padding: 10,
                          width: customWidth,
                        }}
                      >
                        <Text style={{ color: textColor }}>Status</Text>
                      </DataTable.Title>
                      <DataTable.Title
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          padding: 10,
                          width: customWidth,
                        }}
                      >
                        <Text style={{ color: textColor }}>Customer Name</Text>
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
                          PWD / Senior Citizen ID Image
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
                            {item?.payment}
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
                            {item?.status}
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
                            {item?.appointment?.customer?.name}
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
                            {item.appointment?.date
                              ? `${
                                  new Date(item.appointment?.date)
                                    .toISOString()
                                    .split("T")[0]
                                } ${
                                  item.appointment?.time
                                    ? item.appointment?.time[0] +
                                      " - " +
                                      item.appointment?.time[
                                        item.appointment?.time?.length - 1
                                      ]
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
                            {item.image?.length > 0 ? (
                              <Image
                                key={
                                  item.image[
                                    Math.floor(
                                      Math.random() * item.image?.length
                                    )
                                  ]?.public_id
                                }
                                source={{
                                  uri: item.image[
                                    Math.floor(
                                      Math.random() * item.image?.length
                                    )
                                  ]?.url,
                                }}
                                className={`object-center w-20 h-20 rounded-full`}
                              />
                            ) : (
                              <Text>Not Applicable</Text>
                            )}
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
                              onPress={() => handleViewTransaction(item?._id)}
                            >
                              <Feather name="eye" size={24} color="blue" />
                            </TouchableOpacity>
                            
                          <TouchableOpacity
                            onPress={() => {
                              if (item.status !== "completed") {
                                handleEditTransaction(item?._id);
                              } else
                                Alert.alert(
                                  "Edit not allowed",
                                  "This transaction has been completed."
                                );
                            }}
                          >
                            <Feather
                              name="edit"
                              size={24}
                              color={
                                item.status !== "completed" ? "blue" : "gray"
                              }
                            />
                          </TouchableOpacity>

                          <View style={{ width: 10 }} />
                          <TouchableOpacity
                            onPress={() => handleDeleteTransaction(item?._id)}
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
      )}
    </>
  );
}
