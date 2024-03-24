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
import Salon from "@assets/salon-bg.png";
import SalonService from "@assets/salon-service.png";
import SalonHair from "@assets/salon-hair.png";
import SalonFootSpa from "@assets/foot-spa.png";
import SalonLipstick from "@assets/lipstick.png";
import MovingSale from "@assets/moving-sale.gif";
import { changeColor, dimensionLayout } from "@utils";
import { Feather, FontAwesome, Ionicons, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useGetServicesQuery } from "../../state/api/reducer";
import { LoadingScreen } from "@components";
import AsyncStorage from "@react-native-async-storage/async-storage";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function () {
  const { textColor, backgroundColor, shadowColor, colorScheme } =
    changeColor();
  const navigation = useNavigation();
  const isDimensionLayout = dimensionLayout();
  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#212B36";
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

  const handlePress = () => {
    navigation.navigate("Relevance");
  };

  const { data, isLoading } = useGetServicesQuery();

  const widthOne = isDimensionLayout ? windowWidth * 0.35 : windowWidth * 0.75;
  const widthTwo = isDimensionLayout ? windowWidth * 0.25 : windowWidth * 0.55;
  const widthThree = isDimensionLayout
    ? windowWidth * 0.436
    : windowWidth * 0.9536;
  const FootSpa = isDimensionLayout ? `Organic\nFoot Spa` : "Organic Foot Spa";
  const HairSpa = isDimensionLayout ? `Hair\nStyles` : "Hair Styles";

  const items = data?.details || [];

  const latestService = items
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
      {isLoading ? (
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
                            navigate(`/customer/service/${latestService?._id}`)
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
                <View
                  style={{
                    shadowColor,
                    backgroundColor: invertBackgroundColor,
                    height: windowHeight * 0.2,
                    width: widthOne,
                  }}
                  className={`rounded flex-col shadow-2xl ${
                    isDimensionLayout ? "mx-1" : "mx-3"
                  }`}
                >
                  <View className={`justify-end items-center h-1/2 pt-5`}>
                    <Text
                      style={{ color: invertTextColor }}
                      className={`flex-1 ${
                        isDimensionLayout ? "text-base" : "text-2xl"
                      } p-1 font-semibold`}
                    >
                      Pick our best offers!
                    </Text>
                  </View>
                  <View className={`justify-end items-center h-1/2`}>
                    <Image
                      source={Salon}
                      resizeMode={isDimensionLayout ? "cover" : "stretch"}
                      className={`h-full w-full`}
                    />
                  </View>
                </View>

                <View
                  style={{
                    shadowColor,
                    backgroundColor: invertBackgroundColor,
                    height: windowHeight * 0.2,
                    width: widthTwo,
                  }}
                  className={`rounded flex-col shadow-2xl ${
                    isDimensionLayout ? "mx-1" : "mx-3"
                  }`}
                >
                  <View className={`justify-end items-center h-1/2`}>
                    <Image
                      source={SalonService}
                      resizeMode={isDimensionLayout ? "cover" : "stretch"}
                      className={`h-full w-full`}
                    />
                  </View>
                  <View className={`justify-end items-center h-1/2`}>
                    <Text
                      style={{ color: invertTextColor }}
                      className={`flex-1 ${
                        isDimensionLayout ? "text-base" : "text-2xl"
                      } p-[7.25px] font-semibold`}
                    >
                      High Quality Services
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    shadowColor,
                    backgroundColor: invertBackgroundColor,
                    height: windowHeight * 0.2,
                    width: widthTwo,
                  }}
                  className={`rounded flex-col shadow-2xl ${
                    isDimensionLayout ? "mx-1" : "mx-3"
                  }`}
                >
                  <View
                    className={`justify-end items-center h-1/2 ${
                      isDimensionLayout ? "pt-5" : "pt-2"
                    }`}
                  >
                    <Text
                      style={{ color: invertTextColor }}
                      className={`flex-1 ${
                        isDimensionLayout ? "text-base" : "text-2xl py-5"
                      } font-semibold`}
                    >
                      {HairSpa}
                    </Text>
                  </View>
                  <View className={`justify-end items-center h-1/2`}>
                    <Image
                      source={SalonHair}
                      resizeMode={isDimensionLayout ? "cover" : "stretch"}
                      className={`h-full w-full`}
                    />
                  </View>
                </View>
              </View>

              <View className={`flex-row justify-center items-center py-2`}>
                <View
                  style={{
                    shadowColor,
                    backgroundColor: invertBackgroundColor,
                    height: windowHeight * 0.1,
                    width: widthThree,
                  }}
                  className={`rounded flex-row shadow-2xl ${
                    isDimensionLayout ? "mx-1" : "mx-3"
                  }`}
                >
                  <View className={`flex-1`}>
                    <Image
                      source={SalonFootSpa}
                      resizeMode={isDimensionLayout ? "cover" : "stretch"}
                      className={`h-full w-full`}
                    />
                  </View>
                  <View className={`justify-end items-center`}>
                    <Text
                      style={{ color: invertTextColor }}
                      className={`flex-1 ${
                        isDimensionLayout
                          ? "text-base p-4"
                          : "text-lg px-4 py-6"
                      } font-semibold`}
                    >
                      {FootSpa}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    shadowColor,
                    backgroundColor: invertBackgroundColor,
                    height: windowHeight * 0.1,
                    width: widthThree,
                  }}
                  className={`rounded flex-row shadow-2xl ${
                    isDimensionLayout ? "mx-1" : "mx-3"
                  }`}
                >
                  <View className={`justify-end items-center`}>
                    <Text
                      style={{ color: invertTextColor }}
                      className={`flex-1 ${
                        isDimensionLayout
                          ? "text-base pl-2 pr-1 py-4"
                          : "text-lg px-4 py-6"
                      } font-semibold`}
                    >
                      Choose Your Beautician
                    </Text>
                  </View>
                  <View className={`flex-1`}>
                    <Image
                      source={SalonLipstick}
                      resizeMode={isDimensionLayout ? "cover" : "stretch"}
                      className={`h-full w-full`}
                    />
                  </View>
                </View>
              </View>

              <View className={`flex-row px-4`}>
                <Text
                  style={{ color: textColor }}
                  className={`text-base font-semibold p-2`}
                >
                  Limited offers
                </Text>
                <TouchableOpacity onPress={handlePress} className={`flex-1`}>
                  <View className={`flex-row justify-end items-center`}>
                    <Text
                      style={{ color: textColor }}
                      className={`text-base font-semibold p-2`}
                    >
                      View All
                    </Text>
                    <Feather name="chevron-right" size={20} color={textColor} />
                  </View>
                </TouchableOpacity>
              </View>

              <FlatList
                data={items}
                horizontal
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                scrollEventThrottle={1}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <View key={index} className={`flex-row px-[22px]`}>
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
                        <TouchableOpacity onPress={handlePress}>
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
                            {item?.service_name}
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
              <View className={`flex-row px-4`}>
                <Text
                  style={{ color: textColor }}
                  className={`text-base font-semibold p-2`}
                >
                  Best offers
                </Text>
                <TouchableOpacity onPress={handlePress} className={`flex-1`}>
                  <View className={`flex-row justify-end items-center`}>
                    <Text
                      style={{ color: textColor }}
                      className={`text-base font-semibold p-2`}
                    >
                      View All
                    </Text>
                    <Feather name="chevron-right" size={20} color={textColor} />
                  </View>
                </TouchableOpacity>
              </View>

              <FlatList
                data={items.slice().reverse()}
                horizontal
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                scrollEventThrottle={1}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <View key={index} className={`flex-row px-[22px]`}>
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
                        <TouchableOpacity onPress={handlePress}>
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
                            {item?.service_name}
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
            </ScrollView>
          </SafeAreaView>
        </>
      )}
    </>
  );
}
