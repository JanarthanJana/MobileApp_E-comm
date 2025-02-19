import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Feather from "react-native-vector-icons/Feather"; // Import Feather Icon

const API_URL = "http://192.168.1.9:5000/api/products"; // API URL

const ProductManager = () => {
  const [name, setName] = useState(""); // State for name
  const [description, setDescription] = useState(""); // State for description
  const [price, setPrice] = useState(""); // State for price
  const [products, setProducts] = useState([]); // State for products
  const [editId, setEditId] = useState(null); // State for editId
  const [showForm, setShowForm] = useState(false); // State for showForm
  const [image, setImage] = useState(null); // State for image

  useEffect(() => {
    fetchProducts();
  }, [products]); // Fetch products when products state changes

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL); // Fetch products from API
      const data = await response.json(); // Parse JSON response
      setProducts(data); // Update products state
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync(); // Request media library permissions
    if (status !== "granted") { // If permissions are not granted
      alert("Permission denied! Please allow access to photos.");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({ // Launch image library
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Select images
      allowsEditing: true, // Allow editing
      aspect: [4, 3], // Aspect ratio
      quality: 1, // Quality
    });
    if (!result.canceled) { // If image is selected
      setImage(result.assets[0].uri); // Update image state
    }
  };

  const handleAddOrUpdateProduct = async () => { // Handle add or update product
    if (!name || !description || !price) return; // Check if fields are empty
    let formData = new FormData(); // Create form data
    formData.append("name", name); // Add name to form data
    formData.append("description", description); // Add description to form data
    formData.append("price", parseFloat(price)); // Add price to form data
    if (image) { // If image is selected
      formData.append("image", { 
        uri: image,
        type: "image/jpeg",
        name: "product.jpg",
      }); // Add image to form data
    }
    try {
      const response = await fetch(
        editId !== null ? `${API_URL}/${editId}` : API_URL, // Determine the URL based on whether it's an update or add operation
        {
          method: editId !== null ? "PUT" : "POST",  // Use PUT for update, POST for add
          headers: {
            "Content-Type": "multipart/form-data", // Set the content type for FormData
          },
          body: formData,  // Send the FormData as the request body
        }
      );
      if (response.ok) { // If the response is OK
        fetchProducts(); // Refresh the product list
        setEditId(null); // Reset the edit ID
        setName(""); // Reset the name field
        setDescription(""); // Reset the description field
        setPrice(""); // Reset the price field
        setImage(null); // Reset the image field
        setShowForm(false); // Hide the form
      }
    } catch (error) {
      console.error("Error adding/updating product:", error);
    }
  };

  const handleEditProduct = (product) => {
    setEditId(product._id); //Set the ID of the product being edited
    setName(product.name); // Set the name field to the product's name
    setDescription(product.description); // Set the description field to the product's description
    setPrice(product.price.toString()); // Set the price field to the product's price
    setShowForm(true); // Show the form
  };

  const handleDeleteProduct = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" }); // Send a DELETE request to the API
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>E-commerce</Text>
      <Text style={styles.title}>Product Management</Text>

      {!showForm && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowForm(true)} // Show the form when the add button is pressed
        >
          <Text style={styles.addButtonText}>Add Product</Text>
        </TouchableOpacity>
      )}

      {showForm && (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Product Name"
            value={name}
            onChangeText={setName} // Update the name field when the user types
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription} // Update the description field when the user types
          />
          <TextInput
            style={styles.input}
            placeholder="Price"
            value={price}
            onChangeText={setPrice} // Update the price field when the user types
            keyboardType="numeric" // Allow the user to enter numbers only
          />
          <TouchableOpacity style={styles.imgButton} onPress={pickImage}> 
            <Text style={styles.addButtonText}>Upload Image</Text>
          </TouchableOpacity>
          {image && (
            <Image source={{ uri: image }} style={styles.previewImage} /> // Display the uploaded image
          )}

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddOrUpdateProduct}
          >
            <Text style={styles.addButtonText}>
              {editId !== null ? "Update Product" : "Add Product"} 
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setName("");                             // Reset the form fields
              setDescription("")
              setPrice("");
              setEditId(null);
              setShowForm(false);
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {products.length > 0 ? (
        <FlatList
          ListHeaderComponent={
            <View style={styles.headerRow}> 
              <Text style={styles.headerText}>Image</Text> 
              <Text style={styles.headerText}>Details</Text>
              <Text style={styles.headerText}>Actions</Text>
            </View>
          }
          data={products}
          renderItem={({ item }) => (
            <View style={styles.product}>
              <Image
                source={{
                  uri: `http://192.168.1.9:5000/uploads/${item.image}`, // Display the image from the server
                }}
                style={styles.image}
              />
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productDescription}>
                  {item.description}
                </Text>
                <Text style={styles.productPrice}>Rs {item.price}</Text>
              </View>
              <View style={styles.productActions}>
                <TouchableOpacity onPress={() => handleEditProduct(item)}>
                  <Feather name="edit" size={24} color="blue" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteProduct(item._id)}>
                  <Feather name="trash-2" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item) =>
            item._id?.toString() || Math.random().toString() //  Use the product ID as the key, or a random string if ID is missing
          }
        />
      ) : (
        <Text style={styles.noProducts}>No products available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff", marginTop: "50" },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    color: "dodgerblue",
    textAlign: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  formContainer: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "dodgerblue",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  cancelButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },
  imgButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    width: "150",
    alignItems: "center",
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 10,
  },
  product: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f5",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  productDetails: { flex: 1, marginLeft: 78 },
  productName: { fontSize: 18, fontWeight: "bold" },
  productDescription: { fontSize: 14, color: "#666" },
  productPrice: { fontSize: 16, fontWeight: "bold", color: "green" },
  productActions: {
    flexDirection: "row",
    alignItems: "center",
    padding: "5",
    gap: "10",
  },
  editButton: { color: "blue", fontSize: 16, marginRight: 10 },
  deleteButton: { color: "red", fontSize: 16 },
  image: { width: 50, height: 50, borderRadius: 5, marginLeft: "7" },
  noProducts: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    backgroundColor: "#ddd",
    borderBottomWidth: 1,
    borderBottomColor: "#bbb",
    paddingHorizontal: "",
    marginTop: 10,
    borderRadius: 5,
    gap: "50",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    marginLeft: "10",
  },
});

export default ProductManager;
