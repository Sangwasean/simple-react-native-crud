import React, { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import {
  Button,
  Card,
  Text,
  Provider as PaperProvider,
} from "react-native-paper";
import * as Animatable from "react-native-animatable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../api/api";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Profile"
>;

interface Props {
  navigation: ProfileScreenNavigationProp;
}

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } else {
          setError("No user data found. Please log in.");
        }
      } catch (err) {
        setError("Failed to load user data");
        console.error("Error loading user:", err);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");
      navigation.replace("Login");
    } catch (err) {
      setError("Failed to log out");
      console.error("Error during logout:", err);
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
        <Animatable.View
          animation="fadeInUp"
          duration={1000}
          style={styles.cardContainer}
        >
          <Card elevation={5} style={styles.card}>
            <Card.Content>
              <Text style={styles.title}>Profile</Text>
              {error ? (
                <Animatable.View animation="shake" duration={500}>
                  <Text style={styles.error}>{error}</Text>
                </Animatable.View>
              ) : null}
              {user ? (
                <>
                  <Text style={styles.label}>Name:</Text>
                  <Text style={styles.value}>{user.name || "N/A"}</Text>
                  <Text style={styles.label}>Email:</Text>
                  <Text style={styles.value}>{user.email || "N/A"}</Text>
                </>
              ) : (
                <Text style={styles.noData}>No user data available</Text>
              )}
              <Button
                mode="contained"
                onPress={handleLogout}
                style={styles.button}
                theme={{ colors: { primary: "#6200ea" } }}
              >
                Logout
              </Button>
              <Button
                mode="text"
                onPress={() => navigation.navigate("ProductList")}
                style={styles.textButton}
                theme={{ colors: { primary: "#6200ea" } }}
              >
                Back to Products
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  cardContainer: {
    width: "90%",
    maxWidth: 400,
  },
  card: {
    borderRadius: 12,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  noData: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginVertical: 20,
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
    color: "#d32f2f",
    backgroundColor: "#ffebee",
    padding: 10,
    borderRadius: 4,
    textAlign: "center",
    marginBottom: 16,
  },
});

export default ProfileScreen;
