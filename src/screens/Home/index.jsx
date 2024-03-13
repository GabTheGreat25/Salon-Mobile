import React from "react";
import { Welcome } from "@components";
import logo1 from "@assets/lhanlee-front.png";
import { useNavigation } from "@react-navigation/native";

export default function () {
  const navigation = useNavigation();

  return (
    <>
      <Welcome
        title={`Looking for a \nsalon?`}
        description={`Step into a world of personalized beauty at Lhanlee Beauty Lounge. Sign up today and embark on a journey of self-care and confidence with Lhanlee Beauty Lounge. Let us be your partner in achieving your beauty goals.`}
        buttonTitle="Learn More"
        leftArrow={false}
        rightArrow={true}
        navigateRight={() => navigation.navigate("BecomeEmployee")}
        navigateTo={() => navigation.navigate("UserPick")}
        logo={logo1}
      />
    </>
  );
}
