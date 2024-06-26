import React from "react";
import { Feather } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import {
  AdminDashboard,
  EditAdminProfile,
  ConfirmBeautician,
  CustomerWaiver,
  ConfirmReschedule,
  BeauticianLeave,
  HiringBeautician,
  AppointmentSchedule,
} from "@screens";
import { changeColor } from "@utils";
import { RESOURCE } from "@constants";
import { UserImage } from "@components";
import { Text, TouchableOpacity, View, ScrollView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../state/auth/authReducer";
import Toast from "react-native-toast-message";

const Drawer = createDrawerNavigator();

export default function () {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);

  const { backgroundColor, textColor, shadowColor } = changeColor();
  const screenWidth = Dimensions.get("window").width;
  const viewWidth = screenWidth * RESOURCE.NUMBER.POINT_SEVENTY_FIVE;

  const handleLogout = async () => {
    try {
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
        initialRouteName="AdminDashboard"
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
                  imageName={`Welcome back, ${user?.name}`}
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
                      className={`text-lg font-base`}
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
            backgroundColor,
            width: viewWidth,
          },
          headerStyle: {
            backgroundColor,
            shadowColor: shadowColor,
          },
          headerShown: true,
          headerTitle: () => null,
          headerTintColor: textColor,
        }}
      >
        <Drawer.Screen
          name="AdminDashboard"
          options={{
            drawerActiveBackgroundColor: "#FF7086",
            drawerActiveTintColor: textColor,
            drawerInactiveTintColor: "#FFB6C1",
            drawerLabel: () => (
              <Text
                className={`text-lg font-base`}
                style={{ color: textColor }}
              >
                Dashboard
              </Text>
            ),
            title: "AdminDashboard",
            drawerIcon: () => (
              <Feather
                name="home"
                size={RESOURCE.NUMBER.THIRTY}
                color={textColor}
              />
            ),
          }}
          component={AdminDashboard}
        />
        <Drawer.Screen
          name="EditAdminProfile"
          options={{
            drawerActiveBackgroundColor: "#FF7086",
            drawerActiveTintColor: textColor,
            drawerInactiveTintColor: "#FFB6C1",
            drawerLabel: () => (
              <Text
                className={`text-lg font-base`}
                style={{ color: textColor }}
              >
                Edit Profile
              </Text>
            ),
            title: "EditAdminProfile",
            drawerIcon: () => (
              <Feather
                name="edit"
                size={RESOURCE.NUMBER.THIRTY}
                color={textColor}
              />
            ),
          }}
          component={EditAdminProfile}
        />
        <Drawer.Screen
          name="CustomerWaiver"
          options={{
            drawerActiveBackgroundColor: "#FF7086",
            drawerActiveTintColor: textColor,
            drawerInactiveTintColor: "#FFB6C1",
            drawerLabel: () => (
              <Text
                className={`text-lg font-base`}
                style={{ color: textColor }}
              >
                Customer Waiver
              </Text>
            ),
            title: "CustomerWaiver",
            drawerIcon: () => (
              <Feather
                name="file-text"
                size={RESOURCE.NUMBER.THIRTY}
                color={textColor}
              />
            ),
          }}
          component={CustomerWaiver}
        />
        <Drawer.Screen
          name="ConfirmReschedule"
          options={{
            drawerActiveBackgroundColor: "#FF7086",
            drawerActiveTintColor: textColor,
            drawerInactiveTintColor: "#FFB6C1",
            drawerLabel: () => (
              <Text
                className={`text-lg font-base`}
                style={{ color: textColor }}
              >
                Resched Application
              </Text>
            ),
            title: "ConfirmReschedule",
            drawerIcon: () => (
              <Feather
                name="clipboard"
                size={RESOURCE.NUMBER.THIRTY}
                color={textColor}
              />
            ),
          }}
          component={ConfirmReschedule}
        />
        <Drawer.Screen
          name="HiringBeautician"
          options={{
            drawerActiveBackgroundColor: "#FF7086",
            drawerActiveTintColor: textColor,
            drawerInactiveTintColor: "#FFB6C1",
            drawerLabel: () => (
              <Text
                className={`text-lg font-base`}
                style={{ color: textColor }}
              >
                Open Hiring
              </Text>
            ),
            title: "HiringBeautician",
            drawerIcon: () => (
              <Feather
                name="info"
                size={RESOURCE.NUMBER.THIRTY}
                color={textColor}
              />
            ),
          }}
          component={HiringBeautician}
        />
        <Drawer.Screen
          name="ConfirmBeautician"
          options={{
            drawerActiveBackgroundColor: "#FF7086",
            drawerActiveTintColor: textColor,
            drawerInactiveTintColor: "#FFB6C1",
            drawerLabel: () => (
              <Text
                className={`text-lg font-base`}
                style={{ color: textColor }}
              >
                Hiring Application
              </Text>
            ),
            title: "ConfirmBeautician",
            drawerIcon: () => (
              <Feather
                name="user-check"
                size={RESOURCE.NUMBER.THIRTY}
                color={textColor}
              />
            ),
          }}
          component={ConfirmBeautician}
        />
        <Drawer.Screen
          name="beauticianLeave"
          options={{
            drawerActiveBackgroundColor: "#FF7086",
            drawerActiveTintColor: textColor,
            drawerInactiveTintColor: "#FFB6C1",
            drawerLabel: () => (
              <Text
                className={`text-lg font-base`}
                style={{ color: textColor }}
              >
                Leave Application
              </Text>
            ),
            title: "beauticianLeave",
            drawerIcon: () => (
              <Feather
                name="user-x"
                size={RESOURCE.NUMBER.THIRTY}
                color={textColor}
              />
            ),
          }}
          component={BeauticianLeave}
        />
        <Drawer.Screen
          name="scheduleToday"
          options={{
            drawerActiveBackgroundColor: "#FF7086",
            drawerActiveTintColor: textColor,
            drawerInactiveTintColor: "#FFB6C1",
            drawerLabel: () => (
              <Text
                className={`text-lg font-base`}
                style={{ color: textColor }}
              >
                Schedule Today
              </Text>
            ),
            title: "scheduleToday",
            drawerIcon: () => (
              <Feather
                name="clock"
                size={RESOURCE.NUMBER.THIRTY}
                color={textColor}
              />
            ),
          }}
          component={AppointmentSchedule}
        />
      </Drawer.Navigator>
    </>
  );
}
