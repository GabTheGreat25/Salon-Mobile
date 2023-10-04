import React from "react";
import { Feather } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import Johndoe from "@assets/johndoe.png";
import { Home } from "@screens";
import { changeColor, dimensionLayout } from "@utils";
import { RESOURCE } from "@constants";
import { UserImage } from "@components";
import { Text } from "react-native";

const Drawer = createDrawerNavigator();

export default function () {
  const { backgroundColor, textColor } = changeColor();
  const isDimensionLayout = dimensionLayout();
  const screenWidth = Dimensions.get("window").width;
  const viewWidth = isDimensionLayout
    ? screenWidth * RESOURCE.NUMBER.POINT_SEVENTY_FIVE
    : screenWidth * RESOURCE.NUMBER.POINT_FIVE;

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => {
        return (
          <SafeAreaView>
            <UserImage
              viewWidth={viewWidth}
              imageSource={Johndoe}
              imageName="John Doe"
              imageRole="Software Developer"
            />
            <DrawerItemList {...props} />
          </SafeAreaView>
        );
      }}
      screenOptions={{
        drawerStyle: {
          backgroundColor: backgroundColor,
          width: viewWidth,
        },
        headerShown: false,
      }}
    >
      <Drawer.Screen
        name="Home"
        options={{
          drawerActiveBackgroundColor: "#F78FB3",
          drawerActiveTintColor: textColor,
          drawerInactiveTintColor: "#FDA7DF",
          drawerLabel: () => (
            <Text className={`text-xl font-base`} style={{ color: textColor }}>
              Home
            </Text>
          ),
          title: "Home",
          drawerIcon: () => (
            <Feather
              name="home"
              size={RESOURCE.NUMBER.THIRTY}
              color={textColor}
            />
          ),
        }}
        component={Home}
      />
    </Drawer.Navigator>
  );
}
