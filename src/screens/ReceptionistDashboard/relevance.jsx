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
import { changeColor } from "@utils";
import { BackIcon } from "@helpers";
import { FontAwesome, Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  useGetServicesQuery,
  useGetCommentsQuery,
  useGetExclusionsQuery,
} from "../../state/api/reducer";
import { LoadingScreen, Sidebar } from "@components";
import { appointmentSlice } from "../../state/appointment/appointmentReducer";
import { useSelector, useDispatch } from "react-redux";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function () {
  const customer = useSelector((state) => state.customer);

  const { textColor, backgroundColor, colorScheme } = changeColor();
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
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
        customer?.allergy && customer?.allergy.includes(exclusion._id)
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
        service_id: selectedProduct?._id || "",
        service_name: selectedProduct?.service_name || "",
        type: selectedProduct?.type || [],
        duration: selectedProduct?.duration || 0,
        description: selectedProduct?.description || "",
        product_name:
          selectedProduct?.product?.map((p) => p.product_name).join(", ") || "",
        price: selectedProduct?.price || 0,
        extraFee: selectedProduct?.extraFee || 0,
        image: selectedProduct?.image || [],
      })
    );
  };

  const [selectedOption, setSelectedOption] = useState("ReceptionistRelevance");

  useEffect(() => {
    if (route) {
      setSelectedOption(route.name);
    }
  }, [route]);

  const handleBack = () => {
    navigation.navigate("ReceptionistCustomer");
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [visibleFilteredItems, setVisibleFilteredItems] = useState([]);

  const handleApplyFilters = (filters) => {
    const filteredServices = allServices.filter((service) => {
      if (
        filters.searchInput &&
        !service.service_name
          .toLowerCase()
          .includes(filters.searchInput.toLowerCase())
      ) {
        return false;
      }

      const servicePrice = parseFloat(service.price);
      if (
        filters.priceRange &&
        ((filters.priceRange.min &&
          servicePrice < parseFloat(filters.priceRange.min)) ||
          (filters.priceRange.max &&
            servicePrice > parseFloat(filters.priceRange.max)))
      ) {
        return false;
      }

      if (
        filters.ratings &&
        filters.ratings > 0 &&
        service.ratings < parseFloat(filters.ratings)
      ) {
        return false;
      }

      if (filters.categories && Array.isArray(service.type)) {
        const filterCategories = filters.categories
          .split(",")
          .map((category) => category.trim().toLowerCase());

        const serviceTypes = service.type.map((type) =>
          type.trim().toLowerCase()
        );

        if (
          !filterCategories.includes("all") &&
          !filterCategories.includes("All") &&
          !serviceTypes.some((type) => filterCategories.includes(type))
        ) {
          return false;
        }
      }

      if (
        filters.occassion &&
        service.occassion &&
        service.occassion.trim().toLowerCase() !==
          filters.occassion.toLowerCase()
      ) {
        return false;
      }

      const isExcluded = service.product?.some((product) => {
        const productIngredients =
          product.ingredients?.toLowerCase().split(", ") || [];
        return filteredExclusions?.some((exclusion) =>
          productIngredients.includes(exclusion)
        );
      });

      return !isExcluded;
    });

    setIsFilterApplied(true);
    setVisibleFilteredItems(filteredServices);
  };

  const handleRelevance = () => {
    navigation.navigate("ReceptionistRelevance");
    setIsFilterApplied(false);
  };

  const handlePopular = () => {
    navigation.navigate("ReceptionistPopular");
    setIsFilterApplied(false);
  };

  const handleMostRecent = () => {
    navigation.navigate("ReceptionistMostRecent");
    setIsFilterApplied(false);
  };

  const handleBudget = () => {
    navigation.navigate("ReceptionistBudget");
    setIsFilterApplied(false);
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
          <SafeAreaView
            style={{
              backgroundColor,
            }}
            className={`relative px-3 flex-1 py-16`}
          >
            <BackIcon navigateBack={handleBack} textColor={textColor} />
            <View
              style={{ backgroundColor }}
              className={`absolute left-10 top-[14px]`}
            >
              <TouchableOpacity onPress={handleSidebarToggle}>
                <Feather name="menu" size={30} color={textColor} />
              </TouchableOpacity>
            </View>
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={handleSidebarClose}
              setFilters={handleApplyFilters}
            />
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
                          selectedOption === "ReceptionistRelevance"
                            ? "#FDA7DF"
                            : invertBackgroundColor,
                      }}
                      className={`rounded-full px-4 py-2`}
                    >
                      <Text
                        style={{
                          color:
                            selectedOption === "ReceptionistRelevance"
                              ? textColor
                              : invertTextColor,
                        }}
                        className={`text-base font-semibold`}
                      >
                        All Services
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handlePopular}>
                    <View
                      style={{
                        backgroundColor:
                          selectedOption === "ReceptionistPopular"
                            ? "#FDA7DF"
                            : invertBackgroundColor,
                      }}
                      className={`rounded-full px-4 py-2`}
                    >
                      <Text
                        style={{
                          color:
                            selectedOption === "ReceptionistPopular"
                              ? textColor
                              : invertTextColor,
                        }}
                        className={`text-base font-semibold`}
                      >
                        Popular
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleMostRecent}>
                    <View
                      style={{
                        backgroundColor:
                          selectedOption === "ReceptionistMostRecent"
                            ? "#FDA7DF"
                            : invertBackgroundColor,
                      }}
                      className={`rounded-full px-4 py-2`}
                    >
                      <Text
                        style={{
                          color:
                            selectedOption === "ReceptionistMostRecent"
                              ? textColor
                              : invertTextColor,
                        }}
                        className={`text-base font-semibold`}
                      >
                        Latest
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleBudget}>
                    <View
                      style={{
                        backgroundColor:
                          selectedOption === "ReceptionistBudget"
                            ? "#FDA7DF"
                            : invertBackgroundColor,
                      }}
                      className={`rounded-full px-4 py-2`}
                    >
                      <Text
                        style={{
                          color:
                            selectedOption === "ReceptionistBudget"
                              ? textColor
                              : invertTextColor,
                        }}
                        className={`text-base font-semibold`}
                      >
                        Budget
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </ScrollView>
              {isFilterApplied ? (
                <FlatList
                  data={visibleFilteredItems}
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
                            navigation.navigate(
                              "CustomerReceptionistViewServiceById",
                              {
                                id: item?._id,
                              }
                            )
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
                          <TouchableOpacity onPress={() => handlePress(item)}>
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
              ) : (
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
                            navigation.navigate(
                              "CustomerReceptionistViewServiceById",
                              {
                                id: item?._id,
                              }
                            )
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
                          <TouchableOpacity onPress={() => handlePress(item)}>
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
              )}
            </View>
          </SafeAreaView>
        </>
      )}
    </>
  );
}