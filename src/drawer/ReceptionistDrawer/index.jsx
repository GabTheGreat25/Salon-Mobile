import React from "react";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import {
  ReceptionistDashboard,
  EditReceptionistProfile,
  ReceptionistLeaveDate,
  ReceptionistGetAllLeaveDate,
} from "@screens";
import { changeColor, dimensionLayout } from "@utils";
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
  const isDimensionLayout = dimensionLayout();
  const screenWidth = Dimensions.get("window").width;
  const viewWidth = isDimensionLayout
    ? screenWidth * RESOURCE.NUMBER.POINT_SEVENTY_FIVE
    : screenWidth * RESOURCE.NUMBER.POINT_FIVE;

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
        initialRouteName="ReceptionistDashboard"
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
          name="ReceptionistDashboard"
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
            title: "ReceptionistDashboard",
            drawerIcon: () => (
              <Feather
                name="home"
                size={RESOURCE.NUMBER.THIRTY}
                color={textColor}
              />
            ),
          }}
          component={ReceptionistDashboard}
        />
        <Drawer.Screen
          name="EditReceptionistProfile"
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
            title: "EditReceptionistProfile",
            drawerIcon: () => (
              <Feather
                name="edit"
                size={RESOURCE.NUMBER.THIRTY}
                color={textColor}
              />
            ),
          }}
          component={EditReceptionistProfile}
        />
        <Drawer.Screen
          name="ReceptionistLeaveDate"
          options={{
            drawerActiveBackgroundColor: "#F78FB3",
            drawerActiveTintColor: textColor,
            drawerInactiveTintColor: "#FDA7DF",
            drawerLabel: () => (
              <Text
                className={`text-xl font-base`}
                style={{ color: textColor }}
              >
                File Leave
              </Text>
            ),
            title: "ReceptionistLeaveDate",
            drawerIcon: () => (
              <FontAwesome5
                name="door-open"
                size={RESOURCE.NUMBER.TWENTY_FIVE}
                color={textColor}
              />
            ),
          }}
          component={ReceptionistLeaveDate}
        />
        <Drawer.Screen
          name="ReceptionistGetAllLeaveDate"
          options={{
            drawerActiveBackgroundColor: "#F78FB3",
            drawerActiveTintColor: textColor,
            drawerInactiveTintColor: "#FDA7DF",
            drawerLabel: () => (
              <Text
                className={`text-xl font-base`}
                style={{ color: textColor }}
              >
                Edit Leave
              </Text>
            ),
            title: "ReceptionistGetAllLeaveDate",
            drawerIcon: () => (
              <Feather
                name="file-text"
                size={RESOURCE.NUMBER.THIRTY}
                color={textColor}
              />
            ),
          }}
          component={ReceptionistGetAllLeaveDate}
        />
      </Drawer.Navigator>
    </>
  );
}
