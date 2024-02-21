import React from "react";
import { Welcome } from "@components";
import logo1 from "@assets/logo-1.png";
import { useNavigation } from "@react-navigation/native";

export default function () {
  const navigation = useNavigation();

  return (
    <>
      <Welcome
        title={`Looking for a \nsalon?`}
        description={`Ready to experience the ultimate in beauty and relaxation? Discover a haven of luxury and indulgence at Lhanlee Beauty Lounge.Step into a world of exquisite treatments and personalized care tailored just for you.`}        buttonTitle="Learn More"
        leftArrow={false}
        rightArrow={true}
        navigateRight={() => navigation.navigate("BecomeEmployee")}
        navigateTo={() => navigation.navigate("UserPick")}
        logo={logo1}
      />
    </>
  );
}
