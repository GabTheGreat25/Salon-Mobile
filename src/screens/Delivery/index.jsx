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
  useGetDeliveriesQuery,
  useDeleteDeliveryMutation,
} from "../../state/api/reducer";
import { LoadingScreen } from "@components";
import Toast from "react-native-toast-message";
import { BackIcon } from "@helpers";
import { DataTable } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import { changeColor } from "@utils";
import { useNavigation } from "@react-navigation/native";
import { saveDeletedId, getDeletedIds } from "../../helpers/DeleteItem";
import { format } from "date-fns";
import { useIsFocused } from "@react-navigation/native";

const { width: deviceWidth } = Dimensions.get("window");

export default function () {
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const customWidth = deviceWidth * 0.3;

  const { data, isLoading, refetch } = useGetDeliveriesQuery();
  useEffect(() => {
    const fetchData = async () => {
      if (isFocused) refetch();
    };
    fetchData();
  }, [isFocused]);

  const { backgroundColor, textColor, borderColor, colorScheme } =
    changeColor();

  const invertTextColor = colorScheme === "dark" ? "#e5e5e5" : "#212B36";

  const [deleteDelivery, { isLoading: isDeleting }] =
    useDeleteDeliveryMutation();

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

  const handleEditDelivery = (id) => {
    navigation.navigate("EditDelivery", { id });
  };

  const handleDeleteDelivery = async (id) => {
    Alert.alert(
      "Delete Delivery",
      "Are you sure you want to delete this delivery?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const response = await deleteDelivery(id).unwrap();
              await saveDeletedId(id);
              setDeletedIds((prevIds) => [...prevIds, id]);
              refetch();
              Toast.show({
                type: "success",
                position: "top",
                text1: "Delivery Successfully Deleted",
                text2: `${response?.message}`,
                visibilityTime: 3000,
                autoHide: true,
              });
            } catch (error) {
              Toast.show({
                type: "error",
                position: "top",
                text1: "Error Deleting Delivery",
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

  const createDelivery = () => navigation.navigate("CreateDelivery");

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

  const handleViewDelivery = (id) => {
    navigation.navigate("ViewDelivery", { id });
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
        <>
          <SafeAreaView
            style={{ backgroundColor }}
            className={`relative flex-1`}
          >
            <BackIcon navigateBack={navigation.goBack} textColor={textColor} />
            <View className={`ml-12 mt-[14px] items-start justify-start`}>
              <TouchableOpacity
                style={{ backgroundColor }}
                className={`py-1 px-3 rounded-md border `}
                onPress={createDelivery}
              >
                <Text
                style={{color: invertTextColor}}
                  className={`text-lg font-semibold`}
                >
                  Create Delivery
                </Text>
              </TouchableOpacity>
            </View>
            <View className={`flex-1 items-center justify-center mt-10`}>
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
                          <Text style={{ color: textColor }}>Company Name</Text>
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
                          <Text style={{ color: textColor }}>Price</Text>
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
                          <Text style={{ color: textColor }}>Quantity</Text>
                        </DataTable.Title>
                        <DataTable.Title
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 10,
                            width: customWidth,
                          }}
                        >
                          <Text style={{ color: textColor }}>Product Type</Text>
                        </DataTable.Title>
                        <DataTable.Title
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 10,
                            width: customWidth,
                          }}
                        >
                          <Text style={{ color: textColor }}>Product Name</Text>
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
                              {item?.company_name}
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
                              ₱{item?.price}
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
                              {item?.quantity}
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
                              {Array.isArray(item?.type)
                                ? item.type.join(", ")
                                : item?.type}
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
                              {Array.isArray(item.product)
                                ? item.product
                                    .map((item) => item.product_name)
                                    .join(", ")
                                : item.product?.product_name}
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
                              onPress={() => handleViewDelivery(item?._id)}
                            >
                              <Feather name="eye" size={24} color="green" />
                            </TouchableOpacity>
                            <View style={{ width: 10 }} />
                            <TouchableOpacity
                              onPress={() => {
                                if (item.status !== "completed") {
                                  handleEditDelivery(item?._id);
                                } else
                                  Alert.alert(
                                    "Edit not allowed",
                                    "This delivery has been completed."
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
                              onPress={() => handleDeleteDelivery(item?._id)}
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
