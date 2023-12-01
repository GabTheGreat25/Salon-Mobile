import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { changeColor } from "@utils";
import { useSelector } from "react-redux";

export default function ({ name, color, toggle }) {
  const userRoles = useSelector((state) => state.auth?.user?.roles);
  const { textColor } = changeColor();

  const isOnlineCustomer = userRoles?.includes("Online Customer");

  return (
    <>
      {isOnlineCustomer && (
        <>
          <TouchableOpacity
            className="absolute z-[1000] right-14 top-4"
            onPress={toggle}
          >
            <Text selectable={false}>
              <Feather name="shopping-bag" size={25} color={textColor} />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="absolute z-[1000] right-5 top-4"
            onPress={toggle}
          >
            <Text selectable={false}>
              <Feather name={name} size={25} color={color} />
            </Text>
          </TouchableOpacity>
        </>
      )}
      {!isOnlineCustomer && (
        <TouchableOpacity
          className="absolute z-[1000] right-5 top-4"
          onPress={toggle}
        >
          <Text selectable={false}>
            <Feather name={name} size={25} color={color} />
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
}
