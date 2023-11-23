import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveDeletedProductId = async (id) => {
    const deletedIds = await AsyncStorage.getItem('deletedIds');
    const updatedDeletedIds = [...JSON.parse(deletedIds || '[]'), id];
    await AsyncStorage.setItem('deletedIds', JSON.stringify(updatedDeletedIds));
};

export const getDeletedProductIds = async () => {
    const deletedIds = await AsyncStorage.getItem('deletedIds');
    return JSON.parse(deletedIds || '[]');
};