import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from "react-native";
import {
  useGetTransactionsQuery,
  useGetSchedulesQuery,
} from "../../state/api/reducer";
import { LoadingScreen } from "@components";
import { changeColor } from "@utils";
import { Feather } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;
const itemWidth = (screenWidth - 30) / 2;

export default function () {
  const isFocused = useIsFocused();

  const { backgroundColor, textColor, borderColor, colorScheme } =
    changeColor();

  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#FFB6C1";
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

  const {
    data: transactionData,
    isLoading: transactionLoading,
    refetch: transactionRefetch,
  } = useGetTransactionsQuery();
  const {
    data: scheduleData,
    isLoading: scheduleLoading,
    refetch: scheduleRefetch,
  } = useGetSchedulesQuery();

  useEffect(() => {
    const fetchData = async () => {
      if (isFocused) {
        await Promise.all([transactionRefetch(), scheduleRefetch()]);
      }
    };
    fetchData();
  }, [isFocused]);

  const [currentMonthYear, setCurrentMonthYear] = useState("");
  const [currentMonthYearText, setCurrentMonthYearText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const currentDate = new Date();
    setCurrentMonthYear(
      `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`
    );
    setCurrentMonthYearText(
      currentDate.toLocaleString("default", { month: "long" }) +
        " " +
        currentDate.getFullYear()
    );

    transactionRefetch();
    scheduleRefetch();
  }, []);

  const transactions = transactionData?.details || [];
  const allSchedules = scheduleData?.details || [];

  const completedAndPendingTransactions = transactions?.filter(
    (transaction) =>
      transaction?.status === "completed" || transaction?.status === "pending"
  );

  const leaveSchedules =
    allSchedules?.filter(
      (schedule) =>
        schedule?.leaveNoteConfirmed === true && schedule?.status === "leave"
    ) || [];

  const absentSchedules =
    allSchedules?.filter((schedule) => schedule?.status === "absent") || [];

  const filteredEvents = [
    ...completedAndPendingTransactions?.map((transaction) => ({
      type: "transaction",
      data: transaction,
      datetime: new Date(
        transaction?.appointment?.date +
          "T" +
          (transaction?.appointment?.time[0] || "00:00")
      ),
    })),
    ...leaveSchedules?.map((schedule) => ({
      type: "leave",
      data: schedule,
      datetime: new Date(schedule?.date),
    })),
    ...absentSchedules?.map((schedule) => ({
      type: "absent",
      data: schedule,
      datetime: new Date(schedule?.date),
    })),
  ];

  filteredEvents.sort((a, b) => {
    if (!a?.data?.appointment?.time && b?.data?.appointment?.time) return -1;
    if (a?.data?.appointment?.time && !b?.data?.appointment?.time) return 1;

    if (a?.datetime < b?.datetime) return -1;
    if (a?.datetime > b?.datetime) return 1;

    return 0;
  });

  const totalPages = Math?.ceil(filteredEvents?.length / itemsPerPage);

  const paginatedEvents = filteredEvents?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const openModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => openModal(item)}
      style={{ backgroundColor, width: itemWidth }}
      className={`rounded-lg p-3 m-1 border`}
    >
      <Text
        style={{ color: textColor }}
        className={`text-base mb-1`}
        numberOfLines={4}
        ellipsizeMode="tail"
      >
        {item?.type === "transaction" && (
          <>
            Appointment Details:{"\n"}
            Status: {item?.data?.status}
            {"\n"}
            Service:{" "}
            {item?.data?.appointment?.service
              .map((s) => s?.service_name)
              .join(", ")}
            {"\n"}
            Customer: {item?.data?.appointment?.customer?.name}
            {"\n"}
            Employee:{" "}
            {item?.data?.appointment?.beautician
              ?.map((b) => b?.name)
              .join(", ")}
            {"\n"}
            Date:{" "}
            {new Date(item?.data?.appointment?.date).toLocaleDateString(
              "en-PH"
            )}
            {"\n"}
            Time: {item?.data?.appointment?.time.join(" - ")}
          </>
        )}

        {item?.type === "leave" && (
          <>
            Leave {"\n"}
            Employee: {item?.data?.beautician?.name}
            {"\n"}
            Date: {new Date(item?.data?.date).toLocaleDateString("en-PH")}
            {"\n"}
            Leave Note: {item?.data?.leaveNote}
          </>
        )}
        {item.type === "absent" && (
          <>
            Absent {"\n"}
            Employee: {item?.data?.beautician?.name}
            {"\n"}
            Date: {new Date(item?.data?.date).toLocaleDateString("en-PH")}
          </>
        )}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      {transactionLoading || scheduleLoading ? (
        <View className={`flex-1  min-w-[100vw] bg-primary-default`}>
          <LoadingScreen />
        </View>
      ) : (
        <>
          <SafeAreaView
            style={{
              borderColor: borderColor,
              backgroundColor: invertBackgroundColor,
            }}
            className={`flex-1 flex-grow border px-1 pb-5 rounded-xl min-w-[100vw]`}
          >
            <View className="flex-row items-center justify-between mb-4">
              <TouchableOpacity onPress={handlePreviousPage}>
                <Feather
                  name="chevron-left"
                  size={40}
                  color={invertTextColor}
                />
              </TouchableOpacity>
              <Text
                style={{ color: invertTextColor }}
                className={`text-center text-2xl font-semibold my-5`}
              >
                {currentMonthYearText}
              </Text>
              <TouchableOpacity onPress={handleNextPage}>
                <Feather
                  name="chevron-right"
                  size={40}
                  color={invertTextColor}
                />
              </TouchableOpacity>
            </View>
            <FlatList
              data={paginatedEvents}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3}
            />
            <Modal visible={modalVisible} transparent animationType="slide">
              <View
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                className={`flex-1 justify-center items-center `}
              >
                <View
                  style={{ backgroundColor }}
                  className={`p-10 rounded-lg border-1 w-[80%]`}
                >
                  <Text
                    style={{ color: textColor }}
                    className={`text-xl font-semibold mb-5`}
                    numberOfLines={8}
                    ellipsizeMode="tail"
                  >
                    {selectedItem && selectedItem?.type === "transaction" ? (
                      <>
                        Appointment Details:{"\n"}
                        Status: {selectedItem?.data?.status}
                        {"\n"}
                        Service:{" "}
                        {selectedItem?.data?.appointment?.service
                          .map((s) => s?.service_name)
                          .join(", ")}
                        {"\n"}
                        Customer:{" "}
                        {selectedItem?.data?.appointment?.customer?.name}
                        {"\n"}
                        Beautician:{" "}
                        {selectedItem?.data?.appointment?.beautician
                          ?.map((b) => b?.name)
                          .join(", ")}
                        {"\n"}
                        Date:{" "}
                        {new Date(
                          selectedItem?.data?.appointment?.date
                        ).toLocaleDateString("en-PH")}
                        {"\n"}
                        Time:{" "}
                        {selectedItem?.data?.appointment?.time.join(" - ")}
                      </>
                    ) : selectedItem?.type === "leave" ? (
                      <>
                        Leave Schedule {"\n"}
                        Employee: {selectedItem?.data?.beautician?.name}
                        {"\n"}
                        Date:{" "}
                        {new Date(selectedItem?.data?.date).toLocaleDateString(
                          "en-PH"
                        )}
                        {"\n"}
                        Leave Note: {selectedItem?.data?.leaveNote}
                      </>
                    ) : selectedItem?.type === "absent" ? (
                      <>
                        Absent Schedule {"\n"}
                        Employee: {selectedItem?.data?.beautician?.name}
                        {"\n"}
                        Date:{" "}
                        {new Date(selectedItem?.data?.date).toLocaleDateString(
                          "en-PH"
                        )}
                      </>
                    ) : (
                      ""
                    )}
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
