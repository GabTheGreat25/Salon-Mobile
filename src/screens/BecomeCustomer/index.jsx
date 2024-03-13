import React from "react";
import { Welcome } from "@components";
import logo3 from "@assets/lhanlee-customer.png";
import { useNavigation } from "@react-navigation/native";

export default function () {
  const navigation = useNavigation();

  return (
    <>
      <Welcome
        title="Become a Lhanlee Customer"
        description={`Ready to experience the ultimate in beauty and relaxation? Discover a haven of luxury and indulgence at Lhanlee Beauty Lounge.`}
        buttonTitle="Learn More"
        leftArrow={true}
        rightArrow={false}
        navigateLeft={() => navigation.navigate("BecomeEmployee")}
        navigateTo={() => navigation.navigate("ChooseRole")}
        logo={logo3}
      />
    </>
  );
}
