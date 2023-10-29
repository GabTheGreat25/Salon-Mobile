import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useGetTestsQuery, useDeleteTestMutation } from "../../state/api/reducer";
import { useNavigation } from "@react-navigation/native";

export default function () {
  const { data, isLoading, isError } = useGetTestsQuery();
  const [deleteTest, { isLoading: isDeleting, isError: isDeleteError }] =
    useDeleteTestMutation();
  const navigation = useNavigation();

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
    Alert.alert(
      "Delete Test",
      "Are you sure you want to delete this test?",
      [
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
      ]
    );
  };

  return (
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
  );
}
