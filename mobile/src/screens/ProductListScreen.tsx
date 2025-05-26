import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Button, Provider as PaperProvider } from "react-native-paper";
import * as Animatable from "react-native-animatable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteProduct, getProducts, Product, User } from "../api/api";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import ProductCard from "../components/ProductCard";

type ProductListScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ProductList"
>;

interface Props {
  navigation: ProductListScreenNavigationProp;
}

const ProductListScreen: React.FC<Props> = ({ navigation }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          console.log("User data:", parsedUser); // Debug
        } else {
          console.log("No user data found in AsyncStorage");
          setError("Please log in to view products");
        }

        const token = await AsyncStorage.getItem("token");
        console.log("Token:", token); // Debug
        if (!token) {
          setError("No authentication token found");
        }

        console.log("Fetching products...");
        const productsData = await getProducts();
        console.log("Processed products:", productsData); // Debug
        setProducts(productsData);
        if (!productsData.length) {
          setError("No products available");
        }
      } catch (err: any) {
        const errorMessage = err.message || "Failed to load products";
        setError(errorMessage);
        console.error("Load error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      setError("Failed to delete product");
      console.error("Delete error:", err);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6200ea" />
      </View>
    );
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Animatable.View animation="fadeInUp" duration={1000}>
          <Text style={styles.title}>Products</Text>
          {error ? (
            <Animatable.View animation="shake" duration={500}>
              <Text style={styles.error}>{error}</Text>
            </Animatable.View>
          ) : null}
          <View style={styles.headerButtons}>
            <Button
              mode="contained"
              onPress={() => navigation.navigate("Profile")}
              style={styles.button}
              theme={{ colors: { primary: "#6200ea" } }}
            >
              Profile
            </Button>
            <Button
              mode="contained"
              onPress={() => navigation.navigate("AddProduct")}
              style={styles.button}
              theme={{ colors: { primary: "#6200ea" } }}
            >
              Create Product
            </Button>
          </View>
        </Animatable.View>
        {products.length === 0 ? (
          <Text style={styles.noProducts}>No products available</Text>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) =>
              item.id ? item.id.toString() : Math.random().toString()
            }
            renderItem={({ item, index }) =>
              item && (
                <ProductCard
                  product={item}
                  index={index}
                  onDelete={handleDelete}
                  navigation={navigation}
                />
              )
            }
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 16,
  },
  headerButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    flexWrap: "wrap",
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  listContainer: {
    paddingBottom: 16,
  },
  noProducts: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  error: {
    color: "#d32f2f",
    backgroundColor: "#ffebee",
    padding: 10,
    borderRadius: 4,
    textAlign: "center",
    marginBottom: 16,
  },
});

export default ProductListScreen;
