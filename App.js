import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  Home,
  BecomeCustomer,
  BecomeEmployee,
  UserPick,
  ChooseRole,
  SignUpCustomer,
  SignUpEmployee,
  ForgetPassword,
} from "@screens";
import { LoadingScreen } from "@components";
import { changeColor } from "@utils";
import { Feather } from "@expo/vector-icons";

const Stack = createStackNavigator();

export default function () {
  const { backgroundColor, textColor, colorScheme, toggleColorScheme } =
    changeColor();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  return (
    <>
      {isLoading ? (
        <>
          <LoadingScreen />
        </>
      ) : (
        <>
          <StatusBar
            barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
            backgroundColor={backgroundColor}
          />
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
              <Stack.Screen name="UserPick" component={UserPick} />
              <Stack.Screen name="ChooseRole" component={ChooseRole} />
              <Stack.Screen name="SignUpCustomer" component={SignUpCustomer} />
              <Stack.Screen name="SignUpEmployee" component={SignUpEmployee} />
              <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
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
      )}
    </>
  );
}
