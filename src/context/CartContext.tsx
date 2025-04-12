import { createContext, ReactNode, useState } from "react";
import { ProductDataInterFace, Products } from "../interface/interface";
import { Alert } from "react-native";

interface CartContextType {
    cartItems: Products[];
    addToCart: (product: Products) => void;
    removeCartItem: (id: number) => void;
}

export const CartContext = createContext<CartContextType | null>(null)

interface PropsType {
    children: ReactNode;
}

interface CartItemsType extends Products {
    quantity: number
}

function CartContextProvider({ children }: PropsType) {
    const [cartItems, setCartItems] = useState<CartItemsType[]>([])

    function addToCart(product: Products): void {
        const existingProduct = cartItems.find((item) => item.id === product.id)

        if (!existingProduct) {
            setCartItems((prev) => ([...prev, { ...product, quantity: 1 }]))
            Alert.alert("Product successfully added in cart")
        } else {
            const updateData = cartItems.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            );
            setCartItems(updateData);
            Alert.alert("Product quantity increased successful")
        }
    }

    function removeCartItem(id: number): void {
        const existingProduct = cartItems.find((item) => item.id === id)
        if (existingProduct && existingProduct?.quantity > 1) {
            const updateData = cartItems.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity - 1 } : item
            );
            setCartItems(updateData);
            Alert.alert("Product quantity decreased successful")
        } else {
            const updateData = cartItems.filter((item) => item.id !== id);
            setCartItems(updateData)
            Alert.alert("Product remove successful")
        }
    }

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeCartItem }}>
            {children}
        </CartContext.Provider>
    )
}

export default CartContextProvider;
