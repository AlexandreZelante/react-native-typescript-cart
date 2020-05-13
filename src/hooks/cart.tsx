import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Product): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  // console.log(products);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE
      const productsStorage = await AsyncStorage.getItem('@Desafio8:produtos');

      if (productsStorage) {
        setProducts(JSON.parse(productsStorage));
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      // TODO ADD A NEW ITEM TO THE CART
      const find = products.find(aProduct => aProduct.id === product.id);

      if (find) {
        const newProducts = products.map(aProduct => {
          if (aProduct.id === product.id) {
            return {
              ...aProduct,
              quantity: aProduct.quantity + 1,
            };
          }

          return aProduct;
        });

        setProducts(newProducts);
        AsyncStorage.setItem('@Desafio8:produtos', JSON.stringify(newProducts));
      } else {
        setProducts([...products, { ...product, quantity: 1 }]);
        AsyncStorage.setItem(
          '@Desafio8:produtos',
          JSON.stringify([...products, { ...product, quantity: 1 }]),
        );
      }
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      // TODO INCREMENTS A PRODUCT QUANTITY IN THE CART
      const newProducts = products.map(product => {
        if (product.id === id) {
          return {
            ...product,
            quantity: product.quantity + 1,
          };
        }

        return product;
      });

      setProducts(newProducts);
      AsyncStorage.setItem('@Desafio8:produtos', JSON.stringify(newProducts));
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART
      const filteredProducts = products.filter(product => {
        if (product.id === id && product.quantity <= 1) return false;
        return true;
      });

      // Se achou, ver se ele tem quantidade menor igual a 1, se tiver, remove ele
      const newProducts = filteredProducts.map(product => {
        if (product.id === id) {
          return {
            ...product,
            quantity: product.quantity - 1,
          };
        }
        return product;
      });

      setProducts(newProducts);
      AsyncStorage.setItem('@Desafio8:produtos', JSON.stringify(newProducts));
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
