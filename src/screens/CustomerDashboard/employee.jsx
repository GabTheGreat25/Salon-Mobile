import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import { changeColor, dimensionLayout } from "@utils";
import { useNavigation } from "@react-navigation/native";
import { BackIcon } from "@helpers";
import { useGetUsersQuery } from "../../state/api/reducer";
import { LoadingScreen } from "@components";
import { useDispatch } from "react-redux";
import { appointmentSlice } from "../../state/appointment/appointmentReducer";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function () {
  const { textColor, backgroundColor, colorScheme } = changeColor();
  const navigation = useNavigation();
  const isDimensionLayout = dimensionLayout();
  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#FDA7DF";
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

  const dispatch = useDispatch();

  const handlePress = () => {
    navigation.navigate("Checkout");
  };

  const { data, isLoading } = useGetUsersQuery();

  const filteredEmployees = data?.details?.filter(
    (user) => user?.roles.includes("Employee") && user?.active === true
  );

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const items = filteredEmployees || [];

  return (
    <>
      {isLoading ? (
        <View
          className={`flex-1 justify-center items-center bg-primary-default`}
        >
          <LoadingScreen />
        </View>
      ) : (
        <SafeAreaView style={{ backgroundColor }} className={`flex-1`}>
          <BackIcon navigateBack={navigation.goBack} textColor={textColor} />
          <View className={`flex-1 mt-20`}>
            <FlatList
              data={items}
              showsVerticalScrollIndicator={false}
              decelerationRate="fast"
              scrollEventThrottle={1}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={<View style={{ paddingBottom: 24 }} />}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelectedEmployee(item);
                    dispatch(
                      appointmentSlice.actions.setEmployee({
                        _id: item?._id,
                      })
                    );
                  }}
                  activeOpacity={0.7}
                >
                  <View
                    style={{
                      backgroundColor: invertBackgroundColor,
                      height: windowHeight * 0.2,
                      width: windowWidth * 0.925,
                      opacity: selectedEmployee === item ? 0.7 : 1,
                    }}
                    className={`flex-row rounded gap-x-2 ${
                      isDimensionLayout ? "mt-4 mx-4 px-4 pt-5" : "mx-3"
                    }`}
                  >
                    <Image
                      style={{ width: 150, height: 120 }}
                      source={{ uri: item?.image?.[0]?.url }}
                      resizeMode="cover"
                    />
                    <View className={`flex-col justify-start items-start`}>
                      <Text
                        style={{
                          color: invertTextColor,
                        }}
                        className={`${
                          isDimensionLayout
                            ? "w-[200px] text-xl py-1"
                            : "text-lg px-4 py-6"
                        } font-semibold`}
                      >
                        Name: {item.name}
                      </Text>
                      <Text
                        style={{
                          color: invertTextColor,
                          fontWeight: "bold",
                        }}
                        className={`${
                          isDimensionLayout
                            ? "text-lg py-1"
                            : "text-lg px-4 py-6"
                        } font-semibold`}
                      >
                        Contact: {item.contact_number}
                      </Text>
                      <Text
                        style={{
                          color: invertTextColor,
                        }}
                        className={`text-start ${
                          isDimensionLayout ? "text-lg py-1" : "text-base px-4"
                        } font-semibold`}
                      >
                        Job: {item.requirement?.job}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
          <View
            style={{
              backgroundColor,
              height: windowHeight * 0.1,
              width: windowWidth,
            }}
            className={`flex-col px-10 py-5`}
          >
            <TouchableOpacity onPress={handlePress}>
              <View
                style={{
                  backgroundColor: invertBackgroundColor,
                }}
                className={`justify-center items-center rounded-md py-2`}
              >
                <Text
                  style={{ color: invertTextColor }}
                  className={`text-center ${
                    isDimensionLayout ? "text-lg" : "text-lg px-4 py-6"
                  } font-bold`}
                >
                  Confirm
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}
    </>
  );
}
