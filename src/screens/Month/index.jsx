import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Button,
} from "react-native";
import { useGetMonthsQuery } from "../../state/api/reducer";
import { LoadingScreen } from "@components";
import { BackIcon } from "@helpers";
import { DataTable } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import { changeColor } from "@utils";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";

const { width: deviceWidth } = Dimensions.get("window");

export default function () {
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const customWidth = deviceWidth * 0.3;

  const { data, isLoading, refetch } = useGetMonthsQuery();
  useEffect(() => {
    const fetchData = async () => {
      if (isFocused) refetch();
    };
    fetchData();
  }, [isFocused]);

  const { backgroundColor, textColor, borderColor } = changeColor();

  const [page, setPage] = useState(0);
  const itemsPerPage = 10;

  const handleEditMonth = (id) => {
    navigation.navigate("EditMonth", { id });
  };

  const totalPageCount = Math.ceil(data?.details?.length / itemsPerPage);
  const paginatedData = data?.details?.slice(
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

  const handleViewMonth = (id) => {
    navigation.navigate("ViewMonth", { id });
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <>
      {isLoading ? (
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
                          <Text style={{ color: textColor }}>Month Name</Text>
                        </DataTable.Title>
                        <DataTable.Title
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 10,
                            width: customWidth,
                          }}
                        >
                          <Text style={{ color: textColor }}>Message</Text>
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
                              {item?.month != null
                                ? monthNames[item.month]
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
                              {item?.message}
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
                              onPress={() => handleViewMonth(item?._id)}
                            >
                              <Feather name="eye" size={24} color="green" />
                            </TouchableOpacity>
                            <View style={{ width: 10 }} />
                            <TouchableOpacity
                              onPress={() => handleEditMonth(item?._id)}
                            >
                              <Feather name="edit" size={24} color="blue" />
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
