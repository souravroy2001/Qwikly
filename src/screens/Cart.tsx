import { ProductsTypes } from 'interface/productTypes';
import React from 'react';
import {
    View,
    Text,
    FlatList,
    Pressable,
    StyleSheet,
    Alert,
    Image,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { navigate } from 'routers/NavigationService';
import useAuthStore from 'zustand/authStore';

const DELIVERY_CHARGE = 50;
const TAX_PERCENT = 0.05;

const Cart = () => {
    const { cartItems, isDarkMode } = useAuthStore();

    const handleIncreaseQuantity = (product: ProductsTypes) => {
        useAuthStore.getState().handleCart(product);
    };

    const handleDecreaseQuantity = (product: ProductsTypes) => {
        useAuthStore.getState().cartItemDecreaseQuantity(product);
    };

    const handleRemoveItem = (product: ProductsTypes) => {
        useAuthStore.getState().cartItemRemove(product);
    };

    const handleCheckout = () => {
        navigate('Checkout', { items: cartItems })
    };

    const calculateTotals = () => {
        const totalPrice = cartItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
        const tax = totalPrice * TAX_PERCENT;
        const grandTotal = totalPrice + tax + DELIVERY_CHARGE;

        return {
            totalPrice: totalPrice?.toFixed(2),
            tax,
            deliveryCharge: DELIVERY_CHARGE,
            grandTotal,
        };
    };

    const { totalPrice, tax, deliveryCharge, grandTotal } = calculateTotals();

    const themeStyles = {
        backgroundColor: isDarkMode === "dark" ? "#124245" : "#f1eae2",
        color: isDarkMode === "dark" ? "#f1eae2" : "#124245",
    };

    const RenderItem = ({ product }: { product: ProductsTypes }) => (
        <View style={[styles.cartItem, { borderBottomColor: themeStyles.color }]}>
            <Image source={{ uri: product?.imageUrl }} style={styles.productImage} />
            <View style={styles.infoContainer}>
                <Text style={[styles.productName, { color: themeStyles.color }]}>{product.name}</Text>
                <Text style={[styles.productPrice, { color: themeStyles.color }]}>₹{product.price}</Text>
                <View style={styles.quantityContainer}>
                    <Pressable onPress={() => handleDecreaseQuantity(product)}>
                        <FontAwesome name="minus-circle" size={20} color={themeStyles.color} />
                    </Pressable>
                    <Text style={[styles.productQuantity, { color: themeStyles.color }]}>{product.quantity}</Text>
                    <Pressable onPress={() => handleIncreaseQuantity(product)}>
                        <FontAwesome name="plus-circle" size={20} color="green" />
                    </Pressable>
                </View>
            </View>
            <Pressable onPress={() => handleRemoveItem(product)}>
                <Ionicons name="trash-outline" size={25} color={themeStyles.color} />
            </Pressable>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
            <FlatList
                data={cartItems}
                renderItem={({ item }) => <RenderItem product={item} />}
                keyExtractor={(item) => item.id.toString()}
            />

            <View style={[styles.summaryContainer, { borderTopColor: themeStyles.color }]}>
                <Text style={[styles.summaryText, { color: themeStyles.color }]}>Total Price: ₹{totalPrice}</Text>
                <Text style={[styles.summaryText, { color: themeStyles.color }]}>Tax (5%): ₹{tax.toFixed(2)}</Text>
                <Text style={[styles.summaryText, { color: themeStyles.color }]}>Delivery Charge: ₹{deliveryCharge.toFixed(2)}</Text>
                <Text style={[styles.summaryText, { fontWeight: 'bold', color: themeStyles.color }]}>
                    Grand Total: ₹{grandTotal.toFixed(2)}
                </Text>
            </View>

            <Pressable style={[styles.checkoutButton, { backgroundColor: themeStyles.color }]} onPress={handleCheckout}>
                <Text style={[styles.checkoutButtonText, { color: themeStyles.backgroundColor }]}>Proceed to Checkout</Text>
            </Pressable>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    cartItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
    },
    productImage: {
        width: 50,
        height: 50,
        borderRadius: 5,
        marginRight: 10,
    },
    infoContainer: {
        flex: 1,
        marginLeft: 10,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    productPrice: {
        fontSize: 14,
        color: '#888',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    productQuantity: {
        marginHorizontal: 10,
        fontSize: 16,
    },
    summaryContainer: {
        marginTop: 20,
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    summaryText: {
        fontSize: 16,
        marginVertical: 5,
    },
    checkoutButton: {
        padding: 15,
        borderRadius: 5,
        marginTop: 20,
    },
    checkoutButtonText: {
        fontSize: 18,
        textAlign: 'center',
    },
});

export default Cart;
