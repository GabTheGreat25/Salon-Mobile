import React from "react";
import { Opening } from "@components";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

export default function MyComponent() {
  const navigation = useNavigation();
  const hiring = useSelector((state) => state.hiring);

  return (
    <>
      <Opening
        title="Are you?"
        showTitle={true}
        showName={false}
        navigateBack={() => navigation.goBack()}
        firstButton={hiring.hiringData.isHiring === true ? "Beautician" : null}
        navigateFirstButton={() => {
          if (hiring.hiringData.isHiring === true) {
            navigation.navigate("SignUpEmployee");
          }
        }}
        secondButton="Customer"
        navigateSecondButton={() => navigation.navigate("SignUpCustomer")}
      />
    </>
  );
}
