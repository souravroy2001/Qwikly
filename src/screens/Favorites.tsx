import { ProductsTypes } from 'interface/productTypes';
import React from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Image,
    Pressable,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useAuthStore from 'zustand/authStore';

const Favorites = () => {
    const {
        favorites,
        cartItems,
        handleCart,
        handleFavorite,
        isDarkMode,
    } = useAuthStore();

    const themeStyles = {
        backgroundColor: isDarkMode === 'dark' ? '#124245' : '#f1eae2',
        color: isDarkMode === 'dark' ? '#f1eae2' : '#124245',
        cardBackground: isDarkMode === 'dark' ? '#1e3d3f' : '#f1f1f1',
        priceColor: isDarkMode === 'dark' ? '#ccc' : '#444',
        emptyColor: isDarkMode === 'dark' ? '#bbb' : '#999',
    };

    const handleAddToCartFromFavorites = (product: ProductsTypes) => {
        handleCart(product);
        handleFavorite(product);
    };

    const renderItem = ({ item }: { item: ProductsTypes }) => {
        const isInCart = cartItems.some(prod => prod.id === item.id);

        return (
            <View style={[styles.card, { backgroundColor: themeStyles.cardBackground, }]}>
                <Image source={{ uri: item.imageUrl }} style={styles.image} />

                <Pressable
                    style={styles.removeIcon}
                    onPress={() => handleFavorite(item)}
                >
                    <Ionicons name="trash-outline" size={20} color="red" />
                </Pressable>

                <View style={styles.info}>
                    <Text style={[styles.name, { color: themeStyles.color }]}>{item.name}</Text>
                    <Text style={[styles.price, { color: themeStyles.priceColor }]}>₹{item.price}</Text>

                    <Pressable
                        style={[styles.cartBtn, isInCart && styles.disabledBtn, { backgroundColor: themeStyles.color }]}
                        onPress={() => handleAddToCartFromFavorites(item)}
                        disabled={isInCart}
                    >
                        <Ionicons
                            name={isInCart ? "checkmark-done" : "cart-outline"}
                            size={18}
                            color={themeStyles.backgroundColor}
                        />
                        <Text style={[styles.cartText, { color: themeStyles.backgroundColor }]}>
                            {isInCart ? "In Cart" : "Add to Cart"}
                        </Text>
                    </Pressable>
                </View>
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
            {favorites.length === 0 ? (
                <Text style={[styles.emptyText, { color: themeStyles.emptyColor }]}>
                    No favorite items yet.
                </Text>
            ) : (
                <FlatList
                    data={favorites}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        flex: 1,
        paddingTop: 16,
    },
    card: {
        flexDirection: 'row',
        marginBottom: 20,
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative',
    },
    image: {
        width: 100,
        height: 100,
    },
    info: {
        flex: 1,
        padding: 10,
        justifyContent: 'space-between',
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
    },
    price: {
        fontSize: 14,
    },
    cartBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#124245',
        padding: 10,
        borderRadius: 8,
        justifyContent: 'center',
    },
    cartText: {
        color: '#fff',
        marginLeft: 8,
        fontWeight: 'bold',
    },
    disabledBtn: {
        backgroundColor: '#888',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
    },
    removeIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 1,
        padding: 6,
        backgroundColor: '#fff',
        borderRadius: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
});

export default Favorites;
