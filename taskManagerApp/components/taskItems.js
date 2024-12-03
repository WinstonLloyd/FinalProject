import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; // Import the FontAwesome icon set

const TaskItems = ({
    title,
    description,
    id,
    createdAt,
    dueDate,
    status,
    onDelete,
    onEdit,
    onUpdateStatus,
}) => {
  // Convert dates safely
    const formattedDueDate = new Date(dueDate).toLocaleDateString();
    const formattedCreatedAt = new Date(createdAt).toLocaleDateString();

    return (
        <View style={styles.taskItem}>
          {/* Task Details */}
            <View style={styles.taskDetails}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{title}</Text>
                <Text style={styles.description}>{description}</Text>
                <Text style={styles.dueDate}>Due: {formattedDueDate}</Text>
                <Text style={styles.createdAt}>Created: {formattedCreatedAt}</Text>
                <Text style={styles.status}>Status: {status}</Text>
            </View>

            {/* Update Status Button */}
            <TouchableOpacity onPress={() => onUpdateStatus(id, status)} style={styles.statusButton}>
                <Text style={styles.statusButtonText}>
                    {status === "Pending" ? "Check" : "Uncheck"}
                </Text>
            </TouchableOpacity>

            {/* Edit Button with Icon */}
            <TouchableOpacity onPress={() => onEdit(id)} style={styles.editButton}>
                <Icon name="pencil" size={20} color="blue" /> {/* FontAwesome pencil icon */}
            </TouchableOpacity>

            {/* Delete Button with Trash Can Icon */}
            <TouchableOpacity onPress={() => onDelete(id)} style={styles.deleteButton}>
                <Icon name="trash" size={20} color="red" /> {/* FontAwesome trash icon */}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    taskItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        marginVertical: 5,
    },
    taskDetails: {
        flex: 1,
        justifyContent: "center",
    },
    taskTitle: {
        fontSize: 18,
        color: "#333",
        fontWeight: "500",
    },
    description: {
        fontSize: 14,
        color: "#555",
        marginBottom: 5,
    },
    dueDate: {
        fontSize: 14,
        color: "gray",
    },
    createdAt: {
        fontSize: 14,
        color: "gray",
    },
    status: {
        fontSize: 14,
        color: "green",
        fontWeight: "bold",
    },
    statusButton: {
        marginRight: 10,
        padding: 5,
        backgroundColor: "#007BFF",
        borderRadius: 5,
    },
    statusButtonText: {
        color: "#fff",
        fontSize: 14,
    },
    editButton: {
        marginRight: 10,
    },
    deleteButton: {
        marginLeft: 10,
    },
});

export default TaskItems;