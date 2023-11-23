import React from "react";
import {
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from "react-native";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../state/api/reducer";
import { useSelector } from "react-redux";
import { LoadingScreen } from "@components";
import Toast from "react-native-toast-message";
import { BackIcon } from "@helpers";
import { DataTable } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import { changeColor, dimensionLayout } from "@utils";
import { useNavigation } from "@react-navigation/native";

export default function () {
  const isDimensionLayout = dimensionLayout();
  const navigation = useNavigation();
  const { width: deviceWidth } = Dimensions.get("window");
  const customWidth = deviceWidth * (isDimensionLayout ? 0.3 : 0.2);

  const { data, isLoading } = useGetUsersQuery();
  const auth = useSelector((state) => state.auth);
  const { backgroundColor, textColor, colorScheme } = changeColor();

  const borderColor = colorScheme === "dark" ? "#e5e5e5" : "#212B36";

  const filteredActiveUsers = data?.details?.filter(
    (user) => user?.active === true && user?._id !== auth?.user?._id
  );

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

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
                text1: "User Successfully Deleted",
                text2: `${response?.message}`,
                visibilityTime: 3000,
                autoHide: true,
              });
            })
            .catch((error) => {
              Toast.show({
                type: "error",
                position: "top",
                text1: "Error Deleting User",
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
      {isLoading || isDeleting ? (
        <View
          className={`flex-1 justify-center items-center bg-primary-default`}
        >
          <LoadingScreen />
        </View>
      ) : (
        <SafeAreaView style={{ backgroundColor }} className={`relative flex-1`}>
          <BackIcon navigateBack={navigation.goBack} textColor={textColor} />
          <View
            className={`flex-1 items-center justify-center ${
              isDimensionLayout ? "mt-20" : "mt-14 mb-7"
            }`}
          >
            {filteredActiveUsers?.length ? (
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
                        <Text style={{ color: textColor }}>Contact Number</Text>
                      </DataTable.Title>
                      <DataTable.Title
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          padding: 10,
                          width: customWidth,
                        }}
                      >
                        <Text style={{ color: textColor }}>Role</Text>
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
                    {filteredActiveUsers?.map((item) => (
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
                            {item?.requirement?.job
                              ? item.requirement.job
                              : item?.roles}
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
          </View>
        </SafeAreaView>
      )}
    </>
  );
}
