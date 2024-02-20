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
  Cart,
  Checkout,
  PaymentOption,
  Employee,
  ChooseDate,
  CheckoutSuccess,
  PastAppointment,
  Settings,
  Receipt,
  Appointment,
  EditAppointment,
  Transaction,
  EditTransaction,
  ResetPassword,
  Comment,
  FeedbackTable,
  CreateBrand,
  EditBrand,
  Brand,
  Time,
  CreateTime,
  EditTime,
  Status,
  CreateStatus,
  EditStatus,
  Option,
  CreateOption,
  EditOption,
  Exclusion,
  CreateExclusion,
  EditExclusion,
  Month,
  EditMonth,
  EditBeauticianAppoinment,
} from "@screens";
import { TermsConditions, PrivacyPolicy, Feedback } from "@settings";
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
                <Stack.Screen name="Cart" component={Cart} />
                <Stack.Screen name="Checkout" component={Checkout} />
                <Stack.Screen name="PaymentOption" component={PaymentOption} />
                <Stack.Screen name="Employee" component={Employee} />
                <Stack.Screen name="ChooseDate" component={ChooseDate} />
                <Stack.Screen
                  name="PastAppointment"
                  component={PastAppointment}
                />
                <Stack.Screen name="Receipt" component={Receipt} />
                <Stack.Screen
                  name="CheckoutSuccess"
                  component={CheckoutSuccess}
                />
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
                <Stack.Screen
                  name="EditTransaction"
                  component={EditTransaction}
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
                <Stack.Screen name="Appointment" component={Appointment} />
                <Stack.Screen
                  name="EditAppointment"
                  component={EditAppointment}
                />
                <Stack.Screen name="Transaction" component={Transaction} />
                <Stack.Screen
                  name="EditTransaction"
                  component={EditTransaction}
                />
                <Stack.Screen name="Comment" component={Comment} />
                <Stack.Screen name="FeedbackTable" component={FeedbackTable} />
                <Stack.Screen name="CreateBrand" component={CreateBrand} />
                <Stack.Screen name="EditBrand" component={EditBrand} />
                <Stack.Screen name="Brand" component={Brand} />
                <Stack.Screen name="Time" component={Time} />
                <Stack.Screen name="CreateTime" component={CreateTime} />
                <Stack.Screen name="EditTime" component={EditTime} />
                <Stack.Screen name="Status" component={Status} />
                <Stack.Screen name="CreateStatus" component={CreateStatus} />
                <Stack.Screen name="EditStatus" component={EditStatus} />
                <Stack.Screen name="Option" component={Option} />
                <Stack.Screen name="CreateOption" component={CreateOption} />
                <Stack.Screen name="EditOption" component={EditOption} />
                <Stack.Screen name="Exclusion" component={Exclusion} />
                <Stack.Screen
                  name="CreateExclusion"
                  component={CreateExclusion}
                />
                <Stack.Screen name="EditExclusion" component={EditExclusion} />
                <Stack.Screen name="Month" component={Month} />
                <Stack.Screen name="EditMonth" component={EditMonth} />
                <Stack.Screen
                  name="EditBeauticianAppoinment"
                  component={EditBeauticianAppoinment}
                />
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
              <Stack.Screen name="ResetPassword" component={ResetPassword} />
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
