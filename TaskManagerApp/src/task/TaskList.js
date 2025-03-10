import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { url } from "../constant";

const TaskList = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [jwtToken, setJwtToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Retrieve JWT Token from AsyncStorage
  useEffect(() => {
    const getToken = async () => {
      try {
        const storedData = await AsyncStorage.getItem("userData");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setJwtToken(parsedData.token);
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      } finally {
        setLoading(false);
      }
    };

    getToken();
  }, []);

  // ✅ Fetch Tasks from Backend
  useEffect(() => {
    if (jwtToken) {
      fetchTasks();
    }
  }, [jwtToken]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${url}/tasks/getTask`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);
      const text = await response.text();
      console.log("Response text:", text);

      const data = JSON.parse(text);
      setTasks(data);
      console.log("data",data);
      
    } catch (error) {
      console.error("Error fetching tasks:", error);
      Alert.alert("Error", "Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Task Deletion
  const handleDeleteTask = async (taskId) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const response = await fetch(`${url}/tasks/deleteTask/${taskId}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${jwtToken}`,
                "Content-Type": "application/json",
              },
            });

            if (response.ok) {
              setTasks(tasks.filter((task) => task._id !== taskId));
              Alert.alert("Success", "Task deleted successfully");
            } else {
              Alert.alert("Error", "Failed to delete task");
            }
          } catch (error) {
            console.error("Error deleting task:", error);
            Alert.alert("Error", "Server not reachable");
          }
        },
      },
    ]);
  };

  // ✅ Handle Task Editing (Navigate to Edit Task Screen)
  const handleEditTask = (task) => {
    navigation.navigate("EditTask", { task, jwtToken });
  };

  // ✅ Show Loading Spinner
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ea" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Tasks</Text>
      {tasks.length === 0 ? (
        <Text style={styles.noTasksText}>No tasks found</Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.task}>
              <View style={styles.taskContent}>
                <View>
                  <Text style={styles.taskTitle}>Title: {item.title}</Text>
                  <Text>Description: {item.description}</Text>
                  <Text>Status: {item.status}</Text>
                  <Text>Assign To: {item?.userId?.name?item?.userId?.name:"self"}</Text>
                </View>

                {/* Edit & Delete Buttons */}
                <View style={styles.iconContainer}>
                  <TouchableOpacity onPress={() => handleEditTask(item)} style={styles.iconButton}>
                    <Icon name="pencil" size={24} color="#ff9800" />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleDeleteTask(item._id)} style={styles.iconButton}>
                    <Icon name="delete" size={24} color="#d32f2f" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      )}

      {/* Refresh Button */}
      <TouchableOpacity onPress={fetchTasks} style={styles.button}>
        <Text style={styles.buttonText}>Refresh Tasks</Text>
      </TouchableOpacity>
    </View>
  );
};

// ✅ Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", color: "#6200ea", marginBottom: 10 },
  task: { backgroundColor: "white", padding: 15, marginVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: "#ccc" },
  taskContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  taskTitle: { fontSize: 18, fontWeight: "bold" },
  iconContainer: { flexDirection: "row" },
  iconButton: { padding: 8, marginHorizontal: 4 },
  button: { backgroundColor: "#6200ea", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, alignItems: "center", marginTop: 15 },
  buttonText: { color: "white", fontSize: 16, fontWeight: "600" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" },
  noTasksText: { textAlign: "center", fontSize: 16, color: "#666", marginTop: 20 },
});

export default TaskList;
