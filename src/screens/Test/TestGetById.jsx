import React from "react";
import { View, Text, Image } from "react-native";
import { useGetTestByIdQuery } from "../../state/api/reducer";
import { BackIcon } from "@helpers";
import { useNavigation } from "@react-navigation/native";

export default function ({ route }) {
  const { id } = route.params;
  const navigation = useNavigation();
  const { data, isLoading, isError } = useGetTestByIdQuery(id);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <BackIcon navigateBack={navigation.goBack} />
      <Text>Test Details:</Text>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : isError ? (
        <Text>Error occurred while fetching data.</Text>
      ) : (
        <View>
          <Text>ID: {data.details?._id}</Text>
          <Text>Test Name: {data.details?.test}</Text>
          {data.details?.image?.map((image) => (
              <Image
                key={image?.public_id}
                source={{ uri: image?.url }}
                style={{ width: 75, height: 60 }}
              />
            ))}
        </View>
      )}
    </View>
  );
}
