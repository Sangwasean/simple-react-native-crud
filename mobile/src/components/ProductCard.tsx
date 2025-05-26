import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { Product } from '../api/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type ProductListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductList'>;

interface Props {
  product: Product;
  index: number;
  onDelete: (id: string) => void;
  navigation: ProductListScreenNavigationProp;
}

const ProductCard: React.FC<Props> = ({ product, index, onDelete, navigation }) => {
  return (
    <Animatable.View animation="fadeInUp" duration={1000} delay={index * 100}>
      <Card elevation={3} style={styles.card}>
        <Card.Content>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productDescription}>
            {product.description || 'No description available'}
          </Text>
          <Text style={styles.price}>{product.price} RWF</Text>
          <View style={styles.actions}>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('AddProduct', { product })}
              style={styles.actionButton}
              theme={{ colors: { primary: '#6200ea' } }}
            >
              Edit
            </Button>
            <Button
              mode="outlined"
              onPress={() => onDelete(product.id)}
              style={styles.actionButton}
              theme={{ colors: { primary: '#d32f2f' } }}
            >
              Delete
            </Button>
          </View>
        </Card.Content>
      </Card>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    color: '#6200ea',
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  actionButton: {
    marginLeft: 8,
    borderWidth: 2,
  },
});

export default ProductCard;