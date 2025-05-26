import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  ImageBackground,
  ScrollView,
  Dimensions,
} from "react-native";
import { 
  Button, 
  Provider as PaperProvider, 
  Card, 
  Title, 
  Paragraph, 
  Chip,
  Icon 
} from "react-native-paper";
import * as Animatable from "react-native-animatable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteProduct, getProducts, Product, User } from "../api/api";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import ProductCard from "../components/ProductCard";

const { width } = Dimensions.get('window');

type HomePageScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ProductList"
>;

interface Props {
  navigation: HomePageScreenNavigationProp;
}

const HomePageScreen: React.FC<Props> = ({ navigation }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Electronics', 'Clothing', 'Home', 'Beauty'];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }

        const token = await AsyncStorage.getItem("token");
        if (!token) {
          setError("Please login to view products");
        }

        const productsData = await getProducts();
        setProducts(productsData);
        setFeaturedProducts(productsData.slice(0, 3));
        
        if (!productsData.length) {
          setError("No products available");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load products");
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
      setFeaturedProducts(featuredProducts.filter((p) => p.id !== id));
    } catch (err) {
      setError("Failed to delete product");
    }
  };

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(product => product.name === 'book');

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Loading Products...</Text>
      </View>
    );
  }

  return (
    <PaperProvider>
      <ScrollView style={styles.container}>
        {/* Hero Section */}
        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroOverlay}>
            <Animatable.Text 
              animation="fadeInDown" 
              duration={1000}
              style={styles.heroTitle}
            >
              Summer Collection 2023
            </Animatable.Text>
            <Animatable.Text 
              animation="fadeInUp" 
              duration={1000}
              delay={300}
              style={styles.heroSubtitle}
            >
              Up to 50% Off Selected Items
            </Animatable.Text>
            <Animatable.View 
              animation="fadeInUp" 
              duration={1000}
              delay={600}
            >
              <Button 
                mode="contained" 
                style={styles.heroButton}
                labelStyle={styles.heroButtonText}
                onPress={() => navigation.navigate("AddProduct")}
              >
                Shop Now
              </Button>
            </Animatable.View>
          </View>
        </ImageBackground>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <Chip
                key={category}
                mode="outlined"
                selected={activeCategory === category}
                onPress={() => setActiveCategory(category)}
                style={[
                  styles.categoryChip,
                  activeCategory === category && styles.activeCategoryChip
                ]}
                textStyle={[
                  styles.categoryText,
                  activeCategory === category && styles.activeCategoryText
                ]}
              >
                {category}
              </Chip>
            ))}
          </ScrollView>
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            <Button 
              mode="text" 
              onPress={() => navigation.navigate("ProductList")}
              labelStyle={styles.seeAllText}
            >
              See All
            </Button>
          </View>
          <FlatList
            horizontal
            data={featuredProducts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ProductCard 
                product={item} 
                featured 
                onDelete={handleDelete}
                navigation={navigation}
              />
            )}
            contentContainerStyle={styles.featuredList}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* All Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Products</Text>
          {error ? (
            <Animatable.View animation="shake" duration={500}>
              <Text style={styles.error}>{error}</Text>
            </Animatable.View>
          ) : null}
          
          {filteredProducts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon source="emoticon-sad-outline" size={48} color="#6C63FF" />
              <Text style={styles.emptyText}>No products found</Text>
            </View>
          ) : (
            <FlatList
              data={filteredProducts}
              numColumns={2}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item, index }) => (
                <ProductCard
                  product={item}
                  index={index}
                  onDelete={handleDelete}
                  navigation={navigation}
                />
              )}
              contentContainerStyle={styles.productsGrid}
              scrollEnabled={false}
            />
          )}
        </View>

        {/* Call to Action */}
        <Card style={styles.ctaCard}>
          <Card.Content style={styles.ctaContent}>
            <Icon source="tag" size={40} color="#6C63FF" />
            <Title style={styles.ctaTitle}>Special Offers</Title>
            <Paragraph style={styles.ctaText}>
              Sign up now and get 15% off your first order!
            </Paragraph>
            <Button 
              mode="contained" 
              style={styles.ctaButton}
              onPress={() => navigation.navigate("SignUp")}
            >
              Join Now
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Floating Action Button */}
      {user && (
        <Animatable.View 
          animation="bounceInUp"
          duration={1000}
          style={styles.fabContainer}
        >
          <Button 
            mode="contained" 
            style={styles.fab}
            onPress={() => navigation.navigate("AddProduct")}
            icon="plus"
            contentStyle={styles.fabContent}
            labelStyle={styles.fabLabel}
          >
            Add Product
          </Button>
        </Animatable.View>
      )}
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    color: '#6C63FF',
    fontSize: 16,
  },
  hero: {
    height: 350,
    justifyContent: 'center',
    marginBottom: 24,
  },
  heroImage: {
    opacity: 0.9,
  },
  heroOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heroTitle: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  heroSubtitle: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  heroButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 5,
  },
  heroButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    color: '#6C63FF',
    fontSize: 14,
  },
  categoriesContainer: {
    paddingVertical: 8,
  },
  categoryChip: {
    marginRight: 8,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  activeCategoryChip: {
    backgroundColor: '#6C63FF',
    borderColor: '#6C63FF',
  },
  categoryText: {
    color: '#666',
  },
  activeCategoryText: {
    color: 'white',
  },
  featuredList: {
    paddingLeft: 16,
    paddingBottom: 8,
  },
  productsGrid: {
    paddingHorizontal: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 16,
    color: '#666',
    fontSize: 16,
  },
  error: {
    color: "#d32f2f",
    backgroundColor: "#ffebee",
    padding: 10,
    borderRadius: 4,
    textAlign: "center",
    marginBottom: 16,
  },
  ctaCard: {
    margin: 16,
    borderRadius: 12,
    backgroundColor: '#f0edff',
    elevation: 2,
  },
  ctaContent: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  ctaTitle: {
    color: '#6C63FF',
    marginTop: 16,
    marginBottom: 8,
  },
  ctaText: {
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 25,
    paddingHorizontal: 30,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    elevation: 5,
  },
  fab: {
    backgroundColor: '#6C63FF',
    borderRadius: 28,
    height: 56,
    paddingHorizontal: 20,
    elevation: 6,
  },
  fabContent: {
    height: '100%',
  },
  fabLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default HomePageScreen;