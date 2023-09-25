import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Home, BecomeCustomer, BecomeEmployee } from "./src/screens";

const Stack = createStackNavigator();

export default function () {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="BecomeEmployee" component={BecomeEmployee} />
        <Stack.Screen name="BecomeCustomer" component={BecomeCustomer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
