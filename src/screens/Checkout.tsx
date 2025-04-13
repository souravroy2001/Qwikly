import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  Animated,
  TextInput,
  SafeAreaView,
  StatusBar,
  Pressable
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import useAuthStore from 'zustand/authStore';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
type ProductType = {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  quantity?: number;
};

type RouteParams = {
  Checkout: {
    items: ProductType[];
  };
};

type PaymentMethod = 'creditCard' | 'upi' | 'cod';
type DeliveryOption = 'standard' | 'express' | 'sameDay';

const Checkout = ({ navigation }) => {
  const { isDarkMode, user } = useAuthStore();
  const route = useRoute<RouteProp<RouteParams, 'Checkout'>>();
  const { items } = route.params;

  const [step, setStep] = useState(1);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('creditCard');
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>('standard');
  const [cartItems, setCartItems] = useState(items);
  const [loadingState, setLoadingState] = useState(false);

  const progress = new Animated.Value(0);

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

  const deliveryFees = {
    standard: 40,
    express: 100,
    sameDay: 150
  };

  const updateQuantity = (id, change) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, (item.quantity || 1) + change) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'WELCOME20') {
      setPromoApplied(true);

    } else {

    }
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
  };

  const getDiscount = () => {
    return promoApplied ? getSubtotal() * 0.2 : 0;
  };

  const getDeliveryFee = () => {
    return deliveryFees[deliveryOption];
  };

  const getTaxes = () => {
    return (getSubtotal() - getDiscount()) * 0.18;
  };

  const getTotal = () => {
    return getSubtotal() - getDiscount() + getDeliveryFee() + getTaxes();
  };

  const handleCheckout = () => {
    setLoadingState(true);
    setTimeout(() => {
      setLoadingState(false);
      navigation.navigate('OrderConfirmation', {
        orderId: 'ORD-' + Math.floor(Math.random() * 1000000),
        total: getTotal(),
        items: cartItems
      });
    }, 1500);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.itemCard, { backgroundColor: themeStyles.cardBackground, borderColor: themeStyles.borderColor }]}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />

      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: themeStyles.textColor }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.itemDescription, { color: themeStyles.secondaryText }]} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={[styles.itemPrice, { color: themeStyles.primaryColor }]}>
          ₹{item.price.toLocaleString('en-IN')}
        </Text>
      </View>

      <View style={styles.quantityControls}>
        <Pressable
          style={[styles.quantityButton, { borderColor: themeStyles.borderColor }]}
          onPress={() => updateQuantity(item.id, -1)}
        >
          <Ionicons name="remove" size={16} color={themeStyles.textColor} />
        </Pressable>

        <Text style={[styles.quantityText, { color: themeStyles.textColor }]}>
          {item.quantity || 1}
        </Text>

        <Pressable
          style={[styles.quantityButton, { borderColor: themeStyles.borderColor }]}
          onPress={() => updateQuantity(item.id, 1)}
        >
          <Ionicons name="add" size={16} color={themeStyles.textColor} />
        </Pressable>
      </View>

      <Pressable style={styles.removeButton} onPress={() => removeItem(item.id)}>
        <FontAwesome name="trash-o" size={16} color={themeStyles.dangerColor} />
      </Pressable>
    </View>
  );

  const renderPaymentOption = (type: PaymentMethod, title: string, icon) => (
    <Pressable
      style={[
        styles.paymentOption,
        {
          backgroundColor: themeStyles.cardBackground,
          borderColor: paymentMethod === type ? themeStyles.primaryColor : themeStyles.borderColor
        }
      ]}
      onPress={() => setPaymentMethod(type)}
    >
      {icon}
      <Text style={[styles.paymentOptionText, { color: themeStyles.textColor }]}>
        {title}
      </Text>
      <View style={[
        styles.paymentRadio,
        { borderColor: paymentMethod === type ? themeStyles.primaryColor : themeStyles.borderColor }
      ]}>
        {paymentMethod === type && <View style={[styles.paymentRadioInner, { backgroundColor: themeStyles.primaryColor }]} />}
      </View>
    </Pressable>
  );

  const renderDeliveryOption = (type: DeliveryOption, title: string, description: string, days: string, price: number) => (
    <Pressable
      style={[
        styles.deliveryOption,
        {
          backgroundColor: themeStyles.cardBackground,
          borderColor: deliveryOption === type ? themeStyles.primaryColor : themeStyles.borderColor
        }
      ]}
      onPress={() => setDeliveryOption(type)}
    >
      <View style={styles.deliveryOptionContent}>
        <View style={styles.deliveryOptionHeader}>
          <MaterialCommunityIcons name="truck-delivery" size={16} color={deliveryOption === type ? themeStyles.primaryColor : themeStyles.secondaryText} />
          <Text style={[
            styles.deliveryOptionTitle,
            {
              color: deliveryOption === type ? themeStyles.primaryColor : themeStyles.textColor
            }
          ]}>
            {title}
          </Text>
        </View>

        <Text style={[styles.deliveryOptionDesc, { color: themeStyles.secondaryText }]}>
          {description}
        </Text>

        <Text style={[styles.deliveryOptionDays, { color: themeStyles.secondaryText }]}>
          {days}
        </Text>
      </View>

      <View style={styles.deliveryOptionPriceSection}>
        <Text style={[styles.deliveryOptionPrice, { color: themeStyles.textColor }]}>
          ₹{price}
        </Text>
        <View style={[
          styles.deliveryRadio,
          { borderColor: deliveryOption === type ? themeStyles.primaryColor : themeStyles.borderColor }
        ]}>
          {deliveryOption === type && <View style={[styles.deliveryRadioInner, { backgroundColor: themeStyles.primaryColor }]} />}
        </View>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <StatusBar barStyle={isDarkMode === 'dark' ? 'light-content' : 'dark-content'} />

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressSteps}>
          <View style={[
            styles.progressStep,
            { backgroundColor: step >= 1 ? themeStyles.primaryColor : themeStyles.borderColor }
          ]}>
            <Text style={[styles.progressStepText, { color: themeStyles.backgroundColor }]}>1</Text>
          </View>
          <View style={[styles.progressLine, { backgroundColor: step >= 2 ? themeStyles.primaryColor : themeStyles.borderColor }]} />
          <View style={[
            styles.progressStep,
            { backgroundColor: step >= 2 ? themeStyles.primaryColor : themeStyles.borderColor }
          ]}>
            <Text style={[styles.progressStepText, { color: themeStyles.backgroundColor }]}>2</Text>
          </View>
          <View style={[styles.progressLine, { backgroundColor: step >= 3 ? themeStyles.primaryColor : themeStyles.borderColor }]} />
          <View style={[
            styles.progressStep,
            { backgroundColor: step >= 3 ? themeStyles.primaryColor : themeStyles.borderColor }
          ]}>
            <Text style={[styles.progressStepText, { color: themeStyles.backgroundColor }]}>3</Text>
          </View>
        </View>
        <View style={styles.progressLabels}>
          <Text style={[
            styles.progressLabel,
            { color: step >= 1 ? themeStyles.primaryColor : themeStyles.secondaryText }
          ]}>Cart</Text>
          <Text style={[
            styles.progressLabel,
            { color: step >= 2 ? themeStyles.primaryColor : themeStyles.secondaryText }
          ]}>Delivery</Text>
          <Text style={[
            styles.progressLabel,
            { color: step >= 3 ? themeStyles.primaryColor : themeStyles.secondaryText }
          ]}>Payment</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {step === 1 && (
          <>
            <Text style={[styles.sectionTitle, { color: themeStyles.textColor }]}>
              Your Cart ({cartItems.length})
            </Text>

            {cartItems.length > 0 ? (
              <FlatList
                data={cartItems}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                scrollEnabled={false}
              />
            ) : (
              <View style={[styles.emptyCart, { backgroundColor: themeStyles.cardBackground }]}>
                <Text style={[styles.emptyCartText, { color: themeStyles.textColor }]}>
                  Your cart is empty
                </Text>
                <Pressable
                  style={[styles.continueShoppingButton, { backgroundColor: themeStyles.primaryColor }]}
                  onPress={() => navigation.navigate('Home')}
                >
                  <Text style={styles.continueShoppingText}>Continue Shopping</Text>
                </Pressable>
              </View>
            )}

            {cartItems.length > 0 && (
              <View style={[styles.promoContainer, { backgroundColor: themeStyles.cardBackground, borderColor: themeStyles.borderColor }]}>
                <TextInput
                  style={[styles.promoInput, { color: themeStyles.textColor, borderColor: themeStyles.borderColor }]}
                  placeholder="Enter Promo Code"
                  placeholderTextColor={themeStyles.secondaryText}
                  value={promoCode}
                  onChangeText={setPromoCode}
                />
                <Pressable
                  style={[
                    styles.promoButton,
                    {
                      backgroundColor: promoApplied ? themeStyles.successColor : themeStyles.primaryColor,
                      opacity: promoCode.length > 0 ? 1 : 0.7
                    }
                  ]}
                  onPress={applyPromoCode}
                  disabled={promoCode.length === 0 || promoApplied}
                >
                  <Text style={[styles.promoButtonText, {color: themeStyles.textColor}]}>
                    {promoApplied ? 'Applied' : 'Apply'}
                  </Text>
                </Pressable>
              </View>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <Text style={[styles.sectionTitle, { color: themeStyles.textColor }]}>
              Delivery Options
            </Text>

            <View style={styles.addressSection}>
              <View style={[styles.addressCard, { backgroundColor: themeStyles.cardBackground, borderColor: themeStyles.borderColor }]}>
                <View style={styles.addressHeader}>
                  <MaterialIcons name="place" size={16} color={themeStyles.primaryColor} />
                  <Text style={[styles.addressTitle, { color: themeStyles.textColor }]}>
                    Delivery Address
                  </Text>
                  <Pressable style={styles.changeAddressButton}>
                    <Text style={[styles.changeAddressText, { color: themeStyles.primaryColor }]}>
                      Change
                    </Text>
                  </Pressable>
                </View>

                <Text style={[styles.addressName, { color: themeStyles.textColor }]}>
                  {user?.name || 'John Doe'}
                </Text>
                <Text style={[styles.addressDetails, { color: themeStyles.secondaryText }]}>
                  123 Main Street, Apartment 4B
                </Text>
                <Text style={[styles.addressDetails, { color: themeStyles.secondaryText }]}>
                  Mumbai, Maharashtra 400001
                </Text>
                <Text style={[styles.addressDetails, { color: themeStyles.secondaryText }]}>
                  Phone: +91 98765 43210
                </Text>
              </View>
            </View>

            <View style={styles.deliveryOptionsContainer}>
              {renderDeliveryOption(
                'standard',
                'Standard Delivery',
                'Regular shipping via courier',
                '3-5 business days',
                deliveryFees.standard
              )}

              {renderDeliveryOption(
                'express',
                'Express Delivery',
                'Faster shipping priority handling',
                '1-2 business days',
                deliveryFees.express
              )}

              {renderDeliveryOption(
                'sameDay',
                'Same Day Delivery',
                'Ultra-fast local delivery',
                'Today (order before 2 PM)',
                deliveryFees.sameDay
              )}
            </View>
          </>
        )}

        {step === 3 && (
          <>
            <Text style={[styles.sectionTitle, { color: themeStyles.textColor }]}>
              Payment Method
            </Text>

            <View style={styles.paymentOptionsContainer}>
              {renderPaymentOption(
                'creditCard',
                'Credit/Debit Card',
                <MaterialIcons name="credit-card" size={20} color={paymentMethod === 'creditCard' ? themeStyles.primaryColor : themeStyles.secondaryText} />
              )}

              {renderPaymentOption(
                'upi',
                'UPI Payment',
                <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png' }} style={{ width: 20, height: 20 }} />
              )}

              {renderPaymentOption(
                'cod',
                'Cash on Delivery',
                <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2331/2331941.png' }} style={{ width: 20, height: 20 }} />
              )}
            </View>

            {paymentMethod === 'creditCard' && (
              <View style={[styles.cardDetailsContainer, { backgroundColor: themeStyles.cardBackground, borderColor: themeStyles.borderColor }]}>
                <Text style={[styles.cardDetailsTitle, { color: themeStyles.textColor }]}>
                  Card Details
                </Text>

                <View style={styles.cardFields}>
                  <TextInput
                    style={[styles.cardInput, { color: themeStyles.textColor, borderColor: themeStyles.borderColor }]}
                    placeholder="Card Number"
                    placeholderTextColor={themeStyles.secondaryText}
                    keyboardType="number-pad"
                    maxLength={19}
                  />

                  <View style={styles.cardRow}>
                    <TextInput
                      style={[styles.cardInputHalf, { color: themeStyles.textColor, borderColor: themeStyles.borderColor }]}
                      placeholder="MM/YY"
                      placeholderTextColor={themeStyles.secondaryText}
                      keyboardType="number-pad"
                      maxLength={5}
                    />

                    <TextInput
                      style={[styles.cardInputHalf, { color: themeStyles.textColor, borderColor: themeStyles.borderColor }]}
                      placeholder="CVC"
                      placeholderTextColor={themeStyles.secondaryText}
                      keyboardType="number-pad"
                      maxLength={3}
                    />
                  </View>

                  <TextInput
                    style={[styles.cardInput, { color: themeStyles.textColor, borderColor: themeStyles.borderColor }]}
                    placeholder="Cardholder Name"
                    placeholderTextColor={themeStyles.secondaryText}
                  />
                </View>

                <View style={styles.saveCardRow}>
                  <View style={[styles.checkBox, { borderColor: themeStyles.borderColor, backgroundColor: themeStyles.primaryColor }]}>
                    <Text style={styles.checkMark}>✓</Text>
                  </View>
                  <Text style={[styles.saveCardText, { color: themeStyles.secondaryText }]}>
                    Save card for future payments
                  </Text>
                </View>
              </View>
            )}
          </>
        )}

        <View style={[styles.orderSummary, { backgroundColor: themeStyles.cardBackground, borderColor: themeStyles.borderColor }]}>
          <Text style={[styles.orderSummaryTitle, { color: themeStyles.textColor }]}>
            Order Summary
          </Text>

          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: themeStyles.secondaryText }]}>
              Subtotal ({cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0)} items)
            </Text>
            <Text style={[styles.summaryValue, { color: themeStyles.textColor }]}>
              ₹{getSubtotal().toLocaleString('en-IN')}
            </Text>
          </View>

          {promoApplied && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: themeStyles.successColor }]}>
                Discount (WELCOME20)
              </Text>
              <Text style={[styles.summaryValue, { color: themeStyles.successColor }]}>
                -₹{getDiscount().toLocaleString('en-IN')}
              </Text>
            </View>
          )}

          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: themeStyles.secondaryText }]}>
              Shipping ({deliveryOption === 'standard' ? 'Standard' : deliveryOption === 'express' ? 'Express' : 'Same Day'})
            </Text>
            <Text style={[styles.summaryValue, { color: themeStyles.textColor }]}>
              ₹{getDeliveryFee().toLocaleString('en-IN')}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: themeStyles.secondaryText }]}>
              Tax (18% GST)
            </Text>
            <Text style={[styles.summaryValue, { color: themeStyles.textColor }]}>
              ₹{getTaxes().toLocaleString('en-IN')}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={[styles.totalLabel, { color: themeStyles.textColor }]}>
              Total Amount
            </Text>
            <Text style={[styles.totalValue, { color: themeStyles.primaryColor }]}>
              ₹{getTotal().toLocaleString('en-IN')}
            </Text>
          </View>
        </View>

        <View style={styles.securityNote}>
          <MaterialCommunityIcons name="shield-check" size={16} color={themeStyles.successColor} />
          <Text style={[styles.securityText, { color: themeStyles.secondaryText }]}>
            Secure checkout powered by industry-standard encryption.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: themeStyles.cardBackground, borderColor: themeStyles.borderColor }]}>
        {step > 1 && (
          <Pressable
            style={[styles.backStepButton, { borderColor: themeStyles.borderColor }]}
            onPress={() => setStep(prevStep => prevStep - 1)}
          >
            <Text style={[styles.backStepText, { color: themeStyles.textColor }]}>
              Back
            </Text>
          </Pressable>
        )}

        <Pressable
          style={[
            styles.nextStepButton,
            { backgroundColor: cartItems.length === 0 ? themeStyles.secondaryText : themeStyles.primaryColor },
            step === 1 && { flex: 1 }
          ]}
          onPress={() => {
            if (step < 3) {
              setStep(prevStep => prevStep + 1);
            } else {
              handleCheckout();
            }
          }}
          disabled={cartItems.length === 0 || loadingState}
        >
          {loadingState ? (
            <Text style={styles.nextStepText}>Processing...</Text>
          ) : (
            <Text style={styles.nextStepText}>
              {step === 3 ? 'Place Order' : 'Continue'}
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerRight: {
    width: 40,
  },
  progressContainer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  progressSteps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressStep: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressStepText: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressLine: {
    height: 2,
    width: 60,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 16,
  },
  itemCard: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemDescription: {
    fontSize: 12,
    marginVertical: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  quantityButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 8,
  },
  removeButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 16,
    overflow: 'hidden',
  },
  promoInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
  },
  promoButton: {
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  addressSection: {
    marginBottom: 16,
  },
  addressCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  changeAddressButton: {
    padding: 4,
  },
  changeAddressText: {
    fontSize: 14,
    fontWeight: '500',
  },
  addressName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  addressDetails: {
    fontSize: 14,
    lineHeight: 20,
  },
  deliveryOptionsContainer: {
    marginBottom: 16,
  },
  deliveryOption: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    alignItems: 'center',
  },
  deliveryOptionContent: {
    flex: 1,
  },
  deliveryOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  deliveryOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  deliveryOptionDesc: {
    fontSize: 14,
    marginBottom: 4,
  },
  deliveryOptionDays: {
    fontSize: 12,
  },
  deliveryOptionPriceSection: {
    alignItems: 'center',
  },
  deliveryOptionPrice: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  deliveryRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  paymentOptionsContainer: {
    marginBottom: 16,
  },
  paymentOption: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    alignItems: 'center',
  },
  paymentOptionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  paymentRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  cardDetailsContainer: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardDetailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  cardFields: {
    marginBottom: 16,
  },
  cardInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardInputHalf: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    width: '48%',
  },
  saveCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  saveCardText: {
    fontSize: 14,
  },
  orderSummary: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 16,
  },
  orderSummaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
  },
  nextStepButton: {
    flex: 2,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextStepText: {
    fontSize: 16,
    fontWeight: '600',
  },
  backStepButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backStepText: {
    fontSize: 16,
    fontWeight: '500',
  },
  emptyCart: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 16,
    marginBottom: 16,
  },
  continueShoppingButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  continueShoppingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  securityText: {
    fontSize: 12,
    marginLeft: 6,
  }
});

export default Checkout;
