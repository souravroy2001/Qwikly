import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  FlatList,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  StatusBar,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import useFetch from '../hooks/useFetchHook';
import { ProductsTypes } from '../interface/productTypes';
import ProductComponent from '../components/ProductComponent';
import { navigate } from 'routers/NavigationService';
import useAuthStore from 'zustand/authStore';
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import RenderCategoryItem from 'components/RenderCategoryItem';

const { width } = Dimensions.get('window');
const BANNER_HEIGHT = 180;

export default function Home() {
  const { data, loading, error, } = useFetch<ProductsTypes[]>("https://backend.ecom.subraatakumar.com/api/v1/allproducts");
  const [refreshing, setRefreshing] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const { isDarkMode } = useAuthStore();

  const themeStyles = {
    backgroundColor: isDarkMode === "dark" ? "#0c2f31" : "#ffffff",
    surfaceColor: isDarkMode === "dark" ? "#124245" : "#f9f9f9",
    cardColor: isDarkMode === "dark" ? "#1a5456" : "#ffffff",
    primaryColor: isDarkMode === "dark" ? "#4fd1d8" : "#f47679",
    textColor: isDarkMode === "dark" ? "#f1eae2" : "#333333",
    secondaryTextColor: isDarkMode === "dark" ? "#a9d4d6" : "#555555",
  };

  const bannerData = useMemo(() => [
    { id: 1, imageUrl: require('../components/images/slider_image_1.png'), title: 'Summer Sale' },
    { id: 2, imageUrl: require('../components/images/slider_image_2.png'), title: 'New Arrivals' },
    { id: 3, imageUrl: require('../components/images/slider_image_3.png'), title: 'Flash Deals' },
  ], []);

  const [activeBanner, setActiveBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBanner((prevBanner) => (prevBanner + 1) % bannerData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [bannerData.length]);

  const specialOffer = useMemo(() => data?.slice(0, 4) || [], [data]);
  const categories = useMemo(() => {
    if (!data) return [];
    const uniqueCategories = [...new Set(data.map(item => item.category))];
    return uniqueCategories.slice(0, 8).map((category, index) => ({
      id: index,
      category,
      imageUrl: data.find(item => item.category === category)?.imageUrl || '',
    }));
  }, [data]);

  const featuredProducts = useMemo(() => data?.slice(5, 13) || [], [data]);

  const handlePress = (product: ProductsTypes) => {
    navigate('ProductDetails', { productId: product });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setRefreshing(false);
  };

  const RenderBanner = () => (
    <View style={styles.bannerContainer}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentOffset={{ x: activeBanner * width, y: 0 }}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
          setActiveBanner(newIndex);
        }}
      >
        {bannerData && bannerData.map((banner) => (
          <Pressable
            key={banner.id}
            style={styles.bannerSlide}
            onPress={() => navigate('Shop', { filter: banner.title })}
          >
            <Image source={banner.imageUrl} style={styles.bannerImage} />
            <View style={styles.bannerOverlay}>
              <Text style={styles.bannerTitle}>{banner.title}</Text>
              <Pressable style={styles.shopNowButton}>
                <Text style={styles.shopNowText}>Shop Now</Text>
              </Pressable>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.paginationContainer}>
        {bannerData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === activeBanner && styles.paginationDotActive,
              { backgroundColor: index === activeBanner ? themeStyles.primaryColor : '#ffffff' }
            ]}
          />
        ))}
      </View>
    </View>
  );

  const RenderSectionHeader = ({ title, onViewAll }: { title: string, onViewAll: () => void }) => (
    <View style={styles.sectionHeaderBox}>
      <Text style={[styles.sectionHeader, { color: themeStyles.textColor }]}>{title}</Text>
      <Pressable
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        onPress={onViewAll}
        style={styles.viewAllButton}
      >
        <Text style={[styles.viewAllText, { color: themeStyles.primaryColor }]}>View all</Text>
        <MaterialIcons name="chevron-right" size={20} color={themeStyles.primaryColor} />
      </Pressable>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: themeStyles.backgroundColor }]}>
        <ActivityIndicator size="large" color={themeStyles.primaryColor} />
        <Text style={[styles.loadingText, { color: themeStyles.textColor }]}>Loading products...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: themeStyles.backgroundColor }]}>
        <MaterialIcons name="error-outline" size={60} color={themeStyles.primaryColor} />
        <Text style={[styles.errorText, { color: themeStyles.textColor }]}>Something went wrong</Text>
        <Text style={[styles.errorSubtext, { color: themeStyles.secondaryTextColor }]}>{error}</Text>
        <Pressable style={[styles.retryButton, { backgroundColor: themeStyles.primaryColor }]}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeStyles.backgroundColor }]}>
      <StatusBar
        backgroundColor={themeStyles.backgroundColor}
        barStyle={isDarkMode === "dark" ? "light-content" : "dark-content"}
      />

      <ScrollView
        style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[themeStyles.primaryColor]}
            tintColor={themeStyles.primaryColor}
          />
        }
      >
        <RenderBanner />

        <View style={[styles.sectionContainer, { backgroundColor: themeStyles.surfaceColor }]}>
          <RenderSectionHeader
            title="Categories"
            onViewAll={() => navigate("Shop")}
          />
          <FlatList
            horizontal
            data={categories}
            renderItem={({ item }) => <RenderCategoryItem item={item} />}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          />
        </View>

        <View style={[styles.sectionContainer, { backgroundColor: themeStyles.surfaceColor }]}>
          <RenderSectionHeader
            title="Special Offers"
            onViewAll={() => navigate("Shop", { filter: "special_offers" })}
          />
          <FlatList
            data={specialOffer}
            renderItem={({ item }) => (
              <ProductComponent product={item} onPress={handlePress} />
            )}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.productGridContainer}
            ListEmptyComponent={() => (
              <Text style={[styles.emptyMessage, { color: themeStyles.textColor }]}>
                No special offers available
              </Text>
            )}
          />
        </View>

        <View style={[styles.promotionBanner, { backgroundColor: themeStyles.primaryColor }]}>
          <Text style={styles.promotionText}>Up to 50% OFF on selected items</Text>
          <Pressable
            style={[styles.promotionButton, { backgroundColor: isDarkMode === "dark" ? "#0c2f31" : "#ffffff" }]}
            onPress={() => navigate('Shop', { filter: 'discount' })}
          >
            <Text style={[styles.promotionButtonText, { color: themeStyles.primaryColor }]}>Shop Now</Text>
          </Pressable>
        </View>

        <View style={[styles.sectionContainer, { backgroundColor: themeStyles.surfaceColor }]}>
          <RenderSectionHeader
            title="Featured Products"
            onViewAll={() => navigate("Shop", { filter: "featured" })}
          />
          <FlatList
            data={featuredProducts}
            renderItem={({ item }) => (
              <ProductComponent product={item} onPress={handlePress} />
            )}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.productGridContainer}
            ListEmptyComponent={() => (
              <Text style={[styles.emptyMessage, { color: themeStyles.textColor }]}>
                No featured products available
              </Text>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 16,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  searchBarFocused: {
    borderWidth: 1,
    borderColor: '#f47679',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  filterButton: {
    padding: 4,
  },
  bannerContainer: {
    height: BANNER_HEIGHT,
    position: 'relative',
  },
  bannerSlide: {
    width,
    height: BANNER_HEIGHT,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  shopNowButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 4,
  },
  shopNowText: {
    color: '#333',
    fontWeight: 'bold',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: '#ffffff',
    opacity: 0.5,
  },
  paginationDotActive: {
    opacity: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  sectionContainer: {
    marginTop: 16,
    overflow: 'hidden',
    paddingVertical: 12,
  },
  sectionHeaderBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  productGridContainer: {
    paddingBottom: 16,
  },
  promotionBanner: {
    marginTop: 16,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  promotionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  promotionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  promotionButtonText: {
    fontWeight: 'bold',
  },
  emptyMessage: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  errorSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
