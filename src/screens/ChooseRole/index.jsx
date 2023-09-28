import React from "react";
import salonLogo from "@assets/salon-logo.png";
import salonLogoWhite from "@assets/salon-logo-white.png";
import {
  Image,
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from "react-native";
import { changeColor } from "@utils";

export default function () {
  const { backgroundColor, textColor } = changeColor();
  return (
    <>
      <SafeAreaView
        style={{ backgroundColor }}
        className="flex-1 bg-primary-accent flex-column"
      ></SafeAreaView>
    </>
  );
}
