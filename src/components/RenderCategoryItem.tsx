import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { navigate } from "routers/NavigationService";
import useAuthStore from "zustand/authStore";

const RenderCategoryItem = ({ item }: { item: any }) => {
    const { isDarkMode } = useAuthStore();
    const themeStyles = {
        cardColor: isDarkMode === "dark" ? "#1a5456" : "#ffffff",
        textColor: isDarkMode === "dark" ? "#f1eae2" : "#333333",
    };

    return (
        <Pressable
            style={[styles.categoryItem, { backgroundColor: themeStyles.cardColor }]}
            onPress={() => navigate('Shop', { category: item.category })}
        >
            <View style={styles.categoryImageContainer}>
                <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.categoryImage}
                    resizeMode="cover"
                />
            </View>
            <Text style={[styles.categoryTitle, { color: themeStyles.textColor }]}>
                {item.category}
            </Text>
        </Pressable>
    )
};

const styles = StyleSheet.create({
    categoriesContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    categoryItem: {
        width: 80,
        marginRight: 16,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    categoryImageContainer: {
        width: 80,
        height: 80,
        overflow: 'hidden',
    },
    categoryImage: {
        width: '100%',
        height: '100%',
    },
    categoryTitle: {
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'center',
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
})


export default RenderCategoryItem;
