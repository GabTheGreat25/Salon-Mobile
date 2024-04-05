import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Modal,
  TextInput,
} from "react-native";
import {
  useGetAppointmentsQuery,
  useGetTimesQuery,
  useGetUsersQuery,
  useGetExclusionsQuery,
} from "../../state/api/reducer";
import { customerSlice } from "../../state/auth/customerIdReducer";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { changeColor } from "@utils";
import { LoadingScreen } from "@components";
import Autocomplete from "react-native-autocomplete-input";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function () {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { textColor, backgroundColor, colorScheme } = changeColor();
  const borderColor = colorScheme === "dark" ? "#e5e5e5" : "#212B36";
  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#FDA7DF";
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

  const { data, isLoading } = useGetAppointmentsQuery();
  const appointment = data?.details;
  const { data: timesData, isLoading: timesLoading } = useGetTimesQuery();
  const times = timesData?.details;
  const { data: user, isLoading: usersLoading } = useGetUsersQuery();
  const users = user?.details;

  const filteredUsers = users?.filter((user) =>
    user?.roles.includes("Customer")
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [SearchUsers, setSearchUsers] = useState([]);

  const handleViewModal = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setModalVisible(false);
  };

  const { data: allergies, isLoading: exclusionLoading } =
    useGetExclusionsQuery();
  const exclusions = allergies?.details;

  let filteredExclusions = exclusions
    ?.filter((exclusion) =>
      selectedUser?.information?.allergy?.includes(exclusion._id)
    )
    .map((exclusion) => exclusion.ingredient_name);

  if (
    Array.isArray(selectedUser?.information?.allergy) &&
    (selectedUser?.information?.allergy.includes("None") ||
      selectedUser?.information?.allergy.includes("Others"))
  ) {
    filteredExclusions = selectedUser?.information?.allergy;
  }

  const othersMessage =
    Array.isArray(selectedUser?.information?.allergy) &&
    selectedUser?.information?.allergy.includes("Others")
      ? selectedUser?.information.othersMessage
      : null;

  const today = new Date();
  const utcOffset = 8 * 60;
  const phTime = new Date(today.getTime() + utcOffset * 60000);
  //! Uncomment the line below if you want to test the time
  // const phTime = new Date(
  //   today.getTime() + utcOffset * 60000 + 9 * 60 * 60 * 1000
  // );

  const formattedDateWithTime = phTime.toISOString();
  const currentTime = formattedDateWithTime.slice(11, 19);
  const formattedDate = phTime.toISOString().split("T")[0];
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    };
    return new Date(dateString).toLocaleDateString("en-PH", options);
  };

  const formattedDatePH = formatDate(formattedDate);

  const appointmentToday = appointment?.filter((a) => {
    const appointmentDate = new Date(a?.date).toISOString().split("T")[0];
    return appointmentDate === formattedDate;
  });

  const appointmentTimes = appointmentToday?.flatMap((a) => a.time);
  const availableTimes = times?.filter(
    (t) => !appointmentTimes?.includes(t.time)
  );

  const filteredTimes = availableTimes?.filter((time) => {
    const appointmentTime = time?.time;
    const timeParts = appointmentTime.split(" ");
    const [hour, minute] = timeParts[0].split(":");
    const isPM = timeParts[1] === "PM";
    let hour24 = parseInt(hour, 10);

    if (isPM && hour24 !== 12) {
      hour24 += 12;
    } else if (!isPM && hour24 === 12) {
      hour24 = 0;
    }

    const currentHour24 = parseInt(currentTime.slice(0, 2), 10);
    const currentMinute = parseInt(currentTime.slice(3, 5), 10);

    return (
      hour24 > currentHour24 ||
      (hour24 === currentHour24 && parseInt(minute, 10) >= currentMinute)
    );
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = filteredUsers.filter((user) =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchUsers(filtered);
  };

  const handleSelectCustomer = (customerId) => {
    const selectedCustomer = filteredUsers.find(
      (user) => user._id === customerId
    );

    if (selectedCustomer) {
      dispatch(
        customerSlice.actions.customerForm({
          customerId,
          name: selectedCustomer?.name,
          contact_number: selectedCustomer?.contact_number,
          allergy: Array.isArray(selectedCustomer?.information?.allergy)
            ? selectedCustomer?.information?.allergy
            : [],
          othersMessage: selectedCustomer?.information?.othersMessage,
        })
      );
    }

    navigation.navigate("ReceptionistCustomer");
  };

  return (
    <>
      {isLoading || timesLoading || usersLoading || exclusionLoading ? (
        <View
          className={`flex-1 justify-center items-center bg-primary-default`}
        >
          <LoadingScreen />
        </View>
      ) : (
        <SafeAreaView style={{ backgroundColor }} className={`flex-1`}>
          <View className={`flex-1`}>
            {filteredTimes?.length > 0 ? (
              <View
                className={`flex-row flex-wrap justify-center items-center p-2`}
              >
                <Text
                  style={{ color: textColor }}
                  className={`text-lg text-center font-semibold pb-3`}
                >
                  Available Time for Today: {formattedDatePH}
                </Text>
                {filteredTimes.map((time) => (
                  <View
                    key={time?._id}
                    style={{
                      backgroundColor: invertBackgroundColor,
                    }}
                    className={`flex-row rounded-lg m-2 px-4 py-2`}
                  >
                    <View style={{ alignItems: "center" }}>
                      <Text className={`text-lg text-center font-semibold`}>
                        {time?.time}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View className={`items-center justify-center my-4`}>
                <Text className={`text-xl text-center font-semibold`}>
                  All Slots Are Occupied For Today
                </Text>
              </View>
            )}

            <View className={`pb-16 mx-4`}>
              <Autocomplete
                data={SearchUsers}
                defaultValue={searchQuery}
                onChangeText={handleSearch}
                placeholder="Search users..."
                style={{
                  backgroundColor: invertBackgroundColor,
                  color: invertTextColor,
                }}
                className={`py-2 px-4 text-lg font-normal rounded-lg my-2`}
              />
            </View>

            <FlatList
              data={searchQuery ? SearchUsers : filteredUsers}
              showsVerticalScrollIndicator={false}
              decelerationRate="fast"
              scrollEventThrottle={1}
              keyExtractor={(item) => item?._id}
              renderItem={({ item }) => (
                <View
                  key={item?._id}
                  style={{
                    backgroundColor: invertBackgroundColor,
                    height: windowHeight * 0.21,
                    width: windowWidth * 0.925,
                  }}
                  className={`flex-row rounded-lg gap-x-2 px-2 mx-4 mb-3 pt-4`}
                >
                  <Image
                    style={{ width: 150, height: 150 }}
                    key={
                      item.image[Math.floor(Math.random() * item.image?.length)]
                        ?.public_id
                    }
                    source={{
                      uri: item.image[
                        Math.floor(Math.random() * item.image?.length)
                      ]?.url,
                    }}
                    resizeMode="contain"
                  />
                  <View className={`flex-col justify-start items-start`}>
                    <Text
                      style={{
                        color: invertTextColor,
                      }}
                      className={`text-lg font-semibold`}
                    >
                      Name:{" "}
                      {item?.name.length > 13
                        ? `${item?.name.substring(0, 13)}...`
                        : item?.name}
                    </Text>
                    <Text
                      style={{
                        color: invertTextColor,
                      }}
                      className={`text-lg font-semibold`}
                    >
                      Age: {item?.age}
                    </Text>
                    <Text
                      style={{
                        color: invertTextColor,
                      }}
                      className={`text-lg font-semibold`}
                    >
                      Contact: {item?.contact_number}
                    </Text>
                    <View className={`flex-row self-end gap-x-3`}>
                      <TouchableOpacity onPress={() => handleViewModal(item)}>
                        <View
                          style={{
                            backgroundColor,
                          }}
                          className={`rounded-lg py-2 px-6 mt-3`}
                        >
                          <Text
                            style={{ color: textColor }}
                            className={`text-center text-lg font-semibold`}
                          >
                            View
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleSelectCustomer(item?._id)}
                      >
                        <View
                          style={{
                            backgroundColor,
                          }}
                          className={`rounded-lg py-2 px-6 mt-3`}
                        >
                          <Text
                            style={{ color: textColor }}
                            className={`text-center text-lg font-semibold`}
                          >
                            Select
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            />

            <View>
              {modalVisible && (
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={handleCloseModal}
                >
                  <View
                    style={{
                      backgroundColor: "rgba(0,0,0,0.6)",
                    }}
                    className={`items-center justify-center flex-1`}
                  >
                    <View
                      style={{
                        backgroundColor,
                        width: "80%",
                      }}
                      className={`p-4 rounded-lg`}
                    >
                      <Text
                        style={{ color: textColor }}
                        className={`text-2xl font-semibold pb-4`}
                      >
                        Customer Details
                      </Text>
                      <View className={`self-center`}>
                        <Image
                          source={{
                            uri:
                              selectedUser?.image &&
                              selectedUser?.image?.length > 0
                                ? selectedUser?.image[
                                    Math.floor(
                                      Math.random() *
                                        selectedUser?.image?.length
                                    )
                                  ]?.url
                                : noPhoto,
                          }}
                          style={{ width: 150, height: 150 }}
                          className={`rounded-full`}
                        />
                      </View>
                      <Text
                        style={{ color: textColor }}
                        className={`text-lg font-semibold pb-1 pt-4 flex-wrap`}
                      >
                        Name: {selectedUser?.name}
                      </Text>
                      <Text
                        style={{ color: textColor }}
                        className={`text-lg font-semibold pb-1 flex-wrap`}
                      >
                        Age: {selectedUser?.age}
                      </Text>
                      <Text
                        style={{ color: textColor }}
                        className={`text-lg font-semibold pb-1 flex-wrap`}
                      >
                        Contact: {selectedUser?.contact_number}
                      </Text>
                      <Text
                        style={{ color: textColor }}
                        className={`font-semibold text-base`}
                      >
                        Chemical Solution Exclusions
                      </Text>
                      <TextInput
                        style={{
                          color: textColor,
                          height: 100,
                          textAlignVertical: "top",
                        }}
                        className={`border-[1.5px] py-2 px-4 text-lg font-normal rounded-lg my-2 ${borderColor}`}
                        autoCapitalize="none"
                        multiline={true}
                        value={filteredExclusions.join(", ")}
                        editable={false}
                      />
                      {othersMessage && (
                        <React.Fragment>
                          <Text
                            style={{ color: textColor }}
                            className={`font-semibold text-base`}
                          >
                            Type
                          </Text>
                          <TextInput
                            style={{ color: textColor }}
                            className={`border-[1.5px] py-2 pl-4 text-lg font-normal rounded-full my-2 ${borderColor}`}
                            autoCapitalize="none"
                            value={othersMessage}
                            editable={false}
                          />
                        </React.Fragment>
                      )}
                      <View className={`items-center justify-center pt-4`}>
                        <TouchableOpacity
                          onPress={handleCloseModal}
                          className={`bg-primary-accent rounded-lg`}
                        >
                          <Text
                            style={{ color: invertTextColor }}
                            className={`text-xl font-semibold py-2 px-6`}
                          >
                            Close
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>
              )}
            </View>
          </View>
        </SafeAreaView>
      )}
    </>
  );
}
