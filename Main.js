import React, { useState, useEffect } from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector } from "react-redux";
import {
  Home,
  BecomeCustomer,
  BecomeEmployee,
  UserPick,
  ChooseRole,
  SignUpCustomer,
  SignUpEmployee,
  ForgetPassword,
  LoginUser,
  Test,
  TestGetById,
  CreateTest,
  EditTest,
} from "@screens";
import { LoadingScreen } from "@components";
import { changeColor } from "@utils";
import { DarkMode } from "@helpers";
import { Drawer } from "@routes";

const Stack = createStackNavigator();

export default function () {
  const { backgroundColor, textColor, colorScheme, toggleColorScheme } =
    changeColor();
  const [isLoading, setIsLoading] = useState(true);
  const icon = colorScheme === "dark" ? "sun" : "moon";
  const barStyle = colorScheme === "dark" ? "light-content" : "dark-content";

  const authenticated = useSelector((state) => state.auth?.authenticated);
  const userRoles = useSelector((state) => state.auth?.user?.roles)

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  return (
    <>
      {isLoading ? (
        <>
          {/* <LoadingScreen /> */}
        </>
      ) : (
        <>
          <StatusBar barStyle={barStyle} backgroundColor={backgroundColor} />
          <NavigationContainer>
            {authenticated ? (
              userRoles.includes("Customer") ? (
                <Stack.Navigator
                  initialRouteName="Drawer"
                  screenOptions={{
                    headerShown: false,
                  }}
                >
                  <Stack.Screen name="Drawer" component={Drawer} />
                </Stack.Navigator>
              ) : userRoles.includes("Employee") ? (
                <Stack.Navigator
                  initialRouteName="Home"
                  screenOptions={{
                    headerShown: false,
                  }}
                >
                <Stack.Screen name="Home" component={Home} />
                </Stack.Navigator>
              ) : (
                <Stack.Navigator
                  initialRouteName="Test"
                  screenOptions={{
                    headerShown: false,
                  }}
                >
                <Stack.Screen name="Test" component={Test} />
                <Stack.Screen name="TestGetById" component={TestGetById} />
                <Stack.Screen name="CreateTest" component={CreateTest} />
                <Stack.Screen name="EditTest" component={EditTest} />
                </Stack.Navigator>
              )
            ) : (
              <Stack.Navigator
                initialRouteName="LoginUser"
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="LoginUser" component={LoginUser} />
                <Stack.Screen name="SignUpCustomer" component={SignUpCustomer} />
                <Stack.Screen name="SignUpEmployee" component={SignUpEmployee} />
                <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
                <Stack.Screen name="ChooseRole" component={ChooseRole} />
                <Stack.Screen name="UserPick" component={UserPick} />
                <Stack.Screen name="BecomeCustomer" component={BecomeCustomer} />
                <Stack.Screen name="BecomeEmployee" component={BecomeEmployee} />
              </Stack.Navigator>
            )}
          </NavigationContainer>
          <DarkMode toggle={toggleColorScheme} name={icon} color={textColor} />
        </>
      )}
    </>
  );
}
