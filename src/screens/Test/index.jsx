import React from "react";
import { View, Text, TouchableOpacity, Alert, Image } from "react-native";
import {
  useGetTestsQuery,
  useDeleteTestMutation,
} from "../../state/api/reducer";
import { logout } from "../../state/auth/authReducer";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";

export default function () {
  const { data, isLoading, isError } = useGetTestsQuery();
  const [deleteTest, { isLoading: isDeleting, isError: isDeleteError }] =
    useDeleteTestMutation();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const goToTestDetails = (id) => {
    navigation.navigate("TestGetById", { id });
  };

  const navigateToCreateTest = () => {
    navigation.navigate("CreateTest");
  };

  const navigateToTestUpdate = (id) => {
    navigation.navigate("EditTest", { id });
  };

  const handleDelete = (id) => {
    Alert.alert("Delete Test", "Are you sure you want to delete this test?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => {
          deleteTest(id)
            .unwrap()
            .then((response) => {
              console.log("Test deleted:", response);
            })
            .catch((error) => {
              console.error("Error occurred while deleting the test:", error);
            });
        },
      },
    ]);
  };

  const handleLogout = async () => {
    try {
      dispatch(logout());
      console.log("Logged out successfully.");
      // navigate("/login");
    } catch (error) {
      console.error("Error occurred while logging out:", error);
    }
  };

  return (
    <>
      <TouchableOpacity onPress={handleLogout}>
        <Text>Logout</Text>
      </TouchableOpacity>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Test Details:</Text>
        <TouchableOpacity onPress={navigateToCreateTest}>
          <Text>Create Test</Text>
        </TouchableOpacity>
        {isLoading || isDeleting ? (
          <Text>Loading...</Text>
        ) : isError || isDeleteError ? (
          <Text>Error occurred while fetching data.</Text>
        ) : (
          data.details.map((item, index) => (
            <View key={index}>
              <TouchableOpacity onPress={() => goToTestDetails(item?._id)}>
                <Text>ID: {item?._id}</Text>
              </TouchableOpacity>
              <Text>Test Name: {item?.test}</Text>
              {item.image?.map((image) => (
                <Image
                  key={image?.public_id}
                  source={{ uri: image?.url }}
                  style={{ width: 75, height: 60 }}
                />
              ))}
              <TouchableOpacity onPress={() => navigateToTestUpdate(item?._id)}>
                <Text>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item?._id)}>
                <Text>Delete</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    </>
  );
}
