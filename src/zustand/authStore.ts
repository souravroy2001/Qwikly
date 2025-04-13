import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import EncryptedStorage from 'react-native-encrypted-storage';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {Alert} from 'react-native';
import {ProductsTypes} from 'interface/productTypes';

type Notification = {
  title: string;
  description: string;
  id?: number;
  read?: boolean;
  icon: string;
  timestamp?: number;
  timeAgo?: string;
};

type OrderType = {
  orderId: string;
  total: number;
  items: ProductsTypes[];
  createdAt?: string;
  status?: string;
};

type UserData = {
  uid: string;
  email: string;
  name: string;
  userName: string;
  createdAt: number;
  photoURL: string;
  notifications: Notification[];
  favorites: ProductsTypes[];
  cart: ProductsTypes[];
};
type ThemeMode = 'light' | 'dark';

type AuthState = {
  isLogin: boolean;
  user: UserData | null;
  showSplash: boolean;
  isDarkMode: ThemeMode;
  favorites: ProductsTypes[];
  cartItems: ProductsTypes[];
  notifications: Notification[];
  orders: OrderType[];
  toggleTheme: (defaultMode?: ThemeMode) => void;
  register: (data: {
    email: string;
    password: string;
    name: string;
    userName: string;
  }) => Promise<void>;
  login: (data: {email: string; password: string}) => Promise<void>;
  logout: () => Promise<void>;
  toggleShowSplash: () => void;
  updateProfile: (data: {url: string}) => void;
  handleFavorite: (product: ProductsTypes) => void;
  handleCart: (product: ProductsTypes) => void;
  cartItemDecreaseQuantity: (product: ProductsTypes) => void;
  cartItemRemove: (product?: ProductsTypes) => void;
  handleNotification: (notification: Notification) => void;
  createOrder: (data: {
    orderId: string;
    total: number;
    items: ProductsTypes[];
  }) => void;
};

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLogin: false,
      user: null,
      showSplash: true,
      isDarkMode: 'dark',
      favorites: [],
      cartItems: [],
      notifications: [],
      orders: [],

      syncUserData: async () => {
        const user = auth().currentUser;
        if (!user) return;

        const snapshot = await database()
          .ref(`/users/${user.uid}`)
          .once('value');
        const data = snapshot.val();

        if (data) {
          set({
            user: data,
            favorites: data.favorites || [],
            cartItems: data.cart || [],
            notifications: data.notifications || [],
            orders: data.orders || [],
          });
        }
      },
      toggleTheme: (defaultMode?: ThemeMode): void =>
        set(state => ({
          isDarkMode: defaultMode
            ? defaultMode
            : state.isDarkMode === 'dark'
            ? 'light'
            : 'dark',
        })),
      toggleShowSplash: () => {
        set(() => ({
          showSplash: false,
        }));
      },

      handleNotification: notification => {
        const user = auth().currentUser;

        if (!user) {
          Alert.alert('No Active Session', 'Please log in to continue.');
          return;
        }

        const newNotification: Notification = {
          id: Date.now(),
          title: notification.title,
          description: notification.description,
          icon: notification.icon || '',
          read: false,
          timestamp: Date.now(),
        };

        const updatedNotifications = [...get().notifications, newNotification];

        database()
          .ref(`users/${user.uid}/notifications`)
          .set(updatedNotifications);

        set({notifications: updatedNotifications});
      },

      markNotificationAsRead: async (id: number) => {
        set(state => {
          const updated = state.notifications.map(n =>
            n.id === id ? {...n, read: true} : n,
          );

          const user = auth().currentUser;
          if (user) {
            database().ref(`users/${user.uid}/notifications`).set(updated);
          }

          return {notifications: updated};
        });
      },

      clearAllNotifications: async () => {
        set(() => {
          const user = auth().currentUser;
          if (user) {
            database().ref(`users/${user.uid}/notifications`).set([]);
          }

          return {notifications: []};
        });
      },

      handleFavorite: async product => {
        set(state => {
          try {
            const user = auth().currentUser;

            if (!user) {
              Alert.alert('No Active Session', 'Please log in to continue.');
              return state;
            }

            const isFavorite = state.favorites.some(
              item => item.id === product.id,
            );

            const updatedFavorites = isFavorite
              ? state.favorites.filter(item => item.id !== product.id)
              : [...state.favorites, product];

            const updatedState = {
              favorites: updatedFavorites,
            };

            get().handleNotification({
              title: isFavorite
                ? 'Removed from Favorites'
                : 'Added to Favorites',
              description: `Product "${product.name}" was ${
                isFavorite ? 'removed from' : 'added to'
              } your favorites.`,
              icon: 'heart',
            });

            database().ref(`users/${user.uid}/favorites`).set(updatedFavorites);

            Alert.alert(
              isFavorite ? 'Removed from favorites' : 'Added to favorites',
              isFavorite
                ? 'The product has been removed from your favorites.'
                : 'The product has been successfully added to your favorites.',
            );

            return updatedState;
          } catch (error: any) {
            Alert.alert(
              'Update Failed',
              error.message ||
                'We couldn’t update your favorites. Please try again.',
            );
            return state;
          }
        });
      },

      handleCart: async product => {
        const user = auth().currentUser;

        if (!user) {
          Alert.alert('No Active Session', 'Please log in to continue.');
          return;
        }

        const state = get();
        const existingProduct = state.cartItems.find(
          item => item.id === product.id,
        );

        let updatedCart;
        let notification;

        if (!existingProduct) {
          updatedCart = [...state.cartItems, {...product, quantity: 1}];
          notification = {
            title: 'Added to Cart',
            description: `Product "${product.name}" has been added to your cart.`,
            icon: 'shopping-cart',
          };
        } else {
          updatedCart = state.cartItems.map(item =>
            item.id === product.id
              ? {...item, quantity: item.quantity + 1}
              : item,
          );
          notification = {
            title: 'Cart Updated',
            description: `Increased quantity of "${product.name}" in your cart.`,
            icon: 'shopping-cart',
          };
        }

        await database().ref(`users/${user.uid}/cart`).set(updatedCart);

        set({cartItems: updatedCart});

        get().handleNotification(notification);

        Alert.alert(notification.title, notification.description);
      },

      cartItemDecreaseQuantity: async product => {
        set(state => {
          try {
            const user = auth().currentUser;

            if (!user) {
              Alert.alert('No Active Session', 'Please log in to continue.');
              return state;
            }

            const existingProduct = state.cartItems.find(
              item => item.id === product.id,
            );

            if (!existingProduct) {
              Alert.alert(
                'Item Not Found',
                'This product is not in your cart.',
              );
              return state;
            }

            let updatedCart;

            if (existingProduct.quantity <= 1) {
              updatedCart = state.cartItems.filter(
                item => item.id !== product.id,
              );
            } else {
              updatedCart = state.cartItems.map(item =>
                item.id === product.id
                  ? {...item, quantity: item.quantity - 1}
                  : item,
              );
            }

            const updatedState = {cartItems: updatedCart};

            database().ref(`users/${user.uid}/cart`).set(updatedCart);

            return updatedState;
          } catch (error: any) {
            Alert.alert(
              'Update Failed',
              error.message || 'Could not update your cart. Please try again.',
            );
            return state;
          }
        });
      },

      cartItemRemove: async (product?: ProductsTypes) => {
        set(state => {
          try {
            const user = auth().currentUser;

            if (!user) {
              Alert.alert('No Active Session', 'Please log in to continue.');
              return state;
            }

            let updatedCart: ProductsTypes[] = [];

            if (product) {
              updatedCart = state.cartItems.filter(
                item => item.id !== product.id,
              );
            }

            const updatedState = {cartItems: updatedCart};

            database().ref(`users/${user.uid}/cart`).set(updatedCart);

            Alert.alert('Item Removed', 'Product removed from your cart.');

            return updatedState;
          } catch (error: any) {
            Alert.alert(
              'Removal Failed',
              error.message || 'Could not remove item. Please try again.',
            );
            return state;
          }
        });
      },

      createOrder: async ({orderId, total, items}: OrderType) => {
        try {
          const user = auth().currentUser;

          if (!user) {
            Alert.alert('No Active Session', 'Please log in to continue.');
            return;
          }

          const orderData = {
            orderId,
            total,
            items,
            createdAt: new Date().toISOString(),
            status: 'processing',
          };

          const userOrdersRef = database().ref(`users/${user.uid}/orders`);

          const snapshot = await userOrdersRef.once('value');
          const existingOrders = snapshot.val() || {};

          existingOrders[orderId] = orderData;

          await userOrdersRef.set(existingOrders);

          set(state => {
            const updatedOrders = [...state.orders, orderData];
            return {orders: updatedOrders};
          });

          Alert.alert(
            'Order Placed',
            `Your order (${orderId}) has been successfully placed!`,
          );

          const notification = {
            title: 'Order Placed',
            description: `Order #${orderId} has been placed successfully.`,
            icon: 'shopping-bag',
          };
          get().handleNotification(notification);
        } catch (error: any) {
          Alert.alert('Order Failed', error.message || 'Something went wrong.');
        }
      },

      updateProfile: async ({url}) => {
        try {
          const user = auth().currentUser;

          if (!user) {
            Alert.alert('No Active Session', 'Please log in to continue.');
            return;
          }

          await user.updateProfile({photoURL: url});

          await database().ref(`users/${user.uid}/photoURL`).set(url);

          set(state => ({
            user: {
              ...state.user!,
              photoURL: url,
            },
          }));

          Alert.alert(
            'Success',
            'Your profile photo has been updated successfully!',
          );
        } catch (error: any) {
          Alert.alert(
            'Update Failed',
            error.message ||
              'We couldn’t update your profile photo. Please try again.',
          );
        }
      },

      register: async ({email, password, name, userName}) => {
        try {
          const userCredential = await auth().createUserWithEmailAndPassword(
            email,
            password,
          );

          await userCredential.user.updateProfile({
            displayName: name,
          });

          const uid = userCredential.user.uid;

          const userData: UserData = {
            uid,
            email,
            name,
            userName,
            photoURL: '',
            notifications: [],
            favorites: [],
            cart: [],
            createdAt: Date.now(),
          };

          await database().ref(`/users/${uid}`).set(userData);

          set({user: userData, isLogin: true, showSplash: false});

          get().handleNotification({
            title: 'Welcome to the App 🎉',
            description: `Hello ${name}, your account was created successfully.`,
            icon: 'user-plus',
          });

          Alert.alert(
            '🎉 Registration Successful',
            'Your account has been created successfully!',
          );
        } catch (error: any) {
          if (error.code === 'auth/email-already-in-use') {
            Alert.alert(
              '❗ Email In Use',
              'That email address is already registered.',
            );
          } else if (error.code === 'auth/invalid-email') {
            Alert.alert(
              '❗ Invalid Email',
              'Please enter a valid email address.',
            );
          } else {
            Alert.alert(
              '❗ Registration Failed',
              error.message ||
                'Something went wrong while creating your account.',
            );
          }
        }
      },

      login: async ({email, password}) => {
        try {
          const userCredential = await auth().signInWithEmailAndPassword(
            email,
            password,
          );
          const uid = userCredential.user.uid;

          const snapshot = await database().ref(`/users/${uid}`).once('value');
          const userData: UserData = snapshot.val();

          if (userData) {
            set({user: userData, isLogin: true, showSplash: false});

            get().handleNotification({
              title: 'Welcome Back 🎉',
              description: `Glad to see you again, ${userData.name}!`,
              icon: 'login',
            });

            Alert.alert(
              '🎉 Welcome Back',
              `Glad to see you again, ${userData.name}!`,
            );
          } else {
            Alert.alert(
              '⚠️ Data Error',
              'User data not found in the database.',
            );
          }
        } catch (error: any) {
          if (error.code === 'auth/user-not-found') {
            Alert.alert(
              '❌ User Not Found',
              'No account found with this email address.',
            );
          } else if (error.code === 'auth/wrong-password') {
            Alert.alert(
              '❌ Incorrect Password',
              'The password you entered is incorrect.',
            );
          } else if (error.code === 'auth/invalid-email') {
            Alert.alert('❌ Invalid Email', 'Please check your email format.');
          } else {
            Alert.alert(
              '❗ Login Failed',
              error.message || 'Unable to login. Please try again later.',
            );
          }
        }
      },

      logout: async () => {
        try {
          await auth().signOut();
          set({user: null, isLogin: false, showSplash: true});

          get().handleNotification({
            title: 'Goodbye 👋',
            description: 'You have successfully logged out.',
            icon: 'logout',
          });

          Alert.alert(
            '👋 Logged Out',
            'You have been successfully logged out.',
          );
        } catch (error: any) {
          Alert.alert(
            '❗ Logout Failed',
            error.message || 'Something went wrong while logging out.',
          );
        }
      },
    }),
    {
      name: 'secure-auth-storage',
      storage: createJSONStorage(() => EncryptedStorage),
    },
  ),
);

export default useAuthStore;
