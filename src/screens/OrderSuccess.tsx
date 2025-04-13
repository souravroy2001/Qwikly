import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Pressable,
  ScrollView,
  Animated,
  Image,
  FlatList
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import useAuthStore from 'zustand/authStore';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { navigate } from 'routers/NavigationService';

type OrderSuccessParams = {
  OrderConfirmation: {
    orderId: string;
    total: number;
    items: Array<{
      id: number;
      name: string;
      description: string;
      price: number;
      imageUrl: string;
      quantity?: number;
    }>;
  };
};

const OrderSuccess = () => {
  const route = useRoute<RouteProp<OrderSuccessParams, 'OrderConfirmation'>>();
  const { orderId, total, items } = route.params;
  const { isDarkMode, user } = useAuthStore();


  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;


  const themeStyles = {
    backgroundColor: isDarkMode === 'dark' ? '#124245' : '#f1eae2',
    textColor: isDarkMode === 'dark' ? '#f1eae2' : '#124245',
    cardBackground: isDarkMode === 'dark' ? '#124245' : '#f1eae2',
    borderColor: isDarkMode === 'dark' ? '#f1eae2' : '#124245',
    secondaryText: isDarkMode === 'dark' ? '#a0a0a0' : '#6c757d',
    primaryColor: isDarkMode === 'dark' ? '#f1eae2' : '#124245',
    dangerColor: '#f47679',
    successColor: '#4caf50',
  };


  const getEstimatedDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };


  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        })
      ])
    ]).start();
  }, []);


  const subtotal = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const tax = subtotal * 0.18;
  const shipping = 40;


  const renderOrderItem = ({ item }) => (
    <View style={[styles.orderItem, { backgroundColor: themeStyles.cardBackground, borderColor: themeStyles.borderColor }]}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.itemImage}
      />
      <View style={styles.itemDetails}>
        <Text style={[styles.itemName, { color: themeStyles.textColor }]} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={[styles.itemQuantity, { color: themeStyles.secondaryText }]}>
          Qty: {item.quantity || 1}
        </Text>
      </View>
      <Text style={[styles.itemPrice, { color: themeStyles.primaryColor }]}>
        ₹{(item.price * (item.quantity || 1)).toLocaleString('en-IN')}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <StatusBar barStyle={isDarkMode === 'dark' ? 'light-content' : 'dark-content'} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Success Animation */}
        <View style={styles.successAnimationContainer}>
          <Animated.View
            style={[
              styles.successIconCircle,
              {
                backgroundColor: themeStyles.successColor,
                transform: [{ scale: scaleAnim }],
              }
            ]}
          >
            <MaterialCommunityIcons name="check-bold" size={60} color="#ffffff" />
          </Animated.View>
        </View>

        {/* Success Message */}
        <Animated.View
          style={[
            styles.messageContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateYAnim }]
            }
          ]}
        >
          <Text style={[styles.thankYouText, { color: themeStyles.textColor }]}>
            Thank You!
          </Text>
          <Text style={[styles.orderPlacedText, { color: themeStyles.textColor }]}>
            Your order has been placed successfully
          </Text>
          <Text style={[styles.descriptionText, { color: themeStyles.secondaryText }]}>
            We've sent a confirmation email to {user?.email || 'your registered email'} with all the details.
          </Text>
        </Animated.View>

        {/* Order Details Card */}
        <View style={[styles.orderDetailsCard, { backgroundColor: themeStyles.cardBackground, borderColor: themeStyles.borderColor }]}>
          <View style={styles.orderInfoRow}>
            <Text style={[styles.orderIdLabel, { color: themeStyles.secondaryText }]}>
              Order ID
            </Text>
            <Text style={[styles.orderId, { color: themeStyles.textColor }]}>
              #{orderId}
            </Text>
          </View>

          <View style={styles.orderInfoRow}>
            <Text style={[styles.orderIdLabel, { color: themeStyles.secondaryText }]}>
              Order Date
            </Text>
            <Text style={[styles.orderId, { color: themeStyles.textColor }]}>
              {new Date().toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.orderInfoRow}>
            <Text style={[styles.orderIdLabel, { color: themeStyles.secondaryText }]}>
              Estimated Delivery
            </Text>
            <Text style={[styles.orderId, { color: themeStyles.textColor }]}>
              {getEstimatedDeliveryDate()}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: themeStyles.borderColor }]} />

          <View style={styles.shippingAddressContainer}>
            <View style={styles.sectionHeaderRow}>
              <MaterialIcons name="local-shipping" size={16} color={themeStyles.primaryColor} />
              <Text style={[styles.sectionTitle, { color: themeStyles.textColor }]}>
                Shipping Address
              </Text>
            </View>

            <Text style={[styles.addressName, { color: themeStyles.textColor }]}>
              {user?.name || 'John Doe'}
            </Text>
            <Text style={[styles.addressDetail, { color: themeStyles.secondaryText }]}>
              123 Main Street, Apartment 4B
            </Text>
            <Text style={[styles.addressDetail, { color: themeStyles.secondaryText }]}>
              Mumbai, Maharashtra 400001
            </Text>
            <Text style={[styles.addressDetail, { color: themeStyles.secondaryText }]}>
              Phone: +91 98765 43210
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: themeStyles.borderColor }]} />

          <View style={styles.paymentInfoContainer}>
            <View style={styles.sectionHeaderRow}>
              <MaterialIcons name="payment" size={16} color={themeStyles.primaryColor} />
              <Text style={[styles.sectionTitle, { color: themeStyles.textColor }]}>
                Payment Method
              </Text>
            </View>

            <View style={styles.paymentMethodRow}>
              <MaterialIcons name="credit-card" size={20} color={themeStyles.secondaryText} />
              <Text style={[styles.paymentMethodText, { color: themeStyles.textColor }]}>
                Credit Card (ending with 4242)
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: themeStyles.borderColor }]} />

          <View style={styles.orderItemsContainer}>
            <View style={styles.sectionHeaderRow}>
              <MaterialIcons name="shopping-bag" size={16} color={themeStyles.primaryColor} />
              <Text style={[styles.sectionTitle, { color: themeStyles.textColor }]}>
                Order Items ({items.length})
              </Text>
            </View>

            <FlatList
              data={items}
              renderItem={renderOrderItem}
              keyExtractor={item => item.id.toString()}
              scrollEnabled={false}
              contentContainerStyle={styles.orderItemsListContainer}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: themeStyles.borderColor }]} />

          <View style={styles.orderSummaryContainer}>
            <View style={styles.sectionHeaderRow}>
              <MaterialIcons name="receipt" size={16} color={themeStyles.primaryColor} />
              <Text style={[styles.sectionTitle, { color: themeStyles.textColor }]}>
                Order Summary
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: themeStyles.secondaryText }]}>
                Subtotal
              </Text>
              <Text style={[styles.summaryValue, { color: themeStyles.textColor }]}>
                ₹{subtotal.toLocaleString('en-IN')}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: themeStyles.secondaryText }]}>
                Shipping
              </Text>
              <Text style={[styles.summaryValue, { color: themeStyles.textColor }]}>
                ₹{shipping.toLocaleString('en-IN')}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: themeStyles.secondaryText }]}>
                Tax (18% GST)
              </Text>
              <Text style={[styles.summaryValue, { color: themeStyles.textColor }]}>
                ₹{tax.toLocaleString('en-IN')}
              </Text>
            </View>

            <View style={[styles.totalRow, { borderTopColor: themeStyles.borderColor }]}>
              <Text style={[styles.totalLabel, { color: themeStyles.textColor }]}>
                Total
              </Text>
              <Text style={[styles.totalValue, { color: themeStyles.primaryColor }]}>
                ₹{total.toLocaleString('en-IN')}
              </Text>
            </View>
          </View>
        </View>

        {/* Tracking Note */}
        <View style={styles.trackingNoteContainer}>
          <MaterialCommunityIcons name="truck-fast" size={20} color={themeStyles.successColor} />
          <Text style={[styles.trackingNoteText, { color: themeStyles.secondaryText }]}>
            You will receive tracking information once your order ships.
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={[styles.actionsContainer, { backgroundColor: themeStyles.cardBackground, borderColor: themeStyles.borderColor }]}>
        <Pressable
          style={({ pressed }) => [
            styles.trackOrderButton,
            {
              backgroundColor: pressed ? '#34439e' : themeStyles.primaryColor,
              opacity: pressed ? 0.9 : 1
            }
          ]}
          onPress={() => navigate('OrderTracking', { orderId })}
          android_ripple={{ color: '#34439e' }}
        >
          <MaterialIcons name="location-on" size={18} color={themeStyles.backgroundColor} style={styles.buttonIcon} />
          <Text style={[styles.buttonText, { color: themeStyles.backgroundColor }]}>Track Order</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.continueShoppingButton,
            {
              borderColor: themeStyles.borderColor,
              opacity: pressed ? 0.7 : 1,
              backgroundColor: pressed ? (isDarkMode === 'dark' ? '#333333' : '#f1f1f1') : 'transparent'
            }
          ]}
          onPress={() => navigate('Main')}
          android_ripple={{ color: isDarkMode === 'dark' ? '#333333' : '#f1f1f1' }}
        >
          <MaterialIcons name="shopping-cart" size={18} color={themeStyles.textColor} style={styles.buttonIcon} />
          <Text style={[styles.continueShoppingText, { color: themeStyles.textColor }]}>Continue Shopping</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  successAnimationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 24,
  },
  successIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  thankYouText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  orderPlacedText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  orderDetailsCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
  },
  orderInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderIdLabel: {
    fontSize: 14,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  shippingAddressContainer: {
    marginBottom: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  addressName: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 6,
  },
  addressDetail: {
    fontSize: 14,
    lineHeight: 20,
  },
  paymentInfoContainer: {
    marginBottom: 8,
  },
  paymentMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodText: {
    fontSize: 14,
    marginLeft: 8,
  },
  orderItemsContainer: {
    marginBottom: 8,
  },
  orderItemsListContainer: {
    marginTop: 8,
  },
  orderItem: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
    alignItems: 'center',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 12,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  orderSummaryContainer: {
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  trackingNoteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
    marginBottom: 24,
  },
  trackingNoteText: {
    fontSize: 13,
    marginLeft: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
  },
  trackOrderButton: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  continueShoppingButton: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    borderWidth: 1,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  continueShoppingText: {
    fontSize: 15,
    fontWeight: '600',
  },
});

export default OrderSuccess;
