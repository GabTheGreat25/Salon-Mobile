import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";

export default function ({ navigateBack, textColor, navigateTo }) {
  const userRoles = useSelector((state) => state.auth?.user?.roles);
  const count = useSelector((state) => state.appointment.count);

  const isOnlineCustomer = userRoles?.includes("Online Customer");

  return (
    <>
      {isOnlineCustomer && (
        <>
          <View className={`absolute top-3 z-[1000]`}>
            <TouchableOpacity onPress={navigateBack}>
              <Feather name="chevron-left" size={35} color={textColor} />
            </TouchableOpacity>
          </View>
          <View className={`absolute right-14 top-4 z-[1000]`}>
            <TouchableOpacity onPress={navigateTo}>
              <Feather name="shopping-bag" size={25} color={textColor} />
            </TouchableOpacity>
            <Text
              selectable={false}
              className={`absolute left-[25px] bottom-4 z-[1000]`}
            >
              {count > 0 && <Text style={{ color: textColor }}>{count}</Text>}
            </Text>
          </View>
        </>
      )}
      {!isOnlineCustomer && (
        <View className={`absolute top-3 z-[1000]`}>
          <TouchableOpacity onPress={navigateBack}>
            <Feather name="chevron-left" size={35} color={textColor} />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}
