import { TouchableOpacity, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { changeColor } from "@utils";
import { useNavigation } from "@react-navigation/native";

export default function ({ name, color, toggle }) {
  const navigation = useNavigation();
  const { textColor } = changeColor();

  const userRoles = useSelector((state) => state.auth?.user?.roles);
  const authenticated = useSelector((state) => state.auth.authenticated);
  const count = useSelector((state) => state.appointment.count);

  const isCustomer = userRoles?.includes("Customer");
  const isReceptionist = userRoles?.includes("Receptionist");

  const handleCart = () => {
    navigation.navigate("Cart");
  };

  return (
    <>
      {(isCustomer || isReceptionist) && authenticated === true ? (
        <>
          <TouchableOpacity
            className="absolute z-[1000] right-5 top-4"
            onPress={toggle}
          >
            <Text selectable={false}>
              <Feather name={name} size={25} color={color} />
            </Text>
          </TouchableOpacity>
          <View className={`absolute right-[60px] top-4 z-[1000]`}>
            {count > 0 ? (
              <TouchableOpacity onPress={handleCart}>
                <Feather name="shopping-bag" size={25} color={textColor} />
              </TouchableOpacity>
            ) : (
              <Feather name="shopping-bag" size={25} color={textColor} />
            )}
            {count > 0 ? (
              <TouchableOpacity
                onPress={handleCart}
                className={`absolute left-[25px] bottom-4 z-[1000]`}
              >
                <Text style={{ color: textColor }}>{count}</Text>
              </TouchableOpacity>
            ) : (
              <Text
                selectable={false}
                className={`absolute left-[25px] bottom-4 z-[1000]`}
              >
                <Text style={{ color: textColor }}>0</Text>
              </Text>
            )}
          </View>
        </>
      ) : (
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
