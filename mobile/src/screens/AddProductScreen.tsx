import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, TextInput, Provider as PaperProvider } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { createProduct, updateProduct, Product } from '../api/api';

type AddProductScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddProduct'>;
type AddProductScreenRouteProp = RouteProp<RootStackParamList, 'AddProduct'>;

interface Props {
  navigation: AddProductScreenNavigationProp;
  route: AddProductScreenRouteProp;
}

const AddProductScreen: React.FC<Props> = ({ navigation, route }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const product: Product | undefined = route.params?.product;
  const isEditing = !!product;

  useEffect(() => {
    console.log('route.params.product:', route.params?.product);
    if (isEditing && product) {
      setName(product.name || '');
      setDescription(product.description || '');
      setPrice(product.price.toString());
    }
  }, [isEditing, product]);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    if (!name.trim() || !price.trim()) {
      setError('Name and price are required');
      setLoading(false);
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Price must be a valid positive number');
      setLoading(false);
      return;
    }

    try {
      const productData: Omit<Product, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
        name: name.trim(),
        description: description.trim() || undefined,
        price: priceNum,
      };

      if (isEditing && product?.id) {
        await updateProduct(product.id, productData);
      } else {
        await createProduct(productData);
      }

      navigation.navigate('ProductList', { refresh: true });
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Animatable.View animation="fadeInUp" duration={1000}>
          <Text style={styles.title}>{isEditing ? 'Edit Product' : 'Add Product'}</Text>
          {error ? (
            <Animatable.View animation="shake" duration={500}>
              <Text style={styles.error}>{error}</Text>
            </Animatable.View>
          ) : null}
          <TextInput
            label="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            theme={{ colors: { primary: '#6200ea' } }}
            disabled={loading}
          />
          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            multiline
            theme={{ colors: { primary: '#6200ea' } }}
            disabled={loading}
          />
          <TextInput
            label="Price"
            value={price}
            onChangeText={setPrice}
            style={styles.input}
            keyboardType="numeric"
            theme={{ colors: { primary: '#6200ea' } }}
            disabled={loading}
          />
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.button}
            theme={{ colors: { primary: '#6200ea' } }}
            disabled={loading}
            loading={loading}
          >
            {isEditing ? 'Update Product' : 'Create Product'}
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.button}
            theme={{ colors: { primary: '#6200ea' } }}
            disabled={loading}
          >
            Cancel
          </Button>
        </Animatable.View>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
    borderRadius: 8,
  },
  error: {
    color: '#fff',
    backgroundColor: '#d32f2f',
    padding: 10,
    borderRadius: 4,
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default AddProductScreen;