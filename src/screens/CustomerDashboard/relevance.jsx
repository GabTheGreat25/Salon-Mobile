import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import { useDispatch } from "react-redux";
import { changeColor, dimensionLayout } from "@utils";
import { BackIcon } from "@helpers";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useGetServicesQuery } from "../../state/api/reducer";
import { LoadingScreen } from "@components";
import { appointmentSlice } from "../../state/appointment/appointmentReducer";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function () {
  const { textColor, backgroundColor, colorScheme } = changeColor();
  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation();
  const isDimensionLayout = dimensionLayout();
  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#212B36";
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

  const { data, isLoading } = useGetServicesQuery();

  const items = data?.details || [];

  const handlePress = (selectedProduct) => {
    dispatch(
      appointmentSlice.actions.setService({
        service: selectedProduct?._id || "",
        service_name: selectedProduct?.service_name || "",
        product_name: selectedProduct?.product.product_name || "",
        price: selectedProduct?.price || 0,
        extraFee: selectedProduct?.extraFee || 0,
        image: selectedProduct?.image || [],
      })
    );
  };

  const handlePopular = () => {
    navigation.navigate("Popular");
  };

  const handleMostRecent = () => {
    navigation.navigate("MostRecent");
  };

  const handleBudget = () => {
    navigation.navigate("Budget");
  };

  const [selectedOption, setSelectedOption] = useState("Relevance");

  useEffect(() => {
    if (route) {
      setSelectedOption(route.name);
    }
  }, [route]);

  const handleBack = () => {
    navigation.navigate("CustomerDrawer");
  };

  const handleCart = () => {
    navigation.navigate("Cart");
  };

  return (
    <>
      {isLoading ? (
        <View
          className={`flex-1 justify-center items-center bg-primary-default`}
        >
          <LoadingScreen />
        </View>
      ) : (
        <>
          <BackIcon
            navigateBack={handleBack}
            textColor={textColor}
            navigateTo={handleCart}
          />
          <View
            style={{
              backgroundColor,
            }}
            className={`px-3 flex-1 pt-20`}
          >
            <View
              className={`flex-1 ${
                isDimensionLayout
                  ? "flex-col justify-center items-center"
                  : "flex-row justify-start items-start"
              }`}
            >
              <FlatList
                data={items}
                showsVerticalScrollIndicator={false}
                decelerationRate="fast"
                scrollEventThrottle={1}
                keyExtractor={(item, index) => index.toString()}
                ListFooterComponent={<View style={{ paddingBottom: 24 }} />}
                renderItem={({ item, index }) => (
                  <View
                    key={index}
                    className={`${
                      isDimensionLayout ? "flex-col" : "flex-row"
                    } px-[10px]`}
                  >
                    <View className={`flex-col`}>
                      <View className={`relative`}>
                        <Image
                          source={{ uri: item?.image?.[0]?.url }}
                          resizeMode="cover"
                          style={{
                            height: windowHeight * 0.25,
                            width: windowWidth * 0.9,
                            borderRadius: 20,
                          }}
                        />
                        <TouchableOpacity onPress={() => handlePress(item)}>
                          <View className={`absolute left-[315px] bottom-2`}>
                            <Ionicons
                              name="add-circle-sharp"
                              size={50}
                              color={textColor}
                            />
                          </View>
                        </TouchableOpacity>
                      </View>
                      <View className={`flex-row pt-2`}>
                        <View className={`flex-col`}>
                          <Text
                            style={{ color: textColor }}
                            className={`text-base font-semibold`}
                          >
                            {item?.service_name} - {item?.product.product_name}
                          </Text>
                          <Text
                            style={{ color: textColor }}
                            className={`text-2xl font-semibold py-1`}
                          >
                            {item?.price}
                          </Text>
                        </View>
                        <View
                          className={`flex-1 flex-row justify-end items-start`}
                        >
                          <FontAwesome name="star" size={20} color="#f1c40f" />
                          <Text
                            style={{ color: textColor }}
                            className={`text-base font-semibold px-2`}
                          >
                            4.5
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              />
            </View>
          </View>
        </>
      )}
    </>
  );
}
