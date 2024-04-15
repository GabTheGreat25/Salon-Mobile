import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from "react-native";
import { useGetFeedbacksQuery } from "../../state/api/reducer";
import { LoadingScreen } from "@components";
import { changeColor } from "@utils";
import { Feather } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

export default function () {
  const isFocused = useIsFocused();

  const screenWidth = Dimensions.get("window").width;
  const itemWidth = (screenWidth - 30) / 2;

  const { backgroundColor, textColor, borderColor, colorScheme } =
    changeColor();

  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#FFB6C1";
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

  const { data: feedbackData, isLoading: feedbackLoading } =
    useGetFeedbacksQuery();

  const feedbacks = feedbackData?.details;

  useEffect(() => {
    if (isFocused) {
    }
  }, [isFocused]);

  const [currentMonthYearText, setCurrentMonthYearText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const openModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const maskName = (name) => {
    if (!name) return "Hidden";

    const maskedLength = Math.max(name.length - 2, 0); // Keep the first and last character visible
    const maskedPart = "*".repeat(maskedLength);
    const maskedName = name[0] + maskedPart + name[name.length - 1]; // Keep the first and last character visible

    return maskedName;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => openModal(item)}
      style={{
        backgroundColor,
        width: itemWidth,
        padding: 10,
        margin: 5,
        borderRadius: 8,
      }}
      className={`rounded-lg p-3 m-1 border`}
    >
      <Text
        style={{ color: textColor }}
        className={`text-base mb-1`}
        numberOfLines={4}
        ellipsizeMode="tail"
      >
        Customer Name: {item?.isAnonymous ?  maskName(item?.name) : item?.name}
      </Text>
      <Text
        style={{ color: textColor }}
        className={`text-base mb-1`}
        numberOfLines={4}
        ellipsizeMode="tail"
      >
        Feedback:{item?.description}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      {feedbackLoading ? (
        <View style={{ flex: 1, backgroundColor: "#000" }}>
          <LoadingScreen />
        </View>
      ) : (
        <>
          <SafeAreaView
            style={{
              flex: 1,
              borderColor: borderColor,
              backgroundColor: invertBackgroundColor,
            }}
            className={`flex-1 flex-grow border px-1 pb-5 rounded-xl min-w-[100vw]`}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
              className={`flex-row items-center justify-between mb-4`}
            >
              <TouchableOpacity>
                <Feather
                  name="chevron-left"
                  size={40}
                  color={invertTextColor}
                />
              </TouchableOpacity>
              <Text
                style={{
                  color: invertTextColor,
                  textAlign: "center",
                  fontSize: 24,
                  fontWeight: "bold",
                  marginVertical: 5,
                }}
                className={`text-center text-2xl font-semibold my-5`}
              >
                Lhanlee Salon Feedback
              </Text>
              <TouchableOpacity>
                <Feather
                  name="chevron-right"
                  size={40}
                  color={invertTextColor}
                />
              </TouchableOpacity>
            </View>
            <FlatList
              data={feedbacks}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3}
            />
            <Modal visible={modalVisible} transparent animationType="slide">
              <View
                style={{
                  flex: 1,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                className={`flex-1 justify-center items-center `}
              >
                <View
                  style={{ backgroundColor: backgroundColor }}
                  className={`p-10 rounded-lg border-1 w-[80%]`}
                >
                  <Text
                    style={{ color: textColor }}
                    className={`text-xl font-semibold mb-5`}
                    numberOfLines={8}
                    ellipsizeMode="tail"
                  >
                    Customer Name :{selectedItem?.name}
                  </Text>
                  <Text
                    style={{ color: textColor }}
                    className={`text-xl font-semibold mb-5`}
                    numberOfLines={8}
                    ellipsizeMode="tail"
                  >
                    Feedback Description: {selectedItem?.description}
                  </Text>
                  <TouchableOpacity
                    className={`bg-primary-default rounded-lg`}
                    onPress={closeModal}
                  >
                    <Text
                      style={{ color: textColor }}
                      className={`text-center py-2 font-semibold text-xl`}
                    >
                      Close
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </SafeAreaView>
        </>
      )}
    </>
  );
}
