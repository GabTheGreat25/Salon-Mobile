import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";

export default function ({
  title,
  description,
  buttonTitle,
  leftArrow,
  rightArrow,
  navigateLeft,
  navigateRight,
  navigateTo,
  logo,
  dimensionLayout,
}) {
  const commonContainerStyle = dimensionLayout
    ? styles.portraitContainer
    : styles.landscapeContainer;
  const commonGridStyle = dimensionLayout
    ? styles.portraitGrid
    : styles.landscapeGrid;
  const arrowRightPosition = dimensionLayout
    ? styles.portraitRightArrow
    : styles.landscapeRightArrow;
  const arrowLeftPosition = dimensionLayout ? "" : styles.landscapeLeftArrow;
  const textPosition = dimensionLayout
    ? styles.textPortraitContainer
    : styles.textLandscapeContainer;

  return (
    <>
      <View style={[styles.container, commonContainerStyle]}>
        <View style={commonGridStyle}>
          <View style={[styles.textContainer, textPosition]}>
            {leftArrow && (
              <TouchableOpacity
                style={[styles.arrowLeftContainer, arrowLeftPosition]}
                onPress={navigateLeft}
              >
                <Feather name="chevron-left" size={50} />
              </TouchableOpacity>
            )}
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
            <TouchableOpacity onPress={navigateTo}>
              <View style={styles.buttonContainer}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>{buttonTitle}</Text>
                </View>
              </View>
            </TouchableOpacity>
            {rightArrow && (
              <TouchableOpacity
                style={[styles.arrowRightContainer, arrowRightPosition]}
                onPress={navigateRight}
              >
                <Feather name="chevron-right" size={50} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.imageContainer}>
            {dimensionLayout ? (
              <Image source={logo} style={styles.logo} resizeMode="cover" />
            ) : (
              <ScrollView
                contentContainerStyle={styles.scrollContainer}
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                <Image
                  source={logo}
                  style={styles.landscapeLogo}
                  resizeMode="cover"
                />
              </ScrollView>
            )}
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  portraitContainer: {
    flexDirection: "column",
  },
  landscapeContainer: {
    flexDirection: "row",
  },
  portraitGrid: {
    flex: 1,
    flexDirection: "column",
  },
  landscapeGrid: {
    flex: 1,
    flexDirection: "row",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "start",
  },
  textPortraitContainer: {
    paddingLeft: 20,
  },
  textLandscapeContainer: {
    paddingLeft: 50,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 20,
    fontWeight: "300",
  },
  buttonContainer: {
    alignSelf: "flex-start",
    marginTop: 10,
    width: 150,
  },
  button: {
    borderRadius: 5,
    backgroundColor: "#F78FB3",
    padding: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: -1,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
  },
  landscapeLogo: {
    width: "100%",
    height: "100%",
  },
  arrowRightContainer: {
    position: "absolute",
    top: "85%",
  },
  portraitRightArrow: {
    left: "75%",
    transform: [{ translateX: 50 }],
  },
  landscapeRightArrow: {
    left: "160%",
    top: "45%",
    transform: [{ translateX: 100 }],
  },
  arrowLeftContainer: {
    position: "absolute",
    top: "85%",
  },
  landscapeLeftArrow: {
    top: "45%",
  },
});
