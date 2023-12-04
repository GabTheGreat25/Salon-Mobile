import React from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { changeColor, dimensionLayout } from "@utils";
import { useNavigation } from "@react-navigation/native";
import { BackIcon } from "@helpers";
import SalonFaceWash from "@assets/face-wash.png";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function () {
  const { textColor, backgroundColor, shadowColor, colorScheme } =
    changeColor();
  const navigation = useNavigation();
  const isDimensionLayout = dimensionLayout();
  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#FDA7DF";
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

  const handlePress = () => {
    navigation.navigate("Checkout");
  };

  const items = [
    {
      name: "Face Wash",
      image: SalonFaceWash,
      date: "28 Jan, 09:32",
      price: "₱ 559.00",
      description: ` Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia dolor molestias, nihil eligendi incidunt ducimus accusantium. Voluptatum quae, unde consectet ur accusamus iusto, excepturi dolore deleniti incidunt, dignissimos dolor veniam alias? Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia dolor molestias, nihil eligendi incidunt ducimus accusantium. Voluptatum quae, unde consectet ur accusamus iusto, excepturi dolore deleniti incidunt, dignissimos dolor veniam alias?`,
      buttonOne: "Reappoint Service",
      buttonTwo: "Add Feedback",
    },
    {
      name: "Face Wash",
      image: SalonFaceWash,
      date: "28 Jan, 09:32",
      price: "₱ 559.00",
      description: ` Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia dolor molestias, nihil eligendi incidunt ducimus accusantium. Voluptatum quae, unde consectet ur accusamus iusto, excepturi dolore deleniti incidunt, dignissimos dolor veniam alias? Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia dolor molestias, nihil eligendi incidunt ducimus accusantium. Voluptatum quae, unde consectet ur accusamus iusto, excepturi dolore deleniti incidunt, dignissimos dolor veniam alias?`,
      buttonOne: "Reappoint Service",
      buttonTwo: "Add Feedback",
    },
    {
      name: "Face Wash",
      image: SalonFaceWash,
      date: "28 Jan, 09:32",
      price: "₱ 559.00",
      description: ` Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia dolor molestias, nihil eligendi incidunt ducimus accusantium. Voluptatum quae, unde consectet ur accusamus iusto, excepturi dolore deleniti incidunt, dignissimos dolor veniam alias? Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia dolor molestias, nihil eligendi incidunt ducimus accusantium. Voluptatum quae, unde consectet ur accusamus iusto, excepturi dolore deleniti incidunt, dignissimos dolor veniam alias?`,
      buttonOne: "Reappoint Service",
      buttonTwo: "Add Feedback",
    },
    {
      name: "Face Wash",
      image: SalonFaceWash,
      date: "28 Jan, 09:32",
      price: "₱ 559.00",
      description: ` Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia dolor molestias, nihil eligendi incidunt ducimus accusantium. Voluptatum quae, unde consectet ur accusamus iusto, excepturi dolore deleniti incidunt, dignissimos dolor veniam alias? Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia dolor molestias, nihil eligendi incidunt ducimus accusantium. Voluptatum quae, unde consectet ur accusamus iusto, excepturi dolore deleniti incidunt, dignissimos dolor veniam alias?`,
      buttonOne: "Reappoint Service",
      buttonTwo: "Add Feedback",
    },
    {
      name: "Face Wash",
      image: SalonFaceWash,
      date: "28 Jan, 09:32",
      price: "₱ 559.00",
      description: ` Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia dolor molestias, nihil eligendi incidunt ducimus accusantium. Voluptatum quae, unde consectet ur accusamus iusto, excepturi dolore deleniti incidunt, dignissimos dolor veniam alias? Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia dolor molestias, nihil eligendi incidunt ducimus accusantium. Voluptatum quae, unde consectet ur accusamus iusto, excepturi dolore deleniti incidunt, dignissimos dolor veniam alias?`,
      buttonOne: "Reappoint Service",
      buttonTwo: "Add Feedback",
    },
  ];

  return (
    <>
      <View style={{ backgroundColor }} className={`flex-1`}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          decelerationRate="fast"
          scrollEventThrottle={1}
          style={{
            backgroundColor,
          }}
          className={`px-3 flex-1 mt-4`}
        >
          <ScrollView
            decelerationRate="fast"
            scrollEventThrottle={1}
            showsVerticalScrollIndicator={false}
          >
            {items.map((item, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: invertBackgroundColor,
                  height: windowHeight * 0.25,
                  width: windowWidth * 0.925,
                }}
                className={`flex-row gap-x-4 rounded-2xl ${
                  isDimensionLayout ? "mx-1 px-4 pt-4 mb-2" : "mx-3"
                }`}
              >
                <View className={`flex-col gap-y-2`}>
                  <Image
                    source={item.image}
                    resizeMode="cover"
                    className={`h-[100px] w-[100px] rounded-full`}
                  />
                  <Text
                    style={{ color: invertTextColor }}
                    className={`text-center ${
                      isDimensionLayout ? "text-base" : "text-lg px-4 py-6"
                    } font-semibold`}
                  >
                    {item.date}
                  </Text>
                </View>
                <View className={`flex-1 flex-col`}>
                  <View className={`flex-row`}>
                    <Text
                      style={{ color: invertTextColor }}
                      className={`text-center ${
                        isDimensionLayout ? "text-lg" : "text-lg px-4 py-6"
                      } font-semibold`}
                    >
                      {item.name}
                    </Text>
                    <View className={`flex-1 flex-row justify-end items-start`}>
                      <Text
                        style={{ color: invertTextColor }}
                        className={`text-center ${
                          isDimensionLayout ? "text-lg" : "text-lg px-4 py-6"
                        } font-semibold`}
                      >
                        {item.price}
                      </Text>
                    </View>
                  </View>
                  <View className={`pt-3`}>
                    <ScrollView
                      decelerationRate="fast"
                      scrollEventThrottle={1}
                      showsVerticalScrollIndicator={false}
                      style={{ maxHeight: "60%" }}
                    >
                      <Text
                        style={{ color: invertTextColor }}
                        className={`${
                          isDimensionLayout ? "text-xs" : "text-lg px-4 py-6"
                        } font-semibold`}
                      >
                        {item.description}
                      </Text>
                    </ScrollView>
                  </View>
                  <View className={`flex-1 gap-x-2 flex-row`}>
                    <TouchableOpacity
                      className={`px-4 py-2 rounded-2xl bg-primary-accent  self-start`}
                    >
                      <Text
                        style={{ color: invertTextColor }}
                        className={`${
                          isDimensionLayout
                            ? "text-[10px]"
                            : "text-lg px-4 py-6"
                        } font-semibold`}
                      >
                        {item.buttonOne}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className={`px-4 py-2 rounded-2xl bg-secondary-accent  self-start`}
                    >
                      <Text
                        style={{ color: invertTextColor }}
                        className={`${
                          isDimensionLayout
                            ? "text-[10px]"
                            : "text-lg px-4 py-6"
                        } font-semibold`}
                      >
                        {item.buttonTwo}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </ScrollView>
      </View>
    </>
  );
}
