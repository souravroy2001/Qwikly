import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Pressable,
  useColorScheme,
} from 'react-native';
import useAuthStore from 'zustand/authStore';

type CategoryType = {
  id: number;
  name: string;
  image: string;
};

const categories: CategoryType[] = [
  {
    id: 1,
    name: 'Electronics',
    image: 'https://cdn-icons-png.flaticon.com/512/1087/1087815.png',
  },
  {
    id: 2,
    name: 'Clothing',
    image: 'https://cdn-icons-png.flaticon.com/512/892/892458.png',
  },
  {
    id: 3,
    name: 'Home & Furniture',
    image: 'https://cdn-icons-png.flaticon.com/512/3649/3649464.png',
  },
  {
    id: 4,
    name: 'Sports',
    image: 'https://cdn-icons-png.flaticon.com/512/188/188987.png',
  },
  {
    id: 5,
    name: 'Beauty',
    image: 'https://cdn-icons-png.flaticon.com/512/3050/3050143.png',
  },
];

const Categories = () => {
  const { isDarkMode } = useAuthStore()

  const themeStyles = {
    backgroundColor: isDarkMode === 'dark' ? '#124245' : '#f1eae2',
    color: isDarkMode === 'dark' ? '#f1eae2' : '#124245',
  };

  const handleCategoryPress = (category: CategoryType) => {
    console.log('Selected category:', category.name);
  };

  const renderItem = ({ item }: { item: CategoryType }) => (
    <Pressable
      style={[styles.card, { backgroundColor: themeStyles.backgroundColor }]}
      onPress={() => handleCategoryPress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.icon} />
      <Text style={[styles.name, { color: themeStyles.color }]}>
        {item.name}
      </Text>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <Text style={[styles.title, { color: themeStyles.color }]}>Categories</Text>
      <FlatList
        data={categories}
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
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
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    marginBottom: 16,
    elevation: 2,
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Categories;
