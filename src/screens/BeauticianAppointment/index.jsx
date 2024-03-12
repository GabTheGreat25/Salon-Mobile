import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { LoadingScreen } from "@components";
import { useNavigation } from "@react-navigation/native";
import { useGetAppointmentByBeauticianIdQuery } from "../../state/api/reducer";
import noImg from "../../../assets/icon.png";

export default function ({ route }) {
  const navigation = useNavigation();
  const { id } = route.params;
  const { data, isLoading } =  useGetAppointmentByBeauticianIdQuery(id);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  console.log(data?.details);
  return (
    <>
      <View className={`flex h-full flex-col bg-primary-default `}>
        <Text> this is an image</Text>
        {data?.details?.map((a)=>(
          
           <View className={`flex-1 flex-row justify-center`}>
            {a?.appointment?.customer?.image.map((img)=>(
              <View
               className={`justify-center mb-4 md:mb-0`}
               >
                {img?.url ? (
                  <Image
                  source={img?.image && img?.image?.length > 1 ? img?.image[Math.floor(Math.random() * img?.image?.length)]?.url : img?.url}
                  />
                ):(
                  <Image
                  className={`rounded-full w-52 h-52`}
                  source={noImg}
                  />
                )}
              </View>
            ))}
      

            <View
            className={`h-12 w-12 rounded bg-white mt-3`}
            >
              <Text>{a?.appointment?.customer?.name}</Text>
            </View>
          </View>
          
        ))}
      </View>
    </>
  );
}
