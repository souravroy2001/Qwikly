import { View, Text, StatusBar } from 'react-native'
import React from 'react'
import useAuthStore from 'zustand/authStore'

export default function Search() {
  const { isDarkMode } = useAuthStore()
  return (
    <View>
      <StatusBar backgroundColor={isDarkMode === "dark" ? "#124245" : "#f1eae2"} barStyle={isDarkMode === "dark" ? "light-content" : "dark-content"} />

      {
        /*
        <View style={[styles.searchBarContainer, searchFocused && styles.searchBarFocused]}>
  //     <FontAwesome name="search" size={18} color={themeStyles.secondaryTextColor} style={styles.searchIcon} />
  //     <Pressable
  //       style={styles.searchInput}
  //       onPress={() => navigate('Search')}
  //     >
  //       <Text style={{ color: themeStyles.secondaryTextColor }}>Search products...</Text>
  //     </Pressable>
  //     <Pressable style={styles.filterButton} onPress={() => navigate('Filter')}>
  //       <MaterialIcons name="filter-list" size={22} color={themeStyles.secondaryTextColor} />
  //     </Pressable>
  //   </View>
        */
      }

    </View>
  )
}
