import React from "react";
import { Welcome } from "@components";
import logo2 from "@assets/logo-2.png";
import { useNavigation } from "@react-navigation/native";

export default function () {
  const navigation = useNavigation();

  return (
    <>
      <Welcome
        title="Become a Lanlee Beautician"
        description={`Are you passionate about beauty and wellness?Turn your passion into a rewarding career as a beautician at Lhanlee Beauty Lounge..`}
        buttonTitle="Learn More"
        leftArrow={true}
        rightArrow={true}
        navigateLeft={() => navigation.navigate("Home")}
        navigateRight={() => navigation.navigate("BecomeCustomer")}
        navigateTo={() => navigation.navigate("ChooseRole")}
        logo={logo2}
      />
    </>
  );
}
