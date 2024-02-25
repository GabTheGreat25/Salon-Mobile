import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Button,
} from "react-native";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useConfirmUserMutation,
} from "../../state/api/reducer";
import { useSelector } from "react-redux";
import { LoadingScreen } from "@components";
import Toast from "react-native-toast-message";
import { format } from "date-fns";
import { DataTable } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import { changeColor, dimensionLayout } from "@utils";
import { useIsFocused } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

export default function () {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const isDimensionLayout = dimensionLayout();
  const { width: deviceWidth } = Dimensions.get("window");
  const customWidth = deviceWidth * (isDimensionLayout ? 0.3 : 0.2);

  const { data, isLoading, refetch } = useGetUsersQuery();
  useEffect(() => {
    const fetchData = async () => {
      if (isFocused) refetch();
    };
    fetchData();
  }, [isFocused]);

  const auth = useSelector((state) => state.auth);
  const { backgroundColor, textColor, colorScheme } = changeColor();

  const borderColor = colorScheme === "dark" ? "#e5e5e5" : "#212B36";

  const [page, setPage] = useState(0);
  const itemsPerPage = 5;

  const filteredBeauticians = data?.details?.filter(
    (user) =>
      user?.roles.includes("Beautician") &&
      user?.active === false &&
      user?._id !== auth?.user?._id
  );

  const totalPageCount = Math.ceil(filteredBeauticians.length / itemsPerPage);
  const paginatedData = filteredBeauticians.slice(
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

  const [confirmUser, { isLoading: isConfirming }] = useConfirmUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const handleConfirmUser = async (id) => {
    Alert.alert("Confirm User", "Are you sure you want to confirm this user?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Confirm",
        onPress: async () => {
          try {
            const response = await confirmUser({ id });
            Toast.show({
              type: "success",
              position: "top",
              text1: "Beautician Successfully Confirmed",
              text2: `${response?.data?.message}`,
              visibilityTime: 3000,
              autoHide: true,
            });
          } catch (error) {
            Toast.show({
              type: "error",
              position: "top",
              text1: "Error Confirming Beautician",
              text2: `${error?.data?.error?.message}`,
              visibilityTime: 3000,
              autoHide: true,
            });
          }
        },
      },
    ]);
  };

  const handleDeleteUser = (id) => {
    Alert.alert("Delete User", "Are you sure you want to delete this user?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => {
          deleteUser(id)
            .unwrap()
            .then((response) => {
              Toast.show({
                type: "success",
                position: "top",
                text1: "Beautician Successfully Deleted",
                text2: `${response?.message}`,
                visibilityTime: 3000,
                autoHide: true,
              });
            })
            .catch((error) => {
              Toast.show({
                type: "error",
                position: "top",
                text1: "Error Deleting Beautician",
                text2: `${error?.data?.error?.message}`,
                visibilityTime: 3000,
                autoHide: true,
              });
            });
        },
      },
    ]);
  };

  const handleViewBeautician = (id) => {
    navigation.navigate("ViewApplyingBeautician", { id });
  };

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
                          <Text style={{ color: textColor }}>Name</Text>
                        </DataTable.Title>
                        <DataTable.Title
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 10,
                            width: customWidth,
                          }}
                        >
                          <Text style={{ color: textColor }}>Email</Text>
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
                            Contact Number
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
                          <Text style={{ color: textColor }}>Time</Text>
                        </DataTable.Title>
                        <DataTable.Title
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 10,
                            width: customWidth,
                          }}
                        >
                          <Text style={{ color: textColor }}>Applying Job</Text>
                        </DataTable.Title>
                        <DataTable.Title
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 10,
                            width: customWidth,
                          }}
                        >
                          <Text style={{ color: textColor }}>Images</Text>
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
                              {item?.name}
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
                              {item?.email}
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
                              {item?.contact_number}
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
                              {format(
                                new Date(item?.requirement?.date),
                                "yyyy-MM-dd"
                              )}
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
                              {item?.requirement?.time}
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
                              {item?.requirement?.job_type}
                            </Text>
                          </DataTable.Cell>
                          <DataTable.Cell
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                              padding: 10,
                            }}
                          >
                            {item?.image?.map((image) => (
                              <Image
                                key={image?.public_id}
                                source={{ uri: image?.url }}
                                style={{ width: 100, height: 100 }}
                                resizeMode="cover"
                              />
                            ))}
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
                              onPress={() => handleViewBeautician(item?._id)}
                            >
                              <Feather name="eye" size={24} color="blue" />
                            </TouchableOpacity>

                            <TouchableOpacity
                              onPress={() => handleConfirmUser(item?._id)}
                            >
                              <Feather name="check" size={24} color="green" />
                            </TouchableOpacity>

                            <View style={{ width: 10 }} />
                            <TouchableOpacity
                              onPress={() => handleDeleteUser(item?._id)}
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
