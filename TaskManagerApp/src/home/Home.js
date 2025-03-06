import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch user data from AsyncStorage on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("userData");
        if (storedData) {
          setUser(JSON.parse(storedData));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // ✅ Handle Logout (Clear AsyncStorage and go to Login screen)
  const handleLogout = async () => {
    await AsyncStorage.removeItem("userData");
    navigation.replace("Login");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ea" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require("../../../TaskManagerApp/assets/logo.jpg")} style={styles.logo} />

      {/* Welcome Message */}
      <Text style={styles.welcomeText}>Welcome, {user?.name || "User"}!</Text>
      <Text style={styles.description}>Manage your tasks efficiently with Task Manager.</Text>

      {/* Create Task Button */}
      <TouchableOpacity onPress={() => navigation.navigate("CreateTask", user)} style={styles.button}>
        <Text style={styles.buttonText}>Create Task</Text>
      </TouchableOpacity>

      {/* Show Tasks Button */}
      <TouchableOpacity onPress={() => navigation.navigate("TaskList", user)} style={styles.button}>
        <Text style={styles.buttonText}>Show Tasks</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity onPress={handleLogout} style={[styles.button, styles.logoutButton]}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "#f5f5f5",
    // paddingHorizontal: 20,
    // margin:20
  },
  logo: {
   width:"100%",
   height:"50%",
    // resizeMode: "contain",
    // marginBottom: 20,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6200ea",
    marginBottom: 10,
    textAlign:"center"
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#6200ea",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    margin:20
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#d32f2f", // Red color for logout button
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
});

export default Home;
