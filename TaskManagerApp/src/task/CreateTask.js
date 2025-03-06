import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DropDownPicker from "react-native-dropdown-picker"; // ✅ Import Dropdown
import { url } from "../constant";

const CreateTask = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [jwtToken, setJwtToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]); // Store users list
  const [selectedUser, setSelectedUser] = useState(null); // Selected user for task assignment
  const [role, setRole] = useState("user"); // User role
  const [open, setOpen] = useState(false); // Dropdown state

  // ✅ Retrieve JWT Token & User Role from AsyncStorage
  useEffect(() => {
    const getToken = async () => {
      try {
        const storedData = await AsyncStorage.getItem("userData");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setJwtToken(parsedData.token);
          setRole(parsedData.role);
          if (parsedData.role === "admin") {
            fetchUsers(parsedData.token);
          }
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      } finally {
        setLoading(false);
      }
    };

    getToken();
  }, []);

  // ✅ Fetch Users (Only for Admins)
  const fetchUsers = async (token) => {
    try {
      const response = await fetch(`${url}/users/all-users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        setUsers(data.map((user) => ({ label: user.name, value: user._id }))); // ✅ Convert users into dropdown format
      } else {
        console.log("Error fetching users:", data);
      }
    } catch (error) {
      console.error("Server error fetching users:", error);
    }
  };

  // ✅ Handle Task Creation
  const handleCreateTask = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Title is required");
      return;
    }

    if (!jwtToken) {
      Alert.alert("Error", "Authentication failed. Please log in again.");
      navigation.replace("Login");
      return;
    }

    const taskData = {
      title,
      description,
    };

    // If admin assigns a task, include assignedUserId
    if (role === "admin" && selectedUser) {
      taskData.assignedUserId = selectedUser;
    }

    try {
      const response = await fetch(`${url}/tasks/createTask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(taskData),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Task created successfully");
        navigation.navigate("TaskList");
        setTitle("");
        setDescription("");
        setSelectedUser(null);
      } else {
        Alert.alert("Error", data.message || "Task creation failed");
        console.log("Error:", data);
      }
    } catch (error) {
      Alert.alert("Error", "Server not reachable");
    }
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
      <Text style={styles.title}>Create New Task</Text>
      <TextInput mode="outlined" label="Task Title" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput mode="outlined" label="Task Description" value={description} onChangeText={setDescription} style={styles.input} multiline />

      {/* Admin Selects User to Assign Task */}
      {role === "admin" && (
        <View style={styles.dropdownContainer}>
          <Text style={styles.label}>Assign Task To:</Text>
          <DropDownPicker
            open={open}
            value={selectedUser}
            items={users}
            setOpen={setOpen}
            setValue={setSelectedUser}
            setItems={setUsers}
            placeholder="Select a User"
            containerStyle={{ height: 50 }}
            style={styles.dropdown}
            dropDownStyle={{ backgroundColor: "#fafafa" }}
          />
        </View>
      )}

      <TouchableOpacity onPress={handleCreateTask} style={styles.button}>
        <Text style={styles.buttonText}>Create Task</Text>
      </TouchableOpacity>
    </View>
  );
};

// ✅ Styles
const styles = StyleSheet.create({
  container: { margin: 20 },
  title: { fontSize: 22, fontWeight: "bold", color: "#6200ea", marginBottom: 20 },
  input: { marginBottom: 10 },
  dropdownContainer: { marginBottom: 10 },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 5, color: "#6200ea" },
  dropdown: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10 },
  button: { backgroundColor: "#6200ea", paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8, marginTop: 10 },
  buttonText: { color: "white", fontSize: 16, fontWeight: "600", textAlign: "center" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" },
});

export default CreateTask;
