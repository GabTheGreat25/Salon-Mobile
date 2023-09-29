import React from "react";
import { Text, TouchableOpacity, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  Home,
  BecomeCustomer,
  BecomeEmployee,
  UserPick,
  ChooseRole,
} from "@screens";
import { changeColor } from "@utils";
import { Feather } from "@expo/vector-icons";

const Stack = createStackNavigator();

export default function () {
  const { backgroundColor, textColor, colorScheme, toggleColorScheme } =
    changeColor();
  return (
    <>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={backgroundColor}
      />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="UserHomePick"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="BecomeEmployee" component={BecomeEmployee} />
          <Stack.Screen name="BecomeCustomer" component={BecomeCustomer} />
          <Stack.Screen name="UserPick" component={UserPick} />
          <Stack.Screen name="ChooseRole" component={ChooseRole} />
        </Stack.Navigator>
        <TouchableOpacity
          className="absolute z-10 right-5 top-5"
          onPress={toggleColorScheme}
        >
          <Text selectable={false}>
            <Feather
              name={`${colorScheme === "dark" ? "sun" : "moon"}`}
              size={35}
              color={textColor}
            />
          </Text>
        </TouchableOpacity>
      </NavigationContainer>
    </>
  );
}
