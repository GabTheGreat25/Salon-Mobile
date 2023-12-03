import {
    View,
    Text,
    TextInput,
    ScrollView,
    Button,
    TouchableOpacity
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
                    Feedback
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
                className={`mb-3 text-lg font-semibold`}
                style={
                    {
                        color: invertTextColor
                    }
                }
                >
                    Let's Talk!
                </Text>
                <Text
                className={`text-sm font-semibold mb-2`}
                style={
                    {
                        color: invertTextColor
                    }
                }
                >
                    Full name
                </Text>
                <TextInput
                className={`h-8 border-1 border-black bg-gray-100 mb-4 p-2 rounded`}
                placeholder="Your name"
                />
                 <Text
                className={`text-sm font-semibold mb-2`}
                style={
                    {
                        color: invertTextColor
                    }
                }
                >
                    Email address:
                </Text>
                <TextInput
                className={`h-8 border-1 border-black bg-gray-100 mb-4 p-2 rounded`}
                placeholder="Your email address"
                />
                 <Text
                className={`text-sm font-semibold mb-2`}
                style={
                    {
                        color: invertTextColor
                    }
                }
                >
                    Mobile Number
                </Text>
                <TextInput
                className={`h-8 border-1 border-black bg-gray-100 mb-4 p-2 rounded`}
                placeholder="09XXXXXXXX"
                />
                <Text
                className={`text-sm font-semibold mb-2`}
                style={
                    {
                        color: invertTextColor
                    }
                }
                >
                    What would you like to discuss?:
                </Text>
                <TextInput
                className={`h-8 border-1 border-black bg-gray-100 mb-4 pt-3 rounded h-24 resize-none`}
                placeholder="Your feedback here"
                textAlignVertical="top"
                multiline
                />
                <TouchableOpacity
                className={`rounded bg-pink-400 h-10 w-full`}
                >
                    <Text
                    className={`text-center text-lg text-white mt-2.5`}
                    >
                        Submit
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}