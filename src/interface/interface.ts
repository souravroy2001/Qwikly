interface Categories {
  slug: string;
  name: string;
  url: string;
}

interface Products {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: {
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  images: string[];
  thumbnail: string;
}

interface ProductDataInterFace {
  products: Products[];
}

interface CategoriesNamedata {
  label: string;
  value: string;
}

interface ItemProps {
  product: Products;
  onPress: (product: Products) => void;
}

type logData = {
  name?: string;
  email: string;
  password: string;
};

export {
  Categories,
  Products,
  ProductDataInterFace,
  CategoriesNamedata,
  ItemProps,
  logData,
};
