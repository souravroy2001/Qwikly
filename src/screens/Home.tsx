import React, { useMemo, } from 'react';
import { View, ScrollView, FlatList, Image, Text, StyleSheet, Dimensions, Pressable, StatusBar } from 'react-native';
import useFetch from '../hooks/useFetchHook';
import { ProductsTypes } from '../interface/productTypes';
import ProductComponent from '../components/ProductComponent';
import { navigate } from 'routers/NavigationService';
import useAuthStore from 'zustand/authStore';

const { width } = Dimensions.get('window');

export default function Home() {
  const { data, loading, error } = useFetch<ProductsTypes[]>("https://backend.ecom.subraatakumar.com/api/v1/allproducts");

  const { isDarkMode } = useAuthStore();

  const themeStyles = {
    backgroundColor: isDarkMode === "dark" ? "#124245" : "#f1eae2",
    color: isDarkMode === "dark" ? "#f1eae2" : "#124245",
  };

  const specialOffer = useMemo(() => data?.slice(0, 12) || [], [data]);
  const categories = useMemo(() => data?.slice(0, 10) || [], [data]);
  const featuredProducts = useMemo(() => data?.slice(15, 45) || [], [data]);

  const handlePress = (product: ProductsTypes) => {
    navigate('ProductDetails', { productId: product });
  };

  const RenderSectionItem = ({ item }: { item: ProductsTypes }) => (
    <View style={styles.sectionItem}>
      <Text style={styles.sectionTitle}>{item?.category}</Text>
    </View>
  )

  if (loading) {
    return <Text style={styles.loading}>Loading products...</Text>;
  }

  if (error) {
    return <Text style={styles.error}>Error: {error}</Text>;
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <StatusBar backgroundColor={themeStyles.backgroundColor} barStyle={isDarkMode === "dark" ? "light-content" : "dark-content"} />


      <View style={styles.sectionContainer}>

        <View style={styles.sectionHeaderBox}>
          <Text style={[styles.sectionHeader, { color: themeStyles.color }]}>Special offer</Text>
          <Pressable hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }} onPress={() => navigate("Shop")}>
            <Text style={[styles.SpecialOfferVew, { color: themeStyles.color }]}>View all</Text>
          </Pressable>
        </View>

        <FlatList
          data={specialOffer}
          renderItem={({ item }) => (
            <ProductComponent product={item} onPress={handlePress} />
          )}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          numColumns={2}
          windowSize={5}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.contentContainer}
          ListEmptyComponent={() => <Text style={[styles.emptyMessage, { color: themeStyles.color }]}>No items in the cart</Text>}
        />
      </View>

      <View style={styles.sectionContainer}>

        <View style={styles.sectionHeaderBox}>
          <Text style={[styles.sectionHeader, { color: themeStyles.color }]}>Categories</Text>
          <Pressable hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }} onPress={() => navigate("Shop")}>
            <Text style={[styles.SpecialOfferVew, { color: themeStyles.color }]}>View all</Text>
          </Pressable>
        </View>

        <FlatList
          horizontal
          data={categories}
          renderItem={({ item }) => <RenderSectionItem item={item} />}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          windowSize={5}

        />
      </View>

      <View style={styles.sectionContainer}>

        <View style={styles.sectionHeaderBox}>
          <Text style={[styles.sectionHeader, { color: themeStyles.color }]}>Featured Products</Text>
          <Pressable hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }} onPress={() => navigate("Shop")}>
            <Text style={[styles.SpecialOfferVew, { color: themeStyles.color }]}>View all</Text>
          </Pressable>
        </View>

        <FlatList
          data={featuredProducts}
          renderItem={({ item }) => (
            <ProductComponent product={item} onPress={handlePress} />
          )}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          numColumns={2}
          windowSize={5}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.contentContainer}
          ListEmptyComponent={() => <Text style={[styles.emptyMessage, { color: themeStyles.color }]}>No items in the cart</Text>}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -5,
    padding: 5,
  },
  columnWrapper: {
    justifyContent: 'space-between'
  },
  contentContainer: {
    paddingBottom: 20
  },
  sliderImage: {
    width: width,
    height: 200,
    resizeMode: 'cover',
  },
  sectionContainer: {
    padding: 0,
  },
  sectionHeaderBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  productItem: {
    flex: 1,
    margin: 8,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  productName: {
    fontSize: 16,
  },
  productPrice: {
    fontSize: 14,
    color: '#666',
  },
  sectionItem: {
    width: "auto",
    padding: 16,
    height: 80,
    marginRight: 16,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
  },
  SpecialOfferText: {
    fontSize: 30,
    fontWeight: 600,
    color: "#000000"
  },
  SpecialOfferVew: {
    fontSize: 20,
    fontWeight: 400,
    color: "#333"
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 25,
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
});
