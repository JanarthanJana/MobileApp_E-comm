import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View, TouchableOpacity, FlatList } from 'react-native';

export default function App() {
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [tasks, setTasks] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const [prices, setPrices] = useState([]);

  const [editIndex, setEditIndex] = useState(-1);

  const handleAddTask = () => {
    if (task) {
      if (editIndex !== -1) {
        //Edit existing task
        const updatedTasks = [...tasks];
        const updatedDescriptions = [...descriptions];
        const updatedprices = [...prices];

        updatedTasks[editIndex] = task;
        updatedDescriptions[editIndex] = description;
        updatedprices[editIndex] = price;

        setTasks(updatedTasks);
        updatedDescriptions(updatedDescriptions);
        updatedprices(updatedprices);

        setEditIndex(-1);
      }else {
        //Add New Task
        setTasks([...tasks, task])
        setDescriptions([...descriptions, description])
        setPrices([...prices, price])

        
      }
      setTask("");
      setDescription("");
      setPrice("");

    }
    
  }

  const renderItem = ({item, index}) => {
    return <View style={styles.task}>
      <Text style={styles.taskText}>{item}</Text>
      <View style={styles.taskActions}>
        <TouchableOpacity onPress={() => handleEditTask(index)}>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteTask(index)}>
          <Text style={styles.deleteButton}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  }

  const handleEditTask = (index) => {
    const taskToEdit = tasks[index];
    setTask(taskToEdit);
    setEditIndex(index);
  }

  const handleDeleteTask = (index) => {
   const updatedTasks = [...tasks];
   updatedTasks.splice(index,1);
   setTasks(updatedTasks);
    
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>E-commerce</Text>
      <Text style={styles.title}>Product Management</Text>
      <TextInput
        style={styles.input}
        placeholder='Enter product name'
        value={task}
        onChangeText={(text) => setTask(text)}
      />
      <TextInput
        style={styles.input}
        placeholder='Enter product description'
        value={description}
        onChangeText={(text) => setDescription(text)}
      />
      <TextInput
        style={styles.input}
        placeholder='Enter price'
        value={price}
        onChangeText={(text) => setPrice(text)}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddTask}
      >
        <Text style={styles.addButtonText}>
          {editIndex !== -1 ? "Update Task": "Add Task"}
        </Text>
      </TouchableOpacity>
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <FlatList
        data={prices}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <FlatList
        data={descriptions}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    marginTop: 40
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 7,
    color: "dodgerblue",
    textAlign:"center"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign:"center"

  },
  input: {
    borderWidth : 3,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    fontSize: 18
  },
  addButton: {
    backgroundColor: 'dodgerblue',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18
  },
  task : {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15
  },
  taskActions: {
    flexDirection: "row"
  },
  editButton: {
    color: "dodgerblue",
    fontWeight: "bold",
    fontSize: 18,
    marginRight: 10
  },
  deleteButton: {
    color: "red",
    fontWeight: "bold",
    fontSize: 18
  },
  taskText: {
    fontSize: 19
  }


});