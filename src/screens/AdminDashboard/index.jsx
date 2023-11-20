import React from "react";
import { ListData, LoadingScreen } from "@components";
import { View, ScrollView } from "react-native";
import { useGetUsersQuery } from "../../state/api/reducer";
import { Feather } from "@expo/vector-icons";
import { changeColor, dimensionLayout } from "@utils";

export default function () {
  const { data, isLoading, isError } = useGetUsersQuery();
  const users = data?.details ?? [];
  const usersCount = users.length;
  const admins = users?.filter((user) => user?.roles?.includes("Admin"));
  const adminCount = admins.length;
  const employees = users?.filter((user) => user?.roles?.includes("Employee"));
  const employeeCount = employees.length;
  const customers = users?.filter((user) =>
    user?.roles?.includes("Online Customer")
  );
  const customerCount = customers.length;
  const { textColor, backgroundColor } = changeColor();
  const isDimensionLayout = dimensionLayout();

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
          <ScrollView className="flex-1 py-6 px-3" style={{ backgroundColor }}>
            <ScrollView horizontal>
              <View className={`flex flex-row justify-center items-center`}>
                <ListData
                  title="Users"
                  data={usersCount}
                  icon={<Feather name="users" size={40} color={textColor} />}
                  id={data?.details?._id}
                  backgroundColor={"#FDA7DF"}
                />
                <View style={{ width: 10 }} />
                <ListData
                  title="Admin"
                  data={adminCount}
                  icon={<Feather name="user" size={40} color={textColor} />}
                  id={data?.details?._id}
                  backgroundColor={"#F78FB3"}
                />
                <View style={{ width: 10 }} />
                <ListData
                  title="Employee"
                  data={employeeCount}
                  icon={
                    <Feather name="briefcase" size={40} color={textColor} />
                  }
                  id={data?.details?._id}
                  backgroundColor={"#FDA7DF"}
                />
                <View style={{ width: 10 }} />
                <ListData
                  title="Customer"
                  data={customerCount}
                  icon={
                    <Feather name="shopping-bag" size={40} color={textColor} />
                  }
                  id={data?.details?._id}
                  backgroundColor={"#F78FB3"}
                />
              </View>
            </ScrollView>
          </ScrollView>
        </>
      )}
    </>
  );
}
