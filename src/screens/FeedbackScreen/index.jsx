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
import { useNavigation } from "@react-navigation/native";
import { BackIcon } from "@helpers";

export default function () {
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const screenWidth = Dimensions.get("window").width;
  const itemWidth = (screenWidth - 30) / 2;

  const { backgroundColor, textColor, colorScheme } = changeColor();

  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

  const { data: feedbackData, isLoading: feedbackLoading } =
    useGetFeedbacksQuery();

  const feedbacks = feedbackData?.details;

  useEffect(() => {
    if (isFocused) {
    }
  }, [isFocused]);

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

    const maskedLength = Math.max(name.length - 2, 0);
    const maskedPart = "*".repeat(maskedLength);
    const maskedName = name[0] + maskedPart + name[name.length - 1];

    return maskedName;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => openModal(item)}
      style={{
        backgroundColor,
        width: itemWidth,
      }}
      className={`rounded-lg p-3 m-1 border`}
    >
      <Text
        style={{ color: textColor }}
        className={`text-base mb-1`}
        numberOfLines={4}
        ellipsizeMode="tail"
      >
        Customer Name: {item?.isAnonymous ? maskName(item?.name) : item?.name}
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
        <View
          className={`flex-1 justify-center items-center bg-primary-default`}
        >
          <LoadingScreen />
        </View>
      ) : (
        <>
          <SafeAreaView
            className={`flex-1 flex-grow px-1 pb-5 bg-primary-default`}
          >
            <BackIcon navigateBack={navigation.goBack} textColor={textColor} />
            <View className={`flex-row items-center justify-center mb-4 pt-5`}>
              <Text
                style={{
                  color: invertTextColor,
                }}
                className={`text-center text-2xl font-semibold my-5`}
              >
                Lhanlee Salon Feedback
              </Text>
            </View>

            <FlatList
              data={feedbacks}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
              showsVerticalScrollIndicator={false}
            />
            <Modal visible={modalVisible} transparent animationType="slide">
              <View className={`flex-1 justify-center items-center `}>
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
                    Customer Name:
                    {selectedItem?.isAnonymous
                      ? maskName(selectedItem?.name)
                      : selectedItem?.name}
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
