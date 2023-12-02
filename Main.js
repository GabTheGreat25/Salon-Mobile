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
  UpdateUserPassword,
  User,
  Product,
  CreateProduct,
  EditProduct,
  Delivery,
  CreateDelivery,
  EditDelivery,
  Service,
  CreateService,
  EditService,
  Relevance,
  Popular,
  MostRecent,
  Budget,
} from "@screens";
import { LoadingScreen } from "@components";
import { changeColor } from "@utils";
import { DarkMode } from "@helpers";
import { AdminDrawer, EmployeeDrawer, CustomerDrawer } from "@drawer";

const Stack = createStackNavigator();

export default function () {
  const { backgroundColor, textColor, colorScheme, toggleColorScheme } =
    changeColor();
  const [isLoading, setIsLoading] = useState(true);
  const icon = colorScheme === "dark" ? "sun" : "moon";
  const barStyle = colorScheme === "dark" ? "light-content" : "dark-content";

  const authenticated = useSelector((state) => state.auth?.authenticated);
  const userRoles = useSelector((state) => state.auth?.user?.roles);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  return (
    <>
      {/* {isLoading ? (
        <>
          <LoadingScreen />
        </>
      ) : ( */}
      <>
        <StatusBar barStyle={barStyle} backgroundColor={backgroundColor} />
        <NavigationContainer>
          {authenticated ? (
            userRoles.includes("Online Customer") ? (
              <Stack.Navigator
                initialRouteName="CustomerDrawer"
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen
                  name="CustomerDrawer"
                  component={CustomerDrawer}
                />
                <Stack.Screen
                  name="UpdateUserPassword"
                  component={UpdateUserPassword}
                />
                <Stack.Screen name="Relevance" component={Relevance} />
                <Stack.Screen name="Popular" component={Popular} />
                <Stack.Screen name="MostRecent" component={MostRecent} />
                <Stack.Screen name="Budget" component={Budget} />
              </Stack.Navigator>
            ) : userRoles.includes("Employee") ? (
              <Stack.Navigator
                initialRouteName="EmployeeDrawer"
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen
                  name="EmployeeDrawer"
                  component={EmployeeDrawer}
                />
                <Stack.Screen
                  name="UpdateUserPassword"
                  component={UpdateUserPassword}
                />
              </Stack.Navigator>
            ) : userRoles.includes("Admin") ? (
              <Stack.Navigator
                initialRouteName="AdminDrawer"
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="AdminDrawer" component={AdminDrawer} />
                <Stack.Screen
                  name="UpdateUserPassword"
                  component={UpdateUserPassword}
                />
                <Stack.Screen name="User" component={User} />
                <Stack.Screen name="Product" component={Product} />
                <Stack.Screen name="CreateProduct" component={CreateProduct} />
                <Stack.Screen name="EditProduct" component={EditProduct} />
                <Stack.Screen name="Delivery" component={Delivery} />
                <Stack.Screen
                  name="CreateDelivery"
                  component={CreateDelivery}
                />
                <Stack.Screen name="EditDelivery" component={EditDelivery} />
                <Stack.Screen name="Service" component={Service} />
                <Stack.Screen name="CreateService" component={CreateService} />
                <Stack.Screen name="EditService" component={EditService} />
              </Stack.Navigator>
            ) : null
          ) : (
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="Home" component={Home} />
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
      {/* )} */}
    </>
  );
}
