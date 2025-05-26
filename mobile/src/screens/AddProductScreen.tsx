import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { TextInput, Button, Card, Provider as PaperProvider } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { createProduct, updateProduct, Product } from '../api/api';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type AddProductScreenRouteProp = RouteProp<RootStackParamList, 'AddProduct'>;
type AddProductScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddProduct'>;

interface Props {
  route: AddProductScreenRouteProp;
  navigation: AddProductScreenNavigationProp;
}

const AddProductScreen: React.FC<Props> = ({ route, navigation }) => {
  const product = route.params?.product;
  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const productData = { name, description, price: parseFloat(price) };
      if (product && product.id) {
        await updateProduct(product.id, productData);
      } else {
        await createProduct(productData);
      }
      navigation.goBack();
    } catch (err) {
      setError('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Animatable.View animation="fadeInUp" duration={1000} style={styles.cardContainer}>
          <Card elevation={5} style={styles.card}>
            <Card.Content>
              <Text style={styles.title}>{product ? 'Edit Product' : 'Add Product'}</Text>
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
                mode="outlined"
                theme={{ colors: { primary: '#6200ea' } }}
                disabled={loading}
              />
              <TextInput
                label="Description"
                value={description}
                onChangeText={setDescription}
                style={styles.input}
                mode="outlined"
                theme={{ colors: { primary: '#6200ea' } }}
                disabled={loading}
              />
              <TextInput
                label="Price"
                value={price}
                onChangeText={setPrice}
                style={styles.input}
                mode="outlined"
                theme={{ colors: { primary: '#6200ea' } }}
                keyboardType="numeric"
                disabled={loading}
              />
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.button}
                loading={loading}
                disabled={loading}
                theme={{ colors: { primary: '#6200ea' } }}
              >
                {product ? 'Update' : 'Create'}
              </Button>
              <Button
                mode="text"
                onPress={() => navigation.goBack()}
                style={styles.textButton}
                theme={{ colors: { primary: '#6200ea' } }}
                disabled={loading}
              >
                Cancel
              </Button>
            </Card.Content>
          </Card>
        </Animatable.View>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  cardContainer: {
    width: '90%',
    maxWidth: 400,
  },
  card: {
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  textButton: {
    marginTop: 8,
  },
  error: {
    color: '#d32f2f',
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 4,
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default AddProductScreen;