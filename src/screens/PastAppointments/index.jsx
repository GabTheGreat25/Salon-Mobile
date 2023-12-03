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
    const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#212B36";
    const invertTextColor = colorScheme === "dark" ? "#e5e5e5" : "#212B36";

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
                    className={`text-xl py-4 font-semibold text-center`}
                    style={
                        {
                            color: invertTextColor
                        }
                    }
                    >
                      {item.name}
                    </Text>
                }
                ListFooterComponent={
                    <Text
                    className={`text-lg mt-4 font-semibold text-center`}
                    style={
                        {
                            color: invertTextColor
                        }
                    }
                    >
                        End of Appointments
                    </Text>
                }
                renderItem={({ item, index })=>{
                    return(
                        <View
                        key={index}
                        className={`flex flex-row bg-pink-300 items-center p-1 rounded-lg`}
                        >
                            <View
                            className={`m-1.5`}
                            > 
                                <Image
                                className={`h-32 w-32 items-center rounded-full m-1`}
                                source={item.image}
                                />
                                <Text
                                className={`mt-3.5 text-sm text-white`}
                                >
                                    {item.date}
                                </Text>
                            </View>
                            <View
                            className={`flex-column p-3`}
                            >
                                <View
                                className={`flex-row justify-between items-center w-52`}
                                >
                                    <Text
                                    className={`font-bold text-base text-white`}
                                    >
                                        {item.service}
                                    </Text>
                                    <Text
                                    className={`font-bold text-base text-white mr-2.5`}
                                    >
                                        {item.price}
                                    </Text>
                                </View>
                                <View
                                className={`mt-1 w-52 text-left`}
                                >
                                    <Text
                                    className={`text-white text-xs`}
                                    >    
                                        {item.description}
                                    </Text>
                                </View>
                                <View
                                className={`flex-row mt-2.5 w-52 justify-end`}
                                >
                                    <TouchableOpacity
                                    className={`bg-pink-400 rounded-xl m-1.5 p-2.5`}
                                    >
                                        <Text
                                        className={`text-white text-sm font-semibold`}
                                        >
                                            Reappoint Service
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                    className={`bg-purple-400 rounded-xl m-1.5 p-2.5`}
                                    >
                                        <Text
                                        className={`text-white text-sm font-semibold`}
                                        >
                                            Add Feedback
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )
                }
            }
                />
            </View>
        </SafeAreaView>
    )
}
