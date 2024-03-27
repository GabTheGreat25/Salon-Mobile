import React from "react";
import { Feather, MaterialIcons, Entypo } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import {
  CustomerDashboard,
  EditCustomerProfile,
  PastAppointment,
  Settings,
  Schedule,
  CustomerComment,
} from "@screens";
import { changeColor, dimensionLayout } from "@utils";
import { RESOURCE } from "@constants";
import { UserImage } from "@components";
import { Text, TouchableOpacity, View, ScrollView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../state/auth/authReducer";
import { clearAppointmentData } from "../../state/appointment/appointmentReducer";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Drawer = createDrawerNavigator();

export default function () {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);
  const { backgroundColor, textColor, shadowColor } = changeColor();
  const isDimensionLayout = dimensionLayout();
  const screenWidth = Dimensions.get("window").width;
  const viewWidth = isDimensionLayout
    ? screenWidth * RESOURCE.NUMBER.POINT_SEVENTY_FIVE
    : screenWidth * RESOURCE.NUMBER.POINT_FIVE;

  const handleLogout = async () => {
    try {
      AsyncStorage.removeItem("modalShown");
      dispatch(clearAppointmentData());
      dispatch(logout());
      Toast.show({
        type: "success",
        position: "top",
        text1: "Logged out",
        text2: `User logged out successfully`,
        visibilityTime: 3000,
        autoHide: true,
      });
    } catch (error) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Error Logging Out",
        text2: `${error?.message}`,
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  };

  return (
    <>
      <Drawer.Navigator
        initialRouteName="CustomerDashboard"
        drawerContent={(props) => {
          return (
            <SafeAreaView>
              <ScrollView
                showsVerticalScrollIndicator={false}
                decelerationRate="fast"
                scrollEventThrottle={1}
              >
                <UserImage
                  viewWidth={viewWidth}
                  imageSource={{
                    uri:
                      user?.image && user.image.length
                        ? user.image[
                            Math.floor(Math.random() * user.image.length)
                          ].url
                        : null,
                  }}
                  imageName={user?.name}
                  imageRole={user?.roles}
                />

                <DrawerItemList {...props} />
                <TouchableOpacity
                  onPress={handleLogout}
                  className={`border-t-[1.25px] my-4 p-[21px]`}
                  style={{ borderColor: textColor }}
                >
                  <View className={`flex flex-row gap-x-8`}>
                    <Feather
                      name="log-out"
                      size={RESOURCE.NUMBER.THIRTY}
                      color={textColor}
                    />
                    <Text
                      className={`text-xl font-base`}
                      style={{ color: textColor }}
                    >
                      Logout
                    </Text>
                  </View>
                </TouchableOpacity>
              </ScrollView>
            </SafeAreaView>
          );
        }}
        screenOptions={{
          drawerStyle: {
            backgroundColor: backgroundColor,
            width: viewWidth,
          },
          headerStyle: {
            backgroundColor: backgroundColor,
            shadowColor: shadowColor,
          },
          headerShown: true,
          headerTitle: () => null,
          headerTintColor: textColor,
        }}
      >
        <Drawer.Screen
          name="CustomerDashboard"
          options={{
            drawerActiveBackgroundColor: "#F78FB3",
            drawerActiveTintColor: textColor,
            drawerInactiveTintColor: "#FDA7DF",
            drawerLabel: () => (
              <Text
                className={`text-xl font-base`}
                style={{ color: textColor }}
              >
                Dashboard
              </Text>
            ),
            title: "CustomerDashboard",
            drawerIcon: () => (
              <Feather
                name="home"
                size={RESOURCE.NUMBER.THIRTY}
                color={textColor}
              />
            ),
          }}
          component={CustomerDashboard}
        />
        <Drawer.Screen
          name="EditCustomerProfile"
          options={{
            drawerActiveBackgroundColor: "#F78FB3",
            drawerActiveTintColor: textColor,
            drawerInactiveTintColor: "#FDA7DF",
            drawerLabel: () => (
              <Text
                className={`text-xl font-base`}
                style={{ color: textColor }}
              >
                Edit Profile
              </Text>
            ),
            title: "EditCustomerProfile",
            drawerIcon: () => (
              <Feather
                name="edit"
                size={RESOURCE.NUMBER.THIRTY}
                color={textColor}
              />
            ),
          }}
          component={EditCustomerProfile}
        />
        <Drawer.Screen
          name="Schedule"
          options={{
            drawerActiveBackgroundColor: "#F78FB3",
            drawerActiveTintColor: textColor,
            drawerInactiveTintColor: "#FDA7DF",
            drawerLabel: () => (
              <Text
                className={`text-xl font-base`}
                style={{ color: textColor }}
              >
                Schedule
              </Text>
            ),
            title: "Schedule",
            drawerIcon: () => (
              <Feather
                name="calendar"
                size={RESOURCE.NUMBER.THIRTY}
                color={textColor}
              />
            ),
          }}
          component={Schedule}
        />
        <Drawer.Screen
          name="PastAppointment"
          options={{
            drawerActiveBackgroundColor: "#F78FB3",
            drawerActiveTintColor: textColor,
            drawerInactiveTintColor: "#FDA7DF",
            drawerLabel: () => (
              <Text
                className={`text-xl font-base`}
                style={{ color: textColor }}
              >
                History
              </Text>
            ),
            title: "PastAppointment",
            drawerIcon: () => (
              <MaterialIcons
                name="history"
                size={RESOURCE.NUMBER.THIRTY}
                color={textColor}
              />
            ),
          }}
          component={PastAppointment}
        />
        <Drawer.Screen
          name="CustomerComment"
          options={{
            drawerActiveBackgroundColor: "#F78FB3",
            drawerActiveTintColor: textColor,
            drawerInactiveTintColor: "#FDA7DF",
            drawerLabel: () => (
              <Text
                className={`text-xl font-base`}
                style={{ color: textColor }}
              >
                Comments
              </Text>
            ),
            title: "CustomerComment",
            drawerIcon: () => (
              <Entypo
                name="chat"
                size={RESOURCE.NUMBER.THIRTY}
                color={textColor}
              />
            ),
          }}
          component={CustomerComment}
        />
      </Drawer.Navigator>
    </>
  );
}
