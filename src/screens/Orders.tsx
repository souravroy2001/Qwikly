import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Pressable,
    Image,
    StatusBar,
    ActivityIndicator,
    RefreshControl,
    SafeAreaView,
    Dimensions,
    Animated
} from 'react-native';
import { navigate } from 'routers/NavigationService';
import useAuthStore from 'zustand/authStore';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const { width } = Dimensions.get('window');

// Order status mapping to icons and colors
const STATUS_CONFIG = {
    'processing': {
        icon: 'clock-time-four-outline',
        color: '#F59E0B',
        background: '#FEF3C7'
    },
    'confirmed': {
        icon: 'check-circle-outline',
        color: '#10B981',
        background: '#D1FAE5'
    },
    'shipped': {
        icon: 'truck-delivery-outline',
        color: '#3B82F6',
        background: '#DBEAFE'
    },
    'delivered': {
        icon: 'cart-check',
        color: '#10B981',
        background: '#D1FAE5'
    },
    'cancelled': {
        icon: 'close-circle-outline',
        color: '#EF4444',
        background: '#FEE2E2'
    }
};

export default function Orders() {
    const { isDarkMode, orders = [] } = useAuthStore();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const fadeAnim = useState(new Animated.Value(0))[0];

    const themeStyles = {
        backgroundColor: isDarkMode === "dark" ? "#124245" : "#f1eae2",
        color: isDarkMode === "dark" ? "#f1eae2" : "#124245",
        surfaceColor: isDarkMode === "dark" ? "#0c2f31" : "#ffffff",
        cardColor: isDarkMode === "dark" ? "#1a5456" : "#ffffff",
        primaryColor: isDarkMode === "dark" ? "#4fd1d8" : "#f47679",
        borderColor: isDarkMode === "dark" ? "#2a6466" : "#e0d5ca",
        secondaryTextColor: isDarkMode === "dark" ? "#a9d4d6" : "#666666",
    };

    const orderData = orders.length > 0 && orders;

    const filteredOrders = activeTab === 'all'
        ? orderData
        : orderData.filter(order => order.status === activeTab);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true
            }).start();
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1500);
    };

    const toggleOrderExpansion = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatCurrency = (amount) => {
        return `₹${amount.toFixed(2)}`;
    };

    const renderTab = (tab, label) => {
        const isActive = activeTab === tab;
        return (
            <Pressable
                style={[
                    styles.tab,
                    isActive && {
                        borderBottomWidth: 2,
                        borderBottomColor: themeStyles.primaryColor
                    }
                ]}
                onPress={() => setActiveTab(tab)}
            >
                <Text style={[
                    styles.tabText,
                    { color: isActive ? themeStyles.primaryColor : themeStyles.secondaryTextColor }
                ]}>
                    {label}
                </Text>
            </Pressable>
        );
    };

    const renderOrderStatusBadge = (status) => {
        const config = STATUS_CONFIG[status] || STATUS_CONFIG.processing;

        return (
            <View style={[styles.statusBadge, { backgroundColor: config.background }]}>
                <MaterialCommunityIcons name={config.icon} size={14} color={config.color} />
                <Text style={[styles.statusText, { color: config.color }]}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
            </View>
        );
    };

    const renderOrderItem = ({ item: order }) => {
        const isExpanded = expandedOrderId === order.id;

        return (
            <Pressable
                style={[
                    styles.orderCard,
                    { backgroundColor: themeStyles.cardColor, borderColor: themeStyles.borderColor }
                ]}
                onPress={() => toggleOrderExpansion(order.orderID)}
            >
                <View style={styles.orderHeader}>
                    <View>
                        <Text style={[styles.orderId, { color: themeStyles.color }]}>{order.orderID}</Text>
                        <Text style={[styles.orderDate, { color: themeStyles.secondaryTextColor }]}>
                            {formatDate(order.date)}
                        </Text>
                    </View>
                    {renderOrderStatusBadge(order.status)}
                </View>

                <View style={styles.orderSummary}>
                    <View style={styles.orderSummaryRow}>
                        <Text style={[styles.orderSummaryLabel, { color: themeStyles.secondaryTextColor }]}>
                            Items
                        </Text>
                        <Text style={[styles.orderSummaryValue, { color: themeStyles.color }]}>
                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </Text>
                    </View>

                    <View style={styles.orderSummaryRow}>
                        <Text style={[styles.orderSummaryLabel, { color: themeStyles.secondaryTextColor }]}>
                            Total
                        </Text>
                        <Text style={[styles.orderSummaryValue, { color: themeStyles.color, fontWeight: 'bold' }]}>
                            {formatCurrency(order.total)}
                        </Text>
                    </View>
                </View>

                {isExpanded && (
                    <Animated.View style={[styles.orderDetails, { borderTopColor: themeStyles.borderColor }]}>
                        <Text style={[styles.detailsHeading, { color: themeStyles.color }]}>Order Items</Text>

                        {order.items.map(item => (
                            <View key={item.id} style={styles.orderItem}>
                                <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
                                <View style={styles.itemDetails}>
                                    <Text style={[styles.itemName, { color: themeStyles.color }]}>{item.name}</Text>
                                    <Text style={[styles.itemPrice, { color: themeStyles.secondaryTextColor }]}>
                                        {formatCurrency(item.price)} × {item.quantity}
                                    </Text>
                                </View>
                                <Text style={[styles.itemTotal, { color: themeStyles.color }]}>
                                    {formatCurrency(item.price * item.quantity)}
                                </Text>
                            </View>
                        ))}

                        {order.tracking && (
                            <View style={styles.trackingSection}>
                                <Text style={[styles.detailsHeading, { color: themeStyles.color }]}>Shipment</Text>
                                <View style={styles.trackingDetails}>
                                    <MaterialCommunityIcons name="truck-delivery-outline" size={20} color={themeStyles.secondaryTextColor} />
                                    <View style={styles.trackingInfo}>
                                        <Text style={[styles.trackingCarrier, { color: themeStyles.color }]}>
                                            {order.tracking.carrier} - {order.tracking.number}
                                        </Text>
                                        <Text style={[styles.trackingETA, { color: themeStyles.secondaryTextColor }]}>
                                            Est. delivery: {formatDate(order.tracking.estimatedDelivery)}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )}

                        <View style={styles.actionsContainer}>
                            {order.status === 'delivered' && (
                                <Pressable
                                    style={[styles.actionButton, { backgroundColor: themeStyles.primaryColor }]}
                                    onPress={() => navigate('WriteReview', { orderId: order.id, items: order.items })}
                                >
                                    <MaterialIcons name="rate-review" size={16} color="#fff" />
                                    <Text style={styles.actionButtonText}>Write a Review</Text>
                                </Pressable>
                            )}

                            {(order.status === 'shipped' || order.status === 'delivered') && (
                                <Pressable
                                    style={[styles.actionButton, { backgroundColor: themeStyles.primaryColor }]}
                                    onPress={() => navigate('TrackOrder', { tracking: order.tracking })}
                                >
                                    <MaterialIcons name="location-searching" size={16} color="#fff" />
                                    <Text style={styles.actionButtonText}>Track Order</Text>
                                </Pressable>
                            )}

                            {order.status === 'processing' && (
                                <Pressable
                                    style={[styles.outlineButton, { borderColor: themeStyles.primaryColor }]}
                                    onPress={() => navigate('CancelOrder', { orderId: order.id })}
                                >
                                    <MaterialCommunityIcons name="close-circle-outline" size={16} color={themeStyles.primaryColor} />
                                    <Text style={[styles.outlineButtonText, { color: themeStyles.primaryColor }]}>Cancel Order</Text>
                                </Pressable>
                            )}

                            <Pressable
                                style={[styles.outlineButton, { borderColor: themeStyles.primaryColor }]}
                                onPress={() => navigate('OrderDetails', { orderId: order.id })}
                            >
                                <Text style={[styles.outlineButtonText, { color: themeStyles.primaryColor }]}>View Details</Text>
                            </Pressable>
                        </View>
                    </Animated.View>
                )}

                <View style={styles.expandIconContainer}>
                    <MaterialIcons
                        name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                        size={24}
                        color={themeStyles.secondaryTextColor}
                    />
                </View>
            </Pressable>
        );
    };

    const renderEmptyComponent = () => (
        <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="shopping-outline" size={60} color={themeStyles.secondaryTextColor} />
            <Text style={[styles.emptyTitle, { color: themeStyles.color }]}>No orders found</Text>
            <Text style={[styles.emptySubtitle, { color: themeStyles.secondaryTextColor }]}>
                {activeTab === 'all'
                    ? "You haven't placed any orders yet"
                    : `You don't have any ${activeTab} orders`}
            </Text>
            <Pressable
                style={[styles.actionButton, { backgroundColor: themeStyles.primaryColor }]}
                onPress={() => navigate('Shop')}
            >
                <Text style={styles.actionButtonText}>Start Shopping</Text>
            </Pressable>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
                <StatusBar
                    backgroundColor={themeStyles.backgroundColor}
                    barStyle={isDarkMode === "dark" ? "light-content" : "dark-content"}
                />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={themeStyles.primaryColor} />
                    <Text style={[styles.loadingText, { color: themeStyles.color }]}>Loading your orders...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
            <StatusBar
                backgroundColor={themeStyles.backgroundColor}
                barStyle={isDarkMode === "dark" ? "light-content" : "dark-content"}
            />

            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: themeStyles.color }]}>My Orders</Text>
            </View>

            <View style={[styles.tabContainer, { borderBottomColor: themeStyles.borderColor }]}>
                {renderTab('all', 'All')}
                {renderTab('processing', 'Processing')}
                {renderTab('shipped', 'Shipped')}
                {renderTab('delivered', 'Delivered')}
            </View>

            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                <FlatList
                    data={filteredOrders}
                    renderItem={renderOrderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.ordersList}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[themeStyles.primaryColor]}
                            tintColor={themeStyles.primaryColor}
                        />
                    }
                    ListEmptyComponent={renderEmptyComponent}
                />
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        marginBottom: 8,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
    },
    content: {
        flex: 1,
    },
    ordersList: {
        padding: 16,
        paddingBottom: 32,
    },
    orderCard: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    orderId: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    orderDate: {
        fontSize: 13,
        marginTop: 2,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },
    orderSummary: {
        marginBottom: 12,
    },
    orderSummaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    orderSummaryLabel: {
        fontSize: 14,
    },
    orderSummaryValue: {
        fontSize: 14,
    },
    expandIconContainer: {
        alignItems: 'center',
        paddingTop: 8,
    },
    orderDetails: {
        borderTopWidth: 1,
        paddingTop: 16,
        marginTop: 8,
    },
    detailsHeading: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    orderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    itemImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
    },
    itemDetails: {
        flex: 1,
        marginLeft: 12,
    },
    itemName: {
        fontSize: 14,
        fontWeight: '500',
    },
    itemPrice: {
        fontSize: 13,
        marginTop: 2,
    },
    itemTotal: {
        fontSize: 14,
        fontWeight: '600',
    },
    trackingSection: {
        marginTop: 16,
    },
    trackingDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.05)',
        padding: 12,
        borderRadius: 8,
    },
    trackingInfo: {
        marginLeft: 12,
        flex: 1,
    },
    trackingCarrier: {
        fontSize: 14,
        fontWeight: '500',
    },
    trackingETA: {
        fontSize: 13,
        marginTop: 2,
    },
    actionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20,
        gap: 8,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
        marginRight: 8,
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
        marginLeft: 4,
    },
    outlineButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
        borderWidth: 1,
        marginRight: 8,
    },
    outlineButtonText: {
        fontWeight: '600',
        fontSize: 14,
        marginLeft: 4,
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
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 16,
    },
    emptySubtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 24,
    },
});
