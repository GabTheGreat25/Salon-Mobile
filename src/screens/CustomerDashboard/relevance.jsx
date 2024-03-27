import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  SafeAreaView,
} from "react-native";
import { useDispatch } from "react-redux";
import { changeColor } from "@utils";
import { BackIcon } from "@helpers";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  useGetServicesQuery,
  useGetCommentsQuery,
  useGetExclusionsQuery,
} from "../../state/api/reducer";
import { LoadingScreen } from "@components";
import { appointmentSlice } from "../../state/appointment/appointmentReducer";
import { useSelector } from "react-redux";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function () {
  const auth = useSelector((state) => state.auth.user);

  const { textColor, backgroundColor, colorScheme } = changeColor();
  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation();
  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#212B36";
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

  const { data, isLoading } = useGetServicesQuery();

  const services = data?.details || [];

  const { data: commentsData, isLoading: commentsLoading } =
    useGetCommentsQuery();
  const comments = commentsData?.details || [];

  const allServices = services.map((service) => {
    const matchingComments = comments.filter((comment) =>
      comment.transaction?.appointment?.service.some(
        (s) => s._id === service._id
      )
    );

    const ratings = matchingComments.flatMap((comment) => comment.ratings);
    const count = ratings?.length;

    const averageRating =
      count > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / count : 0;

    return {
      ...service,
      ratings: averageRating,
    };
  });

  const { data: exclusionData, isLoading: exclusionLoading } =
    useGetExclusionsQuery();
  const exclusions = exclusionData?.details;

  const filteredExclusions = exclusions
    ?.filter(
      (exclusion) =>
        auth?.information?.allergy &&
        auth.information.allergy.includes(exclusion._id)
    )
    .flatMap((exclusion) => exclusion.ingredient_name.trim().toLowerCase());

  const newItems = allServices.filter((service) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();

    const hideMonthsJsProm = [0, 1, 4, 5, 6, 7, 8, 9, 10, 11];
    const hideMonthsGraduation = [0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11];

    const hideValentinesDay = currentMonth !== 1;
    const hideChristmas = currentMonth !== 11;
    const hideHalloween = currentMonth !== 9;
    const hideNewYear = currentMonth !== 0;
    const hideJsProm = hideMonthsJsProm.includes(currentMonth);
    const hideGraduation = hideMonthsGraduation.includes(currentMonth);

    const hasNewProduct = service?.product && Array.isArray(service.product);

    if (!hasNewProduct) return false;

    const isExcluded = service.product?.some((product) => {
      const productIngredients =
        product.ingredients?.toLowerCase().split(", ") || [];
      return filteredExclusions?.some((exclusion) =>
        productIngredients.includes(exclusion)
      );
    });

    return !(
      isExcluded ||
      (service.occassion === "Valentines" && hideValentinesDay) ||
      (service.occassion === "Christmas" && hideChristmas) ||
      (service.occassion === "Halloween" && hideHalloween) ||
      (service.occassion === "New Year" && hideNewYear) ||
      (service.occassion === "Js Prom" && hideJsProm) ||
      (service.occassion === "Graduation" && hideGraduation)
    );
  });

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

  const handleRelevance = () => {
    navigation.navigate("Relevance");
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
      {isLoading || commentsLoading || exclusionLoading ? (
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
          <SafeAreaView
            style={{
              backgroundColor,
            }}
            className={`px-3 flex-1 py-16`}
          >
            <View className={`justify-center items-center`}>
              <ScrollView
                decelerationRate="fast"
                scrollEventThrottle={1}
                horizontal
                showsHorizontalScrollIndicator={false}
                className={`mb-5`}
              >
                <View className={`flex-row gap-x-2`}>
                  <TouchableOpacity onPress={handleRelevance}>
                    <View
                      style={{
                        backgroundColor:
                          selectedOption === "Relevance"
                            ? "#FDA7DF"
                            : invertBackgroundColor,
                      }}
                      className={`rounded-2xl px-4 py-2`}
                    >
                      <Text
                        style={{
                          color:
                            selectedOption === "Relevance"
                              ? textColor
                              : invertTextColor,
                        }}
                      >
                        All Services
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handlePopular}>
                    <View
                      style={{
                        backgroundColor:
                          selectedOption === "Popular"
                            ? "#FDA7DF"
                            : invertBackgroundColor,
                      }}
                      className={`rounded-2xl px-4 py-2`}
                    >
                      <Text
                        style={{
                          color:
                            selectedOption === "Popular"
                              ? textColor
                              : invertTextColor,
                        }}
                      >
                        Popular
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleMostRecent}>
                    <View
                      style={{
                        backgroundColor:
                          selectedOption === "MostRecent"
                            ? "#FDA7DF"
                            : invertBackgroundColor,
                      }}
                      className={`rounded-2xl px-4 py-2`}
                    >
                      <Text
                        style={{
                          color:
                            selectedOption === "MostRecent"
                              ? textColor
                              : invertTextColor,
                        }}
                      >
                        Latest
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleBudget}>
                    <View
                      style={{
                        backgroundColor:
                          selectedOption === "Budget"
                            ? "#FDA7DF"
                            : invertBackgroundColor,
                      }}
                      className={`rounded-2xl px-4 py-2`}
                    >
                      <Text
                        style={{
                          color:
                            selectedOption === "Budget"
                              ? textColor
                              : invertTextColor,
                        }}
                      >
                        Budget
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </ScrollView>
              <FlatList
                data={newItems}
                showsVerticalScrollIndicator={false}
                decelerationRate="fast"
                scrollEventThrottle={1}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <View key={item._id} className={`flex-row px-[10px]`}>
                    <View className={`flex-col`}>
                      <TouchableOpacity
                        className={`relative`}
                        onPress={() =>
                          navigation.navigate("customerViewServiceById", {
                            id: item?._id,
                          })
                        }
                      >
                        <Image
                          key={
                            item.image[
                              Math.floor(Math.random() * item.image?.length)
                            ]?.public_id
                          }
                          source={{
                            uri: item.image[
                              Math.floor(Math.random() * item.image?.length)
                            ]?.url,
                          }}
                          resizeMode="cover"
                          style={{
                            height: windowHeight * 0.25,
                            width: windowWidth * 0.9,
                            borderRadius: 20,
                          }}
                        />
                        <TouchableOpacity onPress={handlePress}>
                          <View className={`absolute left-[315px] bottom-2`}>
                            <Ionicons
                              name="add-circle-sharp"
                              size={50}
                              color={textColor}
                            />
                          </View>
                        </TouchableOpacity>
                      </TouchableOpacity>
                      <View className={`flex-row pt-2`}>
                        <View className={`flex-col`}>
                          <Text
                            style={{ color: textColor }}
                            className={`text-xl font-semibold`}
                          >
                            {item?.service_name.length > 30
                              ? `${item?.service_name.substring(0, 30)}...`
                              : item?.service_name}
                          </Text>
                          <Text
                            style={{ color: textColor }}
                            className={`text-2xl font-semibold py-1`}
                          >
                            ₱{item?.price}
                          </Text>
                        </View>
                        <View
                          className={`flex-1 flex-row justify-end items-start`}
                        >
                          <Text
                            style={{ color: textColor }}
                            className={`text-2xl font-semibold px-2`}
                          >
                            {item?.ratings !== 0
                              ? item?.ratings.toFixed(1)
                              : "0"}
                          </Text>
                          <View className={`pt-1`}>
                            <FontAwesome
                              name="star"
                              size={25}
                              color={item?.ratings !== 0 ? "#f1c40f" : "gray"}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              />
            </View>
          </SafeAreaView>
        </>
      )}
    </>
  );
}
