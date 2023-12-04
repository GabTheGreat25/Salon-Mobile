import React from "react";
import { ListData, CircleCrud, LoadingScreen } from "@components";
import { View, ScrollView, Dimensions } from "react-native";
import { useGetUsersQuery } from "../../state/api/reducer";
import { Feather } from "@expo/vector-icons";
import { changeColor, dimensionLayout } from "@utils";
import ShowPendingEmployees from "./ShowPendingEmployees";
import randomColor from "randomcolor";

export default function () {
  const { width: deviceWidth } = Dimensions.get("window");
  const customCircleWidth = deviceWidth * 0.086;
  const customBoxWidth = deviceWidth * 0.0525;

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
          <ScrollView
            className="flex-1 px-3 py-6"
            style={{ backgroundColor }}
            showsVerticalScrollIndicator={false}
          >
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View
                className={`flex-row items-center justify-center`}
                style={{
                  paddingHorizontal: isDimensionLayout ? 0 : customCircleWidth,
                }}
              >
                <CircleCrud
                  icon="truck"
                  title="Delivery"
                  routeName="Delivery"
                  backgroundColor={randomColor({ luminosity: "bright" })}
                />
                <View style={{ width: 15 }} />
                <CircleCrud
                  icon="package"
                  title="Product"
                  routeName="Product"
                  backgroundColor={randomColor({ luminosity: "bright" })}
                />
                <View style={{ width: 15 }} />
                <CircleCrud
                  icon="tool"
                  title="Service"
                  routeName="Service"
                  backgroundColor={randomColor({ luminosity: "bright" })}
                />
                <View style={{ width: 15 }} />
                <CircleCrud
                  icon="clock"
                  title="Appointment"
                  routeName="Appointment"
                  backgroundColor={randomColor({ luminosity: "bright" })}
                />
                <View style={{ width: 15 }} />
                <CircleCrud
                  icon="user-plus"
                  title="User"
                  routeName="User"
                  backgroundColor={randomColor({ luminosity: "bright" })}
                />
                <View style={{ width: 15 }} />
                <CircleCrud
                  icon="clipboard"
                  title="Schedule"
                  routeName="Test"
                  backgroundColor={randomColor({ luminosity: "bright" })}
                />
                <View style={{ width: 15 }} />
                <CircleCrud
                  icon="credit-card"
                  title="Transaction"
                  routeName="Test"
                  backgroundColor={randomColor({ luminosity: "bright" })}
                />
                <View style={{ width: 15 }} />
                <CircleCrud
                  icon="message-square"
                  title="Comment"
                  routeName="Test"
                  backgroundColor={randomColor({ luminosity: "bright" })}
                />
              </View>
            </ScrollView>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View
                className={`flex flex-row justify-center items-center`}
                style={{
                  paddingHorizontal: isDimensionLayout ? 0 : customBoxWidth,
                }}
              >
                <ListData
                  title="Admin"
                  data={adminCount}
                  icon={<Feather name="user" size={40} color={textColor} />}
                  id={data?.details?._id}
                  backgroundColor={randomColor({ luminosity: "bright" })}
                />
                <View style={{ width: 15 }} />
                <ListData
                  title="Employee"
                  data={employeeCount}
                  icon={<Feather name="users" size={40} color={textColor} />}
                  id={data?.details?._id}
                  backgroundColor={randomColor({ luminosity: "bright" })}
                />
                <View style={{ width: 15 }} />
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
