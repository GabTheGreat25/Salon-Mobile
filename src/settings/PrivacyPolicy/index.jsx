import {
    View,
    Text,
    ScrollView
} from "react-native";

import { Feather, MaterialIcons, MaterialCommunityIcons,  FontAwesome5   } from "@expo/vector-icons";

import { changeColor, dimensionLayout } from "@utils";

export default function () {
    
    const { textColor, backgroundColor, shadowColor, colorScheme } =
    changeColor();
    
    const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#FDA7DF";
    const invertTextColor = colorScheme === "dark" ? "#212B36" : "#e5e5e5";

    return (
        <ScrollView
        className={`flex-1`}
        style={
            {
                backgroundColor
            }
        }
        >
            <View
            className={`flex-row items-center p-1.5`}
            >
                <FontAwesome5
                name="less-than"
                size={24}
                color={textColor} />
                <Text
                className={`m-1.5 text-xl`}
                style={
                    {
                        color: textColor
                    }
                }
                >
                    Privacy Policy
                </Text>
            </View>
            <View
            className={`justify-center rounded-md bg-white m-8 p-4`}
            style={
                {
                    backgroundColor: invertBackgroundColor
                }
            }
            >
                <Text
                className={`text-lg font-semibold text-center`}
                style={
                    {
                        color: invertTextColor
                    }
                }
                >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede.

                </Text>
            </View>
        </ScrollView>
    )
}