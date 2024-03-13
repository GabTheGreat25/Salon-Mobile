import React from "react";
import { ListData, CircleCrud, LoadingScreen } from "@components";
import { View, ScrollView } from "react-native";
import { useGetUsersQuery } from "../../state/api/reducer";
import {
  Feather,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { changeColor } from "@utils";
import Calendar from "./Calendar";

export default function () {
  const { backgroundColor, textColor, colorScheme } = changeColor();

  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#FDA7DF";
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

  const { data, isLoading } = useGetUsersQuery();
  const users = data?.details ?? [];

  const usersAll = users?.filter((user) => user?.active === true);
  const userCount = usersAll.length;

  const admins = users?.filter((user) => user?.roles?.includes("Admin"));
  const adminCount = admins.length;

  const beauticians = users?.filter(
    (user) => user?.roles?.includes("Beautician") && user?.active === true
  );
  const beauticianCount = beauticians.length;

  const receptionists = users?.filter(
    (user) => user?.roles?.includes("Receptionist") && user?.active === true
  );
  const receptionistCount = receptionists.length;

  const beauticianInactive = users.filter(
    (user) => user?.roles?.includes("Beautician") && !user?.active
  );

  const receptionistInactive = users.filter(
    (user) => user?.roles?.includes("Receptionist") && !user?.active
  );

  const pendingEmployeeCount =
    beauticianInactive.length + receptionistInactive.length;

  const customers = users?.filter((user) => user?.roles?.includes("Customer"));
  const customerCount = customers.length;

  return (
    <>
      {isLoading ? (
        <View
          className={`flex-1 justify-center items-center bg-primary-default`}
        >
          <LoadingScreen />
        </View>
      ) : (
        <>
          <ScrollView
            className="flex-1 px-3 py-6"
            style={{ backgroundColor }}
            showsVerticalScrollIndicator={false}
          >
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className={`flex-row items-center justify-center`}>
                <CircleCrud
                  icon="user-plus"
                  title="User"
                  routeName="User"
                  backgroundColor={invertBackgroundColor}
                />
                <View style={{ width: 15 }} />
                <CircleCrud
                  icon="package"
                  title="Product"
                  routeName="Product"
                  backgroundColor={invertBackgroundColor}
                />
                <View style={{ width: 15 }} />
                <CircleCrud
                  icon="tool"
                  title="Service"
                  routeName="Service"
                  backgroundColor={invertBackgroundColor}
                />
                <View style={{ width: 15 }} />
                <CircleCrud
                  icon="briefcase"
                  title="Appointment"
                  routeName="Appointment"
                  backgroundColor={invertBackgroundColor}
                />
                <View style={{ width: 15 }} />
                <CircleCrud
                  icon="credit-card"
                  title="Transaction"
                  routeName="Transaction"
                  backgroundColor={invertBackgroundColor}
                />
                <View style={{ width: 15 }} />
                <CircleCrud
                  icon="message-circle"
                  title="Comment"
                  routeName="Comment"
                  backgroundColor={invertBackgroundColor}
                />
                <View style={{ width: 15 }} />
                <CircleCrud
                  icon="truck"
                  title="Delivery"
                  routeName="Delivery"
                  backgroundColor={invertBackgroundColor}
                />
                <View style={{ width: 15 }} />
                <CircleCrud
                  icon="message-square"
                  title="Feedback"
                  routeName="FeedbackTable"
                  backgroundColor={invertBackgroundColor}
                />
                <View style={{ width: 15 }} />
                <CircleCrud
                  icon="tag"
                  title="Brand"
                  routeName="Brand"
                  backgroundColor={invertBackgroundColor}
                />
                <View style={{ width: 15 }} />
                <CircleCrud
                  icon="clock"
                  title="Time"
                  routeName="Time"
                  backgroundColor={invertBackgroundColor}
                />
                <View style={{ width: 15 }} />
                <CircleCrud
                  icon="clipboard"
                  title="Status"
                  routeName="Status"
                  backgroundColor={invertBackgroundColor}
                />
                <View style={{ width: 15 }} />
                <CircleCrud
                  icon="plus-square"
                  title="Add Ons"
                  routeName="Option"
                  backgroundColor={invertBackgroundColor}
                />
                <View style={{ width: 15 }} />
                <CircleCrud
                  icon="calendar"
                  title="Month"
                  routeName="Month"
                  backgroundColor={invertBackgroundColor}
                />
                <View style={{ width: 15 }} />
                <CircleCrud
                  icon="book"
                  title={`Chemical Solution`}
                  routeName="Exclusion"
                  backgroundColor={invertBackgroundColor}
                />
              </View>
            </ScrollView>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className={`flex flex-row justify-center items-center`}>
                <ListData
                  title="Users"
                  data={userCount}
                  icon={
                    <Feather name="users" size={40} color={invertTextColor} />
                  }
                  id={data?.details?._id}
                  backgroundColor={invertBackgroundColor}
                />
                <View style={{ width: 15 }} />
                <ListData
                  title="Admins"
                  data={adminCount}
                  icon={
                    <MaterialIcons
                      name="admin-panel-settings"
                      size={40}
                      color={invertTextColor}
                    />
                  }
                  id={data?.details?._id}
                  backgroundColor={invertBackgroundColor}
                />
                <View style={{ width: 15 }} />
                <ListData
                  title="Beauticians"
                  data={beauticianCount}
                  icon={
                    <MaterialCommunityIcons
                      name="briefcase-account"
                      size={40}
                      color={invertTextColor}
                    />
                  }
                  id={data?.details?._id}
                  backgroundColor={invertBackgroundColor}
                />
                <View style={{ width: 15 }} />
                <ListData
                  title="Receptionists"
                  data={receptionistCount}
                  icon={
                    <MaterialCommunityIcons
                      name="walk"
                      size={40}
                      color={invertTextColor}
                    />
                  }
                  id={data?.details?._id}
                  backgroundColor={invertBackgroundColor}
                />
                <View style={{ width: 15 }} />
                <ListData
                  title="Customers"
                  data={customerCount}
                  icon={
                    <Feather name="user" size={40} color={invertTextColor} />
                  }
                  id={data?.details?._id}
                  backgroundColor={invertBackgroundColor}
                />
                <View style={{ width: 15 }} />
                <ListData
                  title="Pending Employees"
                  data={pendingEmployeeCount}
                  icon={
                    <MaterialCommunityIcons
                      name="account-cancel"
                      size={40}
                      color={invertTextColor}
                    />
                  }
                  id={data?.details?._id}
                  backgroundColor={invertBackgroundColor}
                />
              </View>
            </ScrollView>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className={`pb-10`}
            >
              <Calendar />
            </ScrollView>
          </ScrollView>
        </>
      )}
    </>
  );
}
