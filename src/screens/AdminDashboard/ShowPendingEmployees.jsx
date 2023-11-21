import React from "react";
import { ScrollView, View, Text, Dimensions, StyleSheet } from "react-native";
import { useGetUsersQuery } from "../../state/api/reducer";
import { LoadingScreen } from "@components";
import { PieChart } from "react-native-chart-kit";
import randomColor from "randomcolor";
import { changeColor, dimensionLayout } from "@utils";

export default function () {
  const isDimensionLayout = dimensionLayout();
  const { width: deviceWidth } = Dimensions.get("window");
  const { data, isLoading } = useGetUsersQuery();
  const users = data?.details ?? [];
  const totalUsers = users.length;
  const { textColor } = changeColor();

  const customWidth = deviceWidth * (isDimensionLayout ? 1 : 0.5);

  const getStatusCount = (status) =>
    users.filter((user) => user?.active === status).length;

  const generateChartData = (status, label, color) => {
    const count = getStatusCount(status);
    const percentage = ((count / totalUsers) * 100).toFixed(2);
    return {
      name: label,
      count,
      color,
      percentage: parseFloat(percentage),
    };
  };

  const pieChartData = [
    generateChartData(true, "% Active Users", randomColor({ luminosity: "bright" })),
    generateChartData(false, "% Not Active Users", randomColor({ luminosity: "bright" })),
  ];

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView horizontal className={`mt-3`}>
      <View className={`justify-between items-center`}>
        <Text
          style={{ color: textColor }}
          className={`text-center mb-4 text-xl font-bold`}
        >
          Active & Not Active Users
        </Text>
        <PieChart
          data={pieChartData}
          width={customWidth}
          height={200}
          chartConfig={{
            backgroundColor: "#FDA7DF",
            backgroundGradientFrom: "#F78FB3",
            backgroundGradientTo: "#FDB9E5",
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: { borderRadius: 16 },
          }}
          hasLegend={false}
          accessor="percentage"
          backgroundColor="transparent"
          paddingLeft="100"
          absolute
        />
        <View className={`flex-row mt-4 justify-center items-center`}>
          {pieChartData.map((dataPoint, index) => (
            <View
              key={index}
              style={{ backgroundColor: dataPoint.color }}
              className={`flex-row justify-center items-center rounded-md p-2 mr-4`}
            >
              <Text style={{ color: textColor }} className={`pr-1 font-bold`}>
                {dataPoint.name.replace("%", "")} : {dataPoint.count}
              </Text>
              <Text style={{ color: textColor }} className={`pr-1 font-bold`}>
                ({dataPoint.percentage.toFixed(2)}%)
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
