import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { TextInput, Button, Card, Provider as PaperProvider } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { register } from '../api/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

interface Props {
  navigation: SignUpScreenNavigationProp;
}

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    setError('');
    try {
      await register(name, email, password);
      navigation.replace('Login', { email }); // Pass email to prefill login
    } catch (err) {
      setError('Registration failed');
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
              <Text style={styles.title}>Create Account</Text>
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
                label="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                mode="outlined"
                theme={{ colors: { primary: '#6200ea' } }}
                disabled={loading}
                keyboardType="email-address"
              />
              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                mode="outlined"
                theme={{ colors: { primary: '#6200ea' } }}
                disabled={loading}
              />
              <Button
                mode="contained"
                onPress={handleSignUp}
                style={styles.button}
                loading={loading}
                disabled={loading}
                theme={{ colors: { primary: '#6200ea' } }}
              >
                {loading ? 'Signing up...' : 'Sign Up'}
              </Button>
              <Button
                mode="text"
                onPress={() => navigation.navigate('Login')}
                style={styles.textButton}
                theme={{ colors: { primary: '#6200ea' } }}
                disabled={loading}
              >
                Back to Login
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

export default SignUpScreen;