import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import useAuthStore from 'zustand/authStore';
import useFetch from 'hooks/useFetchHook';

type ProductType = {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category?: string;
};

type RouteParams = {
  ProductDetails: {
    productId: ProductType;
  };
};

const ProductDetails = () => {
  const { isDarkMode } = useAuthStore();
  const route = useRoute<RouteProp<RouteParams, 'ProductDetails'>>();
  const product = route.params.productId;

  const themeStyles = {
    backgroundColor: isDarkMode === 'dark' ? '#0c2b2c' : '#f9f9f9',
    textColor: isDarkMode === 'dark' ? '#fff' : '#000',
    cardBackground: isDarkMode === 'dark' ? '#123536' : '#fff',
  };

  const { data: allProducts, loading } = useFetch<ProductType[]>(
    'https://backend.ecom.subraatakumar.com/api/v1/allproducts'
  );

  const crossSellProducts = allProducts
    ?.filter((p) => p.id !== product.id && p.category === product.category)
    ?.slice(0, 5);

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <Image source={{ uri: product?.imageUrl }} style={styles.image} resizeMode="cover" />
      <View style={[styles.card, { backgroundColor: themeStyles.cardBackground }]}>
        <Text style={[styles.name, { color: themeStyles.textColor }]}>{product.name}</Text>
        <Text style={[styles.price, { color: '#f47679' }]}>₹ {product.price}</Text>
        {product.category && (
          <Text style={[styles.category, { color: themeStyles.textColor }]}>
            Category: {product.category}
          </Text>
        )}
        <Text style={[styles.description, { color: themeStyles.textColor }]}>
          {product.description}
        </Text>

        <View style={styles.buttonRow}>
          <Pressable style={[styles.cartButton, { backgroundColor: "#f47679" }]}>
            <Text style={styles.buttonText}>Add to Cart</Text>
          </Pressable>
          <Pressable style={[styles.buyButton, { backgroundColor: themeStyles.textColor }]}>
            <Text style={[styles.buttonText, { color: themeStyles.backgroundColor }]}>Buy Now</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.relatedSection}>
        <Text style={[styles.relatedTitle, { color: themeStyles.textColor }]}>
          You might also like
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#f47679" style={{ marginTop: 10 }} />
        ) : (
          <FlatList
            data={crossSellProducts}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.relatedList}
            renderItem={({ item }) => (
              <View style={[styles.relatedCard, { backgroundColor: themeStyles.cardBackground }]}>
                <Image source={{ uri: item.imageUrl }} style={styles.relatedImage} />
                <Text style={[styles.relatedName, { color: themeStyles.textColor }]} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={[styles.relatedPrice, { color: '#f47679' }]}>₹ {item.price}</Text>
              </View>
            )}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 250,
  },
  card: {
    padding: 16,
    elevation: 2,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  category: {
    fontSize: 14,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  cartButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyButton: {
    flex: 1,
    backgroundColor: '#ff5722',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  relatedSection: {
    paddingVertical: 10,
  },
  relatedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 10,
  },
  relatedList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  relatedCard: {
    width: 120,
    marginRight: 12,
    padding: 8,
    borderRadius: 10,
    elevation: 2,
  },
  relatedImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 6,
  },
  relatedName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  relatedPrice: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default ProductDetails;
