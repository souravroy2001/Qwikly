import { View, Text, FlatList, StyleSheet, StatusBar } from 'react-native';
import React from 'react';
import useFetch from '../hooks/useFetchHook';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProductsTypes } from 'interface/productTypes';
import ProductComponent from 'components/ProductComponent';
import useAuthStore from 'zustand/authStore';

type RootStackParamList = {
  ProductDetail: { productId: number };
};

type ProductDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductDetail'>;

export default function Shop() {
  const { data, loading, error } = useFetch<ProductsTypes[]>("https://backend.ecom.subraatakumar.com/api/v1/allproducts")
  const navigation = useNavigation<ProductDetailNavigationProp>()
  const { isDarkMode } = useAuthStore()

  const handlePress = (product: ProductsTypes) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  if (loading) {
    return <Text style={styles.loading}>Loading products...</Text>;
  }

  if (error) {
    return <Text style={styles.error}>Error: {error}</Text>;
  }

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode === "dark" ? "#124245" : "#f1eae2" }]}>
      <StatusBar backgroundColor={isDarkMode === "dark" ? "#124245" : "#f1eae2"} barStyle={isDarkMode === "dark" ? "light-content" : "dark-content"} />
      <FlatList
        data={data}
        renderItem={({ item }) => (<ProductComponent onPress={handlePress} product={item} />)}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.contentContainer}
        ListEmptyComponent={() => <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 25 }}>No items in the cart</Text>}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  loading: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16
  },
  error: {
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
    fontSize: 16
  },
  columnWrapper: {
    justifyContent: 'space-between'
  },
  contentContainer: {
    paddingBottom: 20
  }
}
);
