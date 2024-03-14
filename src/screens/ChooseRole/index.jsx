import React from "react";
import { Opening } from "@components";
import { useNavigation } from "@react-navigation/native";
import { useGetHiringsQuery } from "../../state/api/reducer";

export default function MyComponent() {
  const navigation = useNavigation();
  const { data } = useGetHiringsQuery();
  const hiring = data?.details[0];

  return (
    <>
      <Opening
        title="Are you?"
        showTitle={true}
        showName={false}
        navigateBack={() => navigation.goBack()}
        firstButton={
          hiring.isHiring && hiring.type === "Beautician"
            ? "Beautician"
            : hiring.isHiring && hiring.type === "Receptionist"
            ? "Receptionist"
            : null
        }
        navigateFirstButton={() => {
          if (hiring.isHiring && hiring.type === "Beautician") {
            navigation.navigate("SignUpEmployee");
          } else if (hiring.isHiring && hiring.type === "Receptionist") {
            navigation.navigate("SignUpReceptionist");
          }
        }}
        secondButton="Customer"
        navigateSecondButton={() => navigation.navigate("SignUpCustomer")}
      />
    </>
  );
}
