import React from "react";
import { Opening } from "@components";
import { dimensionLayout } from "@utils";
import { useNavigation } from "@react-navigation/native";

export default function () {
  const navigation = useNavigation();
  const isDimensionLayout = dimensionLayout();
  return (
    <>
      <Opening
        title="Are you?"
        showTitle={true}
        showName={false}
        navigateBack={() => navigation.goBack()}
        firstButton="Employee"
        navigateFirstButton={() => navigation.navigate("SignUpEmployee")}
        secondButton="Customer"
        navigateSecondButton={() => navigation.navigate("SignUpCustomer")}
        dimensionLayout={isDimensionLayout}
      />
    </>
  );
}
