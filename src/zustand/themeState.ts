import {useColorScheme} from 'react-native';
import {create} from 'zustand';

interface ThemeState {
  isDarkMode: 'dark' | 'light';
  toggleTheme: () => void;
}

const useThemeStore = create<ThemeState>(set => ({
  isDarkMode: 'dark',
  toggleTheme: (): void =>
    set(state => ({
      isDarkMode: state.isDarkMode === 'dark' ? 'light' : 'dark',
    })),
}));

export default useThemeStore;
