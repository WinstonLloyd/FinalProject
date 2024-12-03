import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Pressable,
  TextInput,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import Constants from "expo-constants";
import {
  app,
  db,
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  updateDoc,
  doc,
} from "./firebase/index";
import TaskItems from "./components/taskItems";
import Icon from "react-native-vector-icons/FontAwesome"; // Import the FontAwesome icon set

export default function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  // Add a new task
  const addTask = async () => {
    if (!title.trim()) {
      console.log("Task title is empty. Cannot add task.");
      return;
    }

    // Check if a due date is set
    if (!dueDate.trim()) {
      Alert.alert("Validation Error", "Please set a due date for the task.");
      return;
    }

    try {
      console.log("Adding task:", { title, dueDate });
      const docRef = await addDoc(collection(db, "tasks"), {
        title,
        description,
        isChecked: false,
        status: "Pending", // Auto-set status to "Pending"
        createdAt: new Date(),
        dueDate: dueDate,
      });
      console.log("Document written with ID: ", docRef.id);
      setTitle("");
      setDescription("");
      setDueDate("");
      fetchTasks();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const updateStatus = async (taskId, currentStatus) => {
    try {
      const newStatus = currentStatus === "Pending" ? "Completed" : "Pending";
      const taskDoc = doc(db, "tasks", taskId);
      await updateDoc(taskDoc, { status: newStatus });
      fetchTasks();
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  // Edit an existing task
  const editTask = async (taskId, newTitle, newDescription, newDueDate) => {
    if (!newTitle.trim()) {
      Alert.alert("Validation Error", "Please enter a valid task title.");
      return;
    }

    try {
      const taskDoc = doc(db, "tasks", taskId);
      await updateDoc(taskDoc, { title: newTitle, description: newDescription, dueDate: newDueDate });
      fetchTasks();
      setIsEditing(false);
      setEditingTaskId(null);
      setTitle("");
      setDescription("");
      setDueDate("");
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  // Fetch tasks from Firebase
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "tasks"));
      const fetchedTasks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
    setLoading(false);
  };

  // Delete a specific task
  const deleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Toggle task completion status
  const toggleCheck = async (taskId, currentStatus) => {
    try {
      const taskDoc = doc(db, "tasks", taskId);
      await updateDoc(taskDoc, { isChecked: !currentStatus });
      fetchTasks();
    } catch (error) {
      console.error("Error toggling task check status:", error);
    }
  };

  // Delete all tasks
  const deleteAllTasks = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "tasks"));
      const deletePromises = querySnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises);
      setTasks([]);
      console.log("All tasks deleted successfully!");
    } catch (error) {
      console.error("Error deleting all tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo */}
      <Image
        source={require("./assets/taskSphere.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Header Section */}
<View style={styles.header}>
  {/* Task count */}
  <Text style={styles.noTask}>{tasks.length}</Text>
  <Pressable onPress={deleteAllTasks} style={styles.trashAllButton}>
    <Icon name="trash" size={20} color="red" /> {/* Trash icon */}
    <Text style={styles.deleteText}>All</Text>
  </Pressable>
</View>

      {/* Task List */}
      {loading ? (
        <ActivityIndicator size="large" color="blue" style={{ marginTop: 20 }} />
      ) : tasks.length > 0 ? (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItems
              title={item.title}
              description={item.description}
              id={item.id}
              isChecked={item.isChecked}
              createdAt={item.createdAt?.toDate()}
              dueDate={item.dueDate} // Display due date as string
              status={item.status} // Pass status
              onDelete={deleteTask}
              onCheck={toggleCheck}
              onEdit={() => {
                setIsEditing(true);
                setEditingTaskId(item.id);
                setTitle(item.title);
                setDescription(item.description);
                setDueDate(item.dueDate);
              }}
              onUpdateStatus={updateStatus} // Pass update status function
            />
          )}
          style={styles.taskList}
        />
      ) : (
        <Text style={styles.noTaskText}>No tasks available</Text>
      )}
      <TextInput
        placeholder="Enter Title"
        style={styles.input}
        value={title}
        onChangeText={(text) => setTitle(text)}
      />
      <TextInput
        placeholder="Enter Description"
        style={styles.input}
        value={description} // Input for description
        onChangeText={(text) => setDescription(text)}
      />
      <TextInput
        placeholder="Enter due date (YYYY-MM-DD)"
        style={styles.input}
        value={dueDate}
        onChangeText={(text) => setDueDate(text)}
      />

      {/* Add/Edit Task Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          if (isEditing) {
            editTask(editingTaskId, title, description, dueDate);
          } else {
            addTask();
          }
        }}
      >
        <Text style={styles.addButtonText}>
          {isEditing ? "Save Changes" : "Add Task"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Constants.statusBarHeight,
    marginTop: 30,
  },
  logo: {
    position: "absolute",
    left: 10,
    top: 10,
    width: 100,
    height: 100,
  },
  header: {
    flexDirection: "row",
    width: "90%",
    alignSelf: "center",
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  noTask: {
    fontSize: 20,
    fontWeight: "800",
    marginRight: 20,
    color: "red",
  },
  noTaskText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
  input: {
    backgroundColor: "lightgray",
    padding: 10,
    fontSize: 17,
    width: "90%",
    alignSelf: "center",
    borderRadius: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 10,
    alignSelf: "center",
    width: "90%",
    alignItems: "center",
    marginBottom: 30,
  },
  addButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },
  deleteText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "black",
  },
});
