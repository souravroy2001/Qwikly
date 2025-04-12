import { memo, useEffect, useState } from "react";
import { ProductComponentProps, ProductsTypes } from "../interface/productTypes";
import { ActivityIndicator, Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Products } from "interface/interface";
import Entypo from "react-native-vector-icons/Entypo";
import useAuthStore from "zustand/authStore";
// import Ionicons from "react-native-vector-icons/Ionicons"

const ProductComponent = memo(({ product, onPress }: ProductComponentProps) => {
    const { isDarkMode } = useAuthStore()
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [favorites, setFavorites] = useState<ProductsTypes[]>([]);

    function handleFavorite(product: ProductsTypes) {
        const isFavorite = favorites.some((item) => item.id === product.id);

        if (isFavorite) {
            setFavorites(prev => prev.filter(item => item.id !== product.id));
            Alert.alert("Removed from favorites");
        } else {
            setFavorites(prev => [...prev, product]);
            Alert.alert("Added to favorites");
        }
    }

    useEffect(() => {
        if (product?.imageUrl) {
            Image.prefetch(product?.imageUrl)
                .then(() => setIsImageLoaded(true))
                .catch(() => setIsImageLoaded(false))
        }
    }, [product?.imageUrl]);


    function handleActionBtn(product: Products): void {
        console.log(product);
    }

    function handleCartBtn(product: Products): void {
        console.log(product)
    }

    function handleRemoveBtn(id: number): void {
        console.log(id)
    }


    const isFavorite = favorites.some((item) => item.id === product.id);

    return (
        <Pressable onPress={() => onPress(product)} style={[styles.item, { backgroundColor: isDarkMode === "dark" ? "#124245" : "#FFF" }]}>
            <Pressable style={styles.favorite} onPress={() => handleFavorite(product)} >
                <Entypo name={isFavorite ? "heart" : "heart-outlined"} size={20} color="#FFF" />
            </Pressable>


            {!isImageLoaded ? (
                <ActivityIndicator size="large" color={isDarkMode === "dark" ? "#f1eae2" : "#124245"} style={styles.loader} />
            ) :
                <Image
                    source={{ uri: product.imageUrl }}
                    style={styles.ProductImage}
                    onLoad={() => setIsImageLoaded(true)}
                    onError={() => console.log("Image failed to load.")}
                />
            }


            <Text style={[styles.title, { color: isDarkMode === "dark" ? "#f1eae2" : "#124245" }]}>{product?.name}</Text>
            <View style={styles.priceContainer}>
                <Text style={[styles.price, { color: isDarkMode === "dark" ? "#f1eae2" : "#124245" }]}>₹ {product?.price}</Text>
                <Text style={[styles.discount, { color: isDarkMode === "dark" ? "#f47679" : "#F00" }]}>{product?.discount}% OFF</Text>
            </View>
            <View style={styles.productAction}>
                <Pressable style={styles.actionBtn}>
                    <Text style={styles.btnText}>Add to cart</Text>
                </Pressable>
                <Pressable style={[styles.actionBtn, { backgroundColor: isDarkMode === "dark" ? "#f1eae2" : "#124245" }]}>
                    <Text style={[styles.btnText, { color: isDarkMode === "dark" ? "#124245" : "#f1eae2" }]}>Buy now</Text>
                </Pressable>
            </View>
        </Pressable>
    );
});


const styles = StyleSheet.create({
    SpecialOfferBox: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        marginTop: 30,
    },
    favorite: {
        backgroundColor: "#f47679",
        width: 30,
        height: 30,
        borderRadius: "50%",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        zIndex: 2,
        right: 5,
        top: 5,
    },
    item: {
        borderRadius: 10,
        paddingBottom: 10,
        marginBottom: 10,
        width: "48%",
        position: "relative",
        overflow: "hidden"
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 5,
        paddingHorizontal: 5,
    },
    ProductImage: {
        width: "100%",
        height: 150,
    },
    priceContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 5,
        paddingHorizontal: 5,
    },
    price: {
        fontSize: 14,
        fontWeight: "bold",
    },
    discount: {
        fontSize: 14,
        fontWeight: "bold",
    },
    productAction: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        paddingHorizontal: 5,
    },
    actionBtn: {
        backgroundColor: "#f47679",
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 10,
        textAlign: "center",
    },
    btnText: {
        fontSize: 16,
        fontWeight: 600,
        color: "#FFF"
    },
    footer: {
        marginTop: 70,
    },
    loader: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
})


export default ProductComponent;
