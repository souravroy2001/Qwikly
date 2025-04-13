import React, { useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Pressable,
} from 'react-native';
import useFetch from 'hooks/useFetchHook';
import { ProductsTypes } from 'interface/productTypes';
import useAuthStore from 'zustand/authStore';

const Categories = () => {
  const { isDarkMode } = useAuthStore();
  const { data, loading, error } = useFetch<ProductsTypes[]>(
    'https://backend.ecom.subraatakumar.com/api/v1/allproducts'
  );

  const themeStyles = {
    backgroundColor: isDarkMode === 'dark' ? '#124245' : '#f1eae2',
    color: isDarkMode === 'dark' ? '#f1eae2' : '#124245',
  };

  const uniqueCategories = useMemo(() => {
    if (!data) return [];

    const categoryMap = new Map<string, { name: string; imageUrl: string }>();

    data.forEach((product) => {
      if (!categoryMap.has(product.category)) {
        categoryMap.set(product.category, {
          name: product.category,
          imageUrl: product.imageUrl,
        });
      }
    });

    return Array.from(categoryMap.values());
  }, [data]);

  const handleCategoryPress = (category) => {
    console.log('Selected category:', category.name);
  };

  const renderItem = ({ item }) => (
    <Pressable
      style={[styles.card, { backgroundColor: themeStyles.backgroundColor }]}
      onPress={() => handleCategoryPress(item)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.icon} />
      <Text style={[styles.name, { color: themeStyles.color }]}>
        {item.name}
      </Text>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <Text style={[styles.title, { color: themeStyles.color }]}>Categories</Text>
      <FlatList
        data={uniqueCategories}
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        contentContainerStyle={{ paddingBottom: 20 }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  card: {
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    marginBottom: 16,
    elevation: 2,
  },
  icon: {
    width: "100%",
    height: 100,
    marginBottom: 12,
    borderRadius: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Categories;
