interface ProductsTypes {
  id: number;
  name: string;
  price: string;
  category: string;
  imageUrl: string;
  description: string;
  brand: string;
  inStock: boolean;
  quantity: number;
  unit: string;
  discount: number;
  rating: number;
}

interface CustomHook {
  error: string;
  loading: boolean;
}

type CustomHookCall = CustomHook & ProductsTypes;

interface ProductComponentProps {
  product: ProductsTypes;
  onPress: (product: ProductsTypes) => void;
}

export {ProductsTypes, ProductComponentProps, CustomHookCall};
