import {
    SafeAreaView,
    View,
    Text,
    Image,
    StatusBar,
    Button,
    FlatList,
    TouchableOpacity
} from "react-native";

import { changeColor, dimensionLayout } from "@utils";


import image from "@assets/salon-service.png";

export default function () {

    const { textColor, backgroundColor, shadowColor, colorScheme } =
    changeColor();
    const invertBackgroundColor = colorScheme === "dark" ? "#e5e5e5" : "#212B36";
    const invertTextColor = colorScheme === "dark" ? "#e5e5e5" : "#212B36";

    const data  = [
        {
            id:1,
            service:"Face Wash",
            description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean id ex quis eros imperdiet pretium. Donec lorem justo, molestie vel nisl et, porta pharetra elit. Quisque ac metus felis. Ut fringilla ullamcorper finibus. Aliquam augue mi, rhoncus vitae tellus dignissim, efficitur bibendum dolor. ",
            date:"December 12, 2023",
            price:"599.00",
            image: image
        },
        {
            id:2,
            service:"Face Wash",
            description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean id ex quis eros imperdiet pretium. Donec lorem justo, molestie vel nisl et, porta pharetra elit. Quisque ac metus felis. Ut fringilla ullamcorper finibus. Aliquam augue mi, rhoncus vitae tellus dignissim, efficitur bibendum dolor. ",
            date:"December 12, 2023",
            price:"599.00",
            image: image
        },
        {
            id:3,
            service:"Face Wash",
            description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean id ex quis eros imperdiet pretium. Donec lorem justo, molestie vel nisl et, porta pharetra elit. Quisque ac metus felis. Ut fringilla ullamcorper finibus. Aliquam augue mi, rhoncus vitae tellus dignissim, efficitur bibendum dolor. ",
            date:"December 12, 2023",
            price:"599.00",
            image: image
        },
        {
            id:4,
            service:"Face Wash",
            description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean id ex quis eros imperdiet pretium. Donec lorem justo, molestie vel nisl et, porta pharetra elit. Quisque ac metus felis. Ut fringilla ullamcorper finibus. Aliquam augue mi, rhoncus vitae tellus dignissim, efficitur bibendum dolor. ",
            date:"December 12, 2023",
            price:"599.00",
            image: image
        },
        {
            id:5,
            service:"Face Wash",
            description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean id ex quis eros imperdiet pretium. Donec lorem justo, molestie vel nisl et, porta pharetra elit. Quisque ac metus felis. Ut fringilla ullamcorper finibus. Aliquam augue mi, rhoncus vitae tellus dignissim, efficitur bibendum dolor. ",
            date:"December 12, 2023",
            price:"599.00",
            image: image
        },
        {
            id:6,
            service:"Face Wash",
            description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean id ex quis eros imperdiet pretium. Donec lorem justo, molestie vel nisl et, porta pharetra elit. Quisque ac metus felis. Ut fringilla ullamcorper finibus. Aliquam augue mi, rhoncus vitae tellus dignissim, efficitur bibendum dolor. ",
            date:"December 12, 2023",
            price:"599.00",
            image: image
        }
    ]
    return (
        <SafeAreaView
        className={`flex-1`}
        style={
            {
                backgroundColor
            }
        }
        >
            <View
            className={`flex-1 px-4`}
            >
                <FlatList
                data={data}
                ItemSeparatorComponent={
                    <View
                    className={`h-4`}
                    />
                }

                ListHeaderComponent={
                    <Text
                    className={`text-xl py-4 font-semibold text-center`}
                    style={
                        {
                            color: invertTextColor
                        }
                    }
                    >
                        Past appointments
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