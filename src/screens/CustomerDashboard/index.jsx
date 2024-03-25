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
  Modal,
} from "react-native";
import ServicesOne from "@assets/servicesOne.png";
import ServicesTwo from "@assets/servicesTwo.png";
import ServicesThree from "@assets/servicesThree.png";
import ServicesFour from "@assets/servicesFour.png";
import MovingSale from "@assets/moving-sale.gif";
import { changeColor } from "@utils";
import { Feather, FontAwesome, Ionicons, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  useGetServicesQuery,
  useGetCommentsQuery,
  useGetExclusionsQuery,
} from "../../state/api/reducer";
import { LoadingScreen } from "@components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function () {
  const { textColor, backgroundColor, shadowColor, colorScheme } =
    changeColor();
  const navigation = useNavigation();
  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#212B36";
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

  const handlePress = () => {
    navigation.navigate("Relevance");
  };

  const { data, isLoading } = useGetServicesQuery();

  const services = data?.details || [];

  const { data: commentsData, isLoading: commentsLoading } =
    useGetCommentsQuery();
  const comments = commentsData?.details || [];

  const allServices = services.map((service) => {
    const matchingComments = comments.filter((comment) =>
      comment.transaction?.appointment?.service?.some(
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

  const auth = useSelector((state) => state.auth.user);

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

    const hasNewProduct =
      service.product &&
      service.product.length === 1 &&
      service.product.some((product) => product.isNew === true);

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

  const bundleItems = allServices.filter((service) => {
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

    const hasNewBundle =
      service.product &&
      service.product.length > 1 &&
      service.product?.some((product) => product.isNew === true);

    if (!hasNewBundle) return false;

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

  const latestService = services
    ?.filter((service) => service?.created_at)
    ?.sort((a, b) => new Date(b?.created_at) - new Date(a?.created_at))[0];

  const [showModal, setShowModal] = useState(false);
  const [modalShown, setModalShown] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const getModalShownFromStorage = async () => {
      try {
        const isModalShownFromStorage = await AsyncStorage.getItem(
          "modalShown"
        );
        if (!modalShown && !isModalShownFromStorage) {
          setShowModal(true);
          setModalShown(true);
          await AsyncStorage.setItem("modalShown", "true");
          setTimeout(() => {
            setShowModal(false);
          }, 10000);
        }
      } catch (error) {
        console.error(
          "Error retrieving or setting modalShown from AsyncStorage:",
          error
        );
      }
    };

    getModalShownFromStorage();
  }, [modalShown]);

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
            className={`flex-1`}
          >
            <Modal
              visible={showModal}
              animationType="slide"
              transparent={true}
              onRequestClose={handleCloseModal}
            >
              <View
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
                className={`flex-1 justify-center items-center`}
              >
                <View
                  key={latestService?._id}
                  style={{
                    backgroundColor: "#FDA7DF",
                    width: "85%",
                  }}
                  className={`rounded-lg p-5 items-center justify-center`}
                >
                  <TouchableOpacity
                    style={{ position: "absolute", top: 20, right: 20 }}
                    onPress={handleCloseModal}
                  >
                    <AntDesign
                      name="closecircleo"
                      size={30}
                      color={textColor}
                    />
                  </TouchableOpacity>

                  <View>
                    <View className={`items-center justify-center pb-2 mt-12`}>
                      <Image
                        source={MovingSale}
                        style={{
                          width: 300,
                          height: 100,
                        }}
                      />
                    </View>
                    <View
                      className={`flex-row flex-wrap items-center justify-center gap-x-2`}
                    >
                      <View className={`justify-center items-center flex-col`}>
                        <Text
                          style={{ color: textColor }}
                          className={`text-2xl font-semibold text-center pb-2`}
                        >
                          Monthly Promo
                        </Text>
                        <Text
                          style={{ color: textColor }}
                          className={`text-base text-justify pb-2 font-semibold`}
                        >
                          Enjoy our exclusive monthly promotion at Lhanlee
                          Salon. Avail our special offersand packages just for
                          you. Come and check this service{" "}
                          {latestService?.service_name} now!
                        </Text>
                        <Text
                          style={{ color: textColor }}
                          className={`text-base text-justify pb-2 font-semibold`}
                        >
                          Terms and Conditions apply. Book your appointment now!
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("customerViewServiceById", {
                              id: latestService._id,
                            })
                          }
                          style={{
                            backgroundColor: invertBackgroundColor,
                          }}
                          className={`rounded-lg py-2 px-4 mt-2`}
                        >
                          <Text
                            style={{ color: invertTextColor }}
                            className={`text-lg font-semibold`}
                          >
                            Check it out!
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </Modal>
            <ScrollView
              showsVerticalScrollIndicator={false}
              decelerationRate="fast"
              scrollEventThrottle={1}
            >
              <View className={`flex-row justify-center items-center pt-5`}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Relevance")}
                  style={{
                    shadowColor,
                    height: windowHeight * 0.23,
                    width: windowWidth * 0.45,
                  }}
                  className={`rounded flex-col shadow-2xl mx-1 bg-primary-default`}
                >
                  <View className={`justify-start items-start h-1/2 pt-5 px-4`}>
                    <Text
                      style={{ color: textColor }}
                      className={`flex-1 text-lg p-1 font-semibold`}
                    >
                      {`Pick our\nbest offers!`}
                    </Text>
                  </View>
                  <View className={`justify-end items-center h-1/2`}>
                    <Image
                      source={ServicesOne}
                      resizeMode={"cover"}
                      className={`h-full w-full`}
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate("Budget")}
                  style={{
                    shadowColor,
                    height: windowHeight * 0.23,
                    width: windowWidth * 0.45,
                  }}
                  className={`rounded flex-col shadow-2xl mx-1 bg-primary-default`}
                >
                  <View className={`justify-end items-center h-1/2`}>
                    <Image
                      source={ServicesFour}
                      resizeMode={"cover"}
                      className={`h-full w-full`}
                    />
                  </View>
                  <View className={`justify-center items-center h-1/2 pt-5`}>
                    <Text
                      style={{ color: textColor }}
                      className={`flex-1 text-lg p-1 font-semibold`}
                    >
                      Check Our Budget Friendly Offers!
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View className={`flex-row justify-center items-center py-2`}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("MostRecent")}
                  style={{
                    shadowColor,
                    height: windowHeight * 0.12,
                    width: windowWidth * 0.454,
                  }}
                  className={`rounded flex-row shadow-2xl mx-1 bg-primary-default`}
                >
                  <View className={`flex-1`}>
                    <Image
                      source={ServicesThree}
                      resizeMode="stretch"
                      className={`h-full w-full`}
                    />
                  </View>
                  <View className={`justify-start items-start`}>
                    <Text
                      style={{ color: textColor }}
                      className={`text-base py-4 px-2  font-semibold`}
                    >
                      {`Check Our\nLatest Trends`}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Popular")}
                  style={{
                    shadowColor,
                    height: windowHeight * 0.12,
                    width: windowWidth * 0.454,
                  }}
                  className={`rounded flex-row shadow-2xl mx-1 bg-primary-default`}
                >
                  <View className={`justify-start items-start`}>
                    <Text
                      style={{ color: textColor }}
                      className={`text-base py-4 px-2 font-semibold`}
                    >
                      {`Check Our\nMost Popular`}
                    </Text>
                  </View>
                  <View className={`flex-1`}>
                    <Image
                      source={ServicesTwo}
                      resizeMode="stretch"
                      className={`h-full w-full`}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              <View className={`flex-row px-4`}>
                <Text
                  style={{ color: textColor }}
                  className={`text-lg font-semibold p-2`}
                >
                  New Services
                </Text>
                <TouchableOpacity onPress={handlePress} className={`flex-1`}>
                  <View className={`flex-row justify-end items-center`}>
                    <Text
                      style={{ color: textColor }}
                      className={`text-lg font-semibold p-2`}
                    >
                      View All
                    </Text>
                    <Feather name="chevron-right" size={20} color={textColor} />
                  </View>
                </TouchableOpacity>
              </View>

              <FlatList
                data={newItems}
                horizontal
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                scrollEventThrottle={1}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <View key={item._id} className={`flex-row px-[22px]`}>
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

              <View className={`flex-row px-4`}>
                <Text
                  style={{ color: textColor }}
                  className={`text-lg font-semibold p-2`}
                >
                  Bundle Services
                </Text>
                <TouchableOpacity onPress={handlePress} className={`flex-1`}>
                  <View className={`flex-row justify-end items-center`}>
                    <Text
                      style={{ color: textColor }}
                      className={`text-lg font-semibold p-2`}
                    >
                      View All
                    </Text>
                    <Feather name="chevron-right" size={20} color={textColor} />
                  </View>
                </TouchableOpacity>
              </View>

              <FlatList
                data={bundleItems}
                horizontal
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                scrollEventThrottle={1}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <View key={item._id} className={`flex-row px-[22px]`}>
                    <View className={`flex-col`}>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("customerViewServiceById", {
                            id: item?._id,
                          })
                        }
                        className={`relative`}
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
            </ScrollView>
          </SafeAreaView>
        </>
      )}
    </>
  );
}
