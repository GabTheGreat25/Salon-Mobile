import React from "react";
import {
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView,
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
import { dimensionLayout, changeColor } from "@utils";

export default function () {
  const { data, isLoading } = useGetUsersQuery();
  const auth = useSelector((state) => state.auth);
  const { backgroundColor, textColor, colorScheme } = changeColor();

  const borderColor = colorScheme === "dark" ? "#e5e5e5" : "#212B36";

  const filteredEmployees = data?.details?.filter(
    (user) =>
      user?.roles.includes("Employee") &&
      user?.active === false &&
      user?._id !== auth?.user?._id
  );

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
              text1: "Employee Successfully Confirmed",
              text2: `${response.message}`,
              visibilityTime: 3000,
              autoHide: true,
            });
          } catch (error) {
            Toast.show({
              type: "error",
              position: "top",
              text1: "Error Confirming Employee",
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
                text1: "Employee Successfully Deleted",
                text2: `${response?.message}`,
                visibilityTime: 3000,
                autoHide: true,
              });
            })
            .catch((error) => {
              Toast.show({
                type: "error",
                position: "top",
                text1: "Error Deleting Employee",
                text2: `${error?.data?.error?.message}`,
                visibilityTime: 3000,
                autoHide: true,
              });
            });
        },
      },
    ]);
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
          {filteredEmployees?.length ? (
            <ScrollView style={{ backgroundColor }}>
              <ScrollView horizontal>
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
                        width: 150,
                      }}
                    >
                      <Text style={{ color: textColor }}>Name</Text>
                    </DataTable.Title>
                    <DataTable.Title
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 10,
                        width: 150,
                      }}
                    >
                      <Text style={{ color: textColor }}>Email</Text>
                    </DataTable.Title>
                    <DataTable.Title
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 10,
                        width: 150,
                      }}
                    >
                      <Text style={{ color: textColor }}>Contact Number</Text>
                    </DataTable.Title>
                    <DataTable.Title
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 10,
                        width: 150,
                      }}
                    >
                      <Text style={{ color: textColor }}>Date</Text>
                    </DataTable.Title>
                    <DataTable.Title
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 10,
                        width: 150,
                      }}
                    >
                      <Text style={{ color: textColor }}>Time</Text>
                    </DataTable.Title>
                    <DataTable.Title
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 10,
                        width: 150,
                      }}
                    >
                      <Text style={{ color: textColor }}>Applying Job</Text>
                    </DataTable.Title>
                    <DataTable.Title
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 10,
                        width: 150,
                      }}
                    >
                      <Text style={{ color: textColor }}>Images</Text>
                    </DataTable.Title>
                    <DataTable.Title
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 10,
                        width: 150,
                      }}
                    >
                      <Text style={{ color: textColor }}>Actions</Text>
                    </DataTable.Title>
                  </DataTable.Header>
                  {filteredEmployees?.map((item) => (
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
                          width: 150,
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
                          width: 150,
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
                          width: 150,
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
                          width: 150,
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
                          width: 150,
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
                          width: 150,
                        }}
                      >
                        <Text
                          style={{ color: textColor }}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {item?.requirement?.job}
                        </Text>
                      </DataTable.Cell>
                      <DataTable.Cell
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          padding: 10,
                          paddingBottom: 24,
                        }}
                      >
                        {item?.image?.map((image) => (
                          <Image
                            key={image?.public_id}
                            source={{ uri: image?.url }}
                            style={{ width: 100, height: 75 }}
                            resizeMode="contain"
                          />
                        ))}
                      </DataTable.Cell>
                      <DataTable.Cell
                        style={{
                          width: 150,
                          justifyContent: "space-around",
                          alignItems: "center",
                          padding: 10,
                        }}
                      >
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
        </>
      )}
    </>
  );
}
