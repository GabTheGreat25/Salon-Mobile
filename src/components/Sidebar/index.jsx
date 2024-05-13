import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  ScrollView,
} from "react-native";
import { changeColor } from "@utils";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import Toast from "react-native-toast-message";

const { width: deviceWidth } = Dimensions.get("window");

export default function ({ isOpen, onClose, setFilters }) {
  const customWidth = deviceWidth * 0.75;
  const { textColor, backgroundColor, borderColor, colorScheme } =
    changeColor();
  const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#212B36";
  const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

  const [open, setOpen] = useState(isOpen);

  const handleToggle = () => {
    setOpen(!open);
    onClose();
  };

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (!open) return;
  }, [open]);

  const [searchInput, setSearchInput] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedRatings, setSelectedRatings] = useState(0);
  const [selectedOccasion, setSelectedOccasion] = useState("");

  const [disableValentinesDay, setDisableValentinesDay] = useState(false);
  const [disableChristmas, setDisableChristmas] = useState(false);
  const [disableHalloween, setDisableHalloween] = useState(false);
  const [disableNewYear, setDisableNewYear] = useState(false);
  const [disableJsProm, setDisableJsProm] = useState(false);
  const [disableGraduation, setDisableGraduation] = useState(false);

  const handleCategoryChange = (category) => {
    if (category === "All") {
      setSelectedCategories((prevCategories) => {
        if (prevCategories.includes("All")) {
          return [];
        } else {
          return ["All", "Hands", "Hair", "Feet", "Facial", "Body", "Eyelash"];
        }
      });
    } else {
      setSelectedCategories((prevCategories) => {
        if (prevCategories.includes("All")) {
          return prevCategories.filter(
            (item) => item !== category && item !== "All"
          );
        } else {
          const index = prevCategories.indexOf(category);
          if (index !== -1) {
            return prevCategories.filter(
              (item) => item !== category && item !== "All"
            );
          } else {
            return [...prevCategories, category];
          }
        }
      });
    }
  };

  useEffect(() => {
    const currentDate = new Date();
    // Uncomment the line below to test the disableMonths
    //! currentDate.setMonth(currentDate.getMonth() + 1);

    const currentMonth = currentDate.getMonth();
    const disableMonthsJsProm = [0, 1, 4, 5, 6, 7, 8, 9, 10, 11];
    const disableMonthsGraduation = [0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11];

    setDisableValentinesDay(currentMonth !== 1);
    setDisableChristmas(currentMonth !== 11);
    setDisableHalloween(currentMonth !== 9);
    setDisableNewYear(currentMonth !== 0);
    setDisableJsProm(disableMonthsJsProm.includes(currentMonth));
    setDisableGraduation(disableMonthsGraduation.includes(currentMonth));
  }, []);

  const handleOccasionChange = (occasion) => {
    setSelectedOccasion((prevOccasion) => {
      return prevOccasion === occasion ? "" : occasion;
    });
  };

  const handleApplyFilters = () => {
    const parsedMinPrice = parseInt(minPrice);
    const parsedMaxPrice = parseInt(maxPrice);

    if (
      (minPrice !== "" && isNaN(parsedMinPrice)) ||
      (maxPrice !== "" && isNaN(parsedMaxPrice)) ||
      (minPrice !== "" && maxPrice !== "" && parsedMinPrice >= parsedMaxPrice)
    ) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Warning",
        text2:
          "Invalid price range. Please make sure to provide valid minimum and maximum prices, and ensure that the minimum is lower than the maximum.",
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }

    const filters = {
      categories: selectedCategories.join(","),
      priceRange: { min: minPrice, max: maxPrice },
      ratings: selectedRatings,
      searchInput: searchInput.trim(),
      occassion: selectedOccasion,
    };

    setFilters(filters);
    setOpen(!open);
    onClose();
    setSearchInput("");
    setSelectedCategories([]);
    setMinPrice("");
    setMaxPrice("");
    setSelectedRatings(0);
    setSelectedOccasion("");
  };

  if (!open) return null;

  return (
    <>
      <View className={`absolute top-0 bottom-0 right-0 left-0 z-[9999]`}>
        <TouchableOpacity
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          className={`flex-1`}
          onPress={handleToggle}
        />
        <Animatable.View
          animation="bounceInLeft"
          duration={1500}
          style={{ width: customWidth, backgroundColor }}
          className={`absolute top-0 left-0 bottom-0 p-5`}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            decelerationRate="fast"
            scrollEventThrottle={1}
            className={`flex-1`}
          >
            <View className={`self-end`}>
              <TouchableOpacity onPress={handleToggle}>
                <MaterialIcons name="close" size={30} color={textColor} />
              </TouchableOpacity>
            </View>
            <View className={`flex-row items-center p-2`}>
              <View
                style={{
                  borderColor,
                }}
                className={`rounded-tl-lg rounded-bl-lg bg-primary-default p-1 border-[1px]`}
              >
                <TouchableOpacity onPress={handleApplyFilters}>
                  <MaterialIcons name="search" size={30} color={textColor} />
                </TouchableOpacity>
              </View>
              <TextInput
                style={{
                  color: textColor,
                  borderColor,
                  backgroundColor,
                }}
                className={`rounded-tr-lg rounded-br-lg text-lg font-bold p-[5px] border-[1px] flex-1`}
                placeholder="Search"
                placeholderTextColor={textColor}
                value={searchInput}
                onChangeText={setSearchInput}
              />
            </View>
            <Text
              style={{
                color: textColor,
              }}
              className={`text-xl font-semibold px-2 py-1`}
            >
              Categories
            </Text>
            <View className={`items-center justify-center py-2`}>
              <View className={`flex-row flex-wrap gap-3 ml-[.5px]`}>
                {[
                  "All",
                  "Hands",
                  "Hair",
                  "Feet",
                  "Facial",
                  "Body",
                  "Eyelash",
                ].map((category) => (
                  <TouchableOpacity
                    key={category}
                    onPress={() => {
                      handleCategoryChange(category);
                    }}
                  >
                    <View
                      className={`flex-row flex-wrap justify-center items-center gap-x-1`}
                    >
                      <View
                        style={{
                          height: 30,
                          width: 30,
                          borderColor,
                          backgroundColor,
                        }}
                        className={`border-2 rounded mr-2`}
                      >
                        {selectedCategories.includes(category) && (
                          <Text
                            style={{ color: textColor }}
                            className={`text-xl pl-[6px]`}
                          >
                            ✓
                          </Text>
                        )}
                      </View>
                      <Text
                        style={{ color: textColor }}
                        className={`text-xl font-semibold`}
                      >
                        {category}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <Text
              style={{
                color: textColor,
              }}
              className={`text-xl font-semibold px-2 py-1`}
            >
              Occasions
            </Text>
            <View className={`flex-row flex-wrap`}>
              <View className={`flex-row`}>
                <TouchableOpacity
                  className={`flex-row pl-2 py-2`}
                  onPress={() => handleOccasionChange("Wedding")}
                >
                  <View
                    style={{
                      height: 30,
                      width: 30,
                      borderColor,
                      backgroundColor,
                    }}
                    className={`flex-row justify-center items-center border-2 rounded mr-2`}
                  >
                    {selectedOccasion === "Wedding" && (
                      <Text style={{ color: textColor }} className={`text-xl`}>
                        ✓
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
                <View className={`flex-row justify-center items-start`}>
                  <View className={`pt-2`}>
                    <Text
                      style={{ color: textColor }}
                      className={`text-xl font-semibold`}
                    >
                      Wedding
                    </Text>
                  </View>
                </View>
              </View>

              <View className={`flex-row`}>
                <TouchableOpacity
                  className={`flex-row pl-2 py-2`}
                  onPress={() => handleOccasionChange("Birthday")}
                >
                  <View
                    style={{
                      height: 30,
                      width: 30,
                      borderColor,
                      backgroundColor,
                    }}
                    className={`flex-row justify-center items-center border-2 rounded mr-2`}
                  >
                    {selectedOccasion === "Birthday" && (
                      <Text style={{ color: textColor }} className={`text-xl`}>
                        ✓
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
                <View className={`flex-row justify-center items-start`}>
                  <View className={`pt-2`}>
                    <Text
                      style={{ color: textColor }}
                      className={`text-xl font-semibold`}
                    >
                      Birthday
                    </Text>
                  </View>
                </View>
              </View>

              <View className={`flex-row`}>
                <TouchableOpacity
                  style={{ opacity: disableGraduation ? 0.5 : 1 }}
                  className={`flex-row pl-2 py-2`}
                  onPress={() => handleOccasionChange("Graduation")}
                  disabled={disableGraduation}
                >
                  <View
                    style={{
                      height: 30,
                      width: 30,
                      borderColor,
                      backgroundColor,
                      opacity: disableGraduation ? 0.5 : 1,
                    }}
                    className={`flex-row justify-center items-center border-2 rounded mr-2`}
                  >
                    {selectedOccasion === "Graduation" && (
                      <Text
                        style={{
                          color: textColor,
                        }}
                        className={`text-xl`}
                      >
                        ✓
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
                <View className={`flex-row justify-center items-start`}>
                  <View className={`pt-2`}>
                    <Text
                      style={{
                        color: textColor,
                        opacity: disableGraduation ? 0.5 : 1,
                      }}
                      className={`text-xl font-semibold`}
                    >
                      Graduation
                    </Text>
                  </View>
                </View>
              </View>

              <View className={`flex-row`}>
                <TouchableOpacity
                  style={{ opacity: disableJsProm ? 0.5 : 1 }}
                  className={`flex-row pl-2 py-2`}
                  onPress={() => handleOccasionChange("Js Prom")}
                  disabled={disableJsProm}
                >
                  <View
                    style={{
                      height: 30,
                      width: 30,
                      borderColor,
                      backgroundColor,
                      opacity: disableJsProm ? 0.5 : 1,
                    }}
                    className={`flex-row justify-center items-center border-2 rounded mr-2`}
                  >
                    {selectedOccasion === "Js Prom" && (
                      <Text
                        style={{
                          color: textColor,
                        }}
                        className={`text-xl`}
                      >
                        ✓
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
                <View className={`flex-row justify-center items-start`}>
                  <View className={`pt-2`}>
                    <Text
                      style={{
                        color: textColor,
                        opacity: disableJsProm ? 0.5 : 1,
                      }}
                      className={`text-xl font-semibold`}
                    >
                      Js Prom
                    </Text>
                  </View>
                </View>
              </View>

              <View className={`flex-row`}>
                <TouchableOpacity
                  style={{ opacity: disableHalloween ? 0.5 : 1 }}
                  className={`flex-row pl-2 py-2`}
                  onPress={() => handleOccasionChange("Halloween")}
                  disabled={disableHalloween}
                >
                  <View
                    style={{
                      height: 30,
                      width: 30,
                      borderColor,
                      backgroundColor,
                      opacity: disableHalloween ? 0.5 : 1,
                    }}
                    className={`flex-row justify-center items-center border-2 rounded mr-2`}
                  >
                    {selectedOccasion === "Halloween" && (
                      <Text
                        style={{
                          color: textColor,
                        }}
                        className={`text-xl`}
                      >
                        ✓
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
                <View className={`flex-row justify-center items-start`}>
                  <View className={`pt-2`}>
                    <Text
                      style={{
                        color: textColor,
                        opacity: disableHalloween ? 0.5 : 1,
                      }}
                      className={`text-xl font-semibold`}
                    >
                      Halloween
                    </Text>
                  </View>
                </View>
              </View>

              <View className={`flex-row`}>
                <TouchableOpacity
                  style={{ opacity: disableChristmas ? 0.5 : 1 }}
                  className={`flex-row pl-2 py-2`}
                  onPress={() => handleOccasionChange("Christmas")}
                  disabled={disableChristmas}
                >
                  <View
                    style={{
                      height: 30,
                      width: 30,
                      borderColor,
                      backgroundColor,
                      opacity: disableChristmas ? 0.5 : 1,
                    }}
                    className={`flex-row justify-center items-center border-2 rounded mr-2`}
                  >
                    {selectedOccasion === "Christmas" && (
                      <Text
                        style={{
                          color: textColor,
                        }}
                        className={`text-xl`}
                      >
                        ✓
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
                <View className={`flex-row justify-center items-start`}>
                  <View className={`pt-2`}>
                    <Text
                      style={{
                        color: textColor,
                        opacity: disableChristmas ? 0.5 : 1,
                      }}
                      className={`text-xl font-semibold`}
                    >
                      Christmas
                    </Text>
                  </View>
                </View>
              </View>

              <View className={`flex-row`}>
                <TouchableOpacity
                  style={{ opacity: disableValentinesDay ? 0.5 : 1 }}
                  className={`flex-row pl-2 py-2`}
                  onPress={() => handleOccasionChange("Valentines")}
                  disabled={disableValentinesDay}
                >
                  <View
                    style={{
                      height: 30,
                      width: 30,
                      borderColor,
                      backgroundColor,
                      opacity: disableValentinesDay ? 0.5 : 1,
                    }}
                    className={`flex-row justify-center items-center border-2 rounded mr-2`}
                  >
                    {selectedOccasion === "Valentines" && (
                      <Text
                        style={{
                          color: textColor,
                        }}
                        className={`text-xl`}
                      >
                        ✓
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
                <View className={`flex-row justify-center items-start`}>
                  <View className={`pt-2`}>
                    <Text
                      style={{
                        color: textColor,
                        opacity: disableValentinesDay ? 0.5 : 1,
                      }}
                      className={`text-xl font-semibold`}
                    >
                      Valentines
                    </Text>
                  </View>
                </View>
              </View>

              <View className={`flex-row`}>
                <TouchableOpacity
                  style={{ opacity: disableNewYear ? 0.5 : 1 }}
                  className={`flex-row pl-2 py-2`}
                  onPress={() => handleOccasionChange("New Year")}
                  disabled={disableNewYear}
                >
                  <View
                    style={{
                      height: 30,
                      width: 30,
                      borderColor,
                      backgroundColor,
                      opacity: disableNewYear ? 0.5 : 1,
                    }}
                    className={`flex-row justify-center items-center border-2 rounded mr-2`}
                  >
                    {selectedOccasion === "New Year" && (
                      <Text
                        style={{
                          color: textColor,
                        }}
                        className={`text-xl`}
                      >
                        ✓
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
                <View className={`flex-row justify-center items-start`}>
                  <View className={`pt-2`}>
                    <Text
                      style={{
                        color: textColor,
                        opacity: disableNewYear ? 0.5 : 1,
                      }}
                      className={`text-xl font-semibold`}
                    >
                      New Year
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <Text
              style={{
                color: textColor,
              }}
              className={`text-xl font-semibold px-2 py-1`}
            >
              Price Range
            </Text>
            <View className={`flex-row flex-wrap py-2`}>
              <View className={`flex-row items-center justify-center gap-2`}>
                <Text
                  style={{ color: textColor }}
                  className={`text-xl font-semibold`}
                >
                  ₱
                </Text>
                <TextInput
                  placeholder="Min"
                  placeholderTextColor={textColor}
                  keyboardType="numeric"
                  onChangeText={(value) => setMinPrice(value)}
                  value={minPrice}
                  style={{
                    borderColor,
                    width: deviceWidth * 0.2,
                  }}
                  className={`p-2 border-[1px] rounded-lg text-lg font-semibold`}
                />
              </View>
              <View className={`items-center justify-center px-2`}>
                <Feather name="minus" size={30} color="black" />
              </View>
              <View className={`flex-row items-center justify-center gap-2`}>
                <Text
                  style={{ color: textColor }}
                  className={`text-xl font-semibold`}
                >
                  ₱
                </Text>
                <TextInput
                  placeholder="Max"
                  placeholderTextColor={textColor}
                  keyboardType="numeric"
                  onChangeText={(value) => setMaxPrice(value)}
                  value={maxPrice}
                  style={{
                    borderColor,
                    width: deviceWidth * 0.2,
                  }}
                  className={`p-2 border-[1px] rounded-lg text-lg font-semibold`}
                />
              </View>
            </View>
            <Text
              style={{
                color: textColor,
              }}
              className={`text-xl font-semibold px-2 py-1`}
            >
              Ratings
            </Text>
            <View className={`flex-col pt-2 pb-1`}>
              {[5, 4, 3, 2, 1].map((rating) => (
                <TouchableOpacity
                  key={rating}
                  className={`flex-row items-center py-1`}
                  onPress={() => setSelectedRatings(rating)}
                >
                  {[...Array(rating)].map((_, index) => (
                    <Feather
                      key={index}
                      name="star"
                      size={deviceWidth * 0.1}
                      color={selectedRatings === rating ? "#fec957" : textColor}
                    />
                  ))}
                  {rating < 5 && (
                    <Text
                      style={{
                        color: textColor,
                      }}
                      className={`pl-1 text-2xl font-semibold`}
                    >
                      Above
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
            <View className={`items-center justify-center`}>
              <TouchableOpacity
                onPress={handleApplyFilters}
                style={{ backgroundColor: invertBackgroundColor }}
                className={`px-6 py-2 rounded-lg`}
              >
                <Text
                  style={{ color: invertTextColor }}
                  className={`text-lg font-semibold`}
                >
                  Apply Filters
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animatable.View>
      </View>
    </>
  );
}
