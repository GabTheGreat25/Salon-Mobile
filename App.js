import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Home, BecomeCustomer, BecomeEmployee , UserPick } from "@screens";
import { changeColor } from "@utils";

const Stack = createStackNavigator();

export default function () {
  const { colorScheme, toggleColorScheme } = changeColor();
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="UserPick"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="UserPick" component={UserPick} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="BecomeEmployee" component={BecomeEmployee} />
          <Stack.Screen name="BecomeCustomer" component={BecomeCustomer} />
        </Stack.Navigator>
        <TouchableOpacity
          style={styles.moonIconContainer}
          onPress={toggleColorScheme}
        >
          <Text selectable={false} style={styles.moonIcon}>
            {`${colorScheme === "dark" ? "🌞" : "🌙"}`}
          </Text>
        </TouchableOpacity>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  moonIconContainer: {
    position: "absolute",
    top: 35,
    right: 15,
    zIndex: 1,
  },
  moonIcon: {
    fontSize: 24,
  },
});
