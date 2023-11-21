import React from "react";
import { ListData, LoadingScreen } from "@components";
import { View, ScrollView } from "react-native";
import { useGetUsersQuery } from "../../state/api/reducer";
import { Feather } from "@expo/vector-icons";
import { changeColor, dimensionLayout } from "@utils";
import ShowPendingEmployees from "./ShowPendingEmployees";
import randomColor from "randomcolor";

export default function () {
  const { data, isLoading } = useGetUsersQuery();
  const users = data?.details ?? [];

  const admins = users?.filter((user) => user?.roles?.includes("Admin"));
  const adminCount = admins.length;

  const employees = users?.filter(
    (user) => user?.roles?.includes("Employee") && user?.active === true
  );
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
                  title="Admin"
                  data={adminCount}
                  icon={<Feather name="user" size={40} color={textColor} />}
                  id={data?.details?._id}
                  backgroundColor={randomColor({ luminosity: "bright" })}
                />
                <View style={{ width: 10 }} />
                <ListData
                  title="Employee"
                  data={employeeCount}
                  icon={<Feather name="users" size={40} color={textColor} />}
                  id={data?.details?._id}
                  backgroundColor={randomColor({ luminosity: "bright" })}
                />
                <View style={{ width: 10 }} />
                <ListData
                  title="Customer"
                  data={customerCount}
                  icon={
                    <Feather name="user-check" size={40} color={textColor} />
                  }
                  id={data?.details?._id}
                  backgroundColor={randomColor({ luminosity: "bright" })}
                />
              </View>
            </ScrollView>
            <View>
              <ShowPendingEmployees />
            </View>
          </ScrollView>
        </>
      )}
    </>
  );
}
