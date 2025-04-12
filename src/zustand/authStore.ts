import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import EncryptedStorage from 'react-native-encrypted-storage';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {Alert} from 'react-native';

type Notification = {
  title: string;
  description: string;
};

type UserData = {
  uid: string;
  email: string;
  name: string;
  userName: string;
  createdAt: number;
  photoURL: string;
  notification: Notification[];
};
type ThemeMode = 'light' | 'dark';

type AuthState = {
  isLogin: boolean;
  user: UserData | null;
  showSplash: boolean;
  isDarkMode: ThemeMode;
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
};

const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      isLogin: false,
      user: null,
      showSplash: true,
      isDarkMode: 'dark',
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
            notification: [],
            createdAt: Date.now(),
          };

          await database().ref(`/users/${uid}`).set(userData);

          set({user: userData, isLogin: true, showSplash: false});

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
