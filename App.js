import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image
} from "react-native";

const API_URL = "http://192.168.1.9:5000/api/products"; // Replace with your actual API URL

const ProductManager = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null); // Store product ID instead of index

  // Fetch products from backend
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleAddOrUpdateProduct = async () => {
    if (!name || !description || !price) return;

    const productData = { name, description, price: parseFloat(price) };

    try {
      if (editId !== null) {
        // Update existing product
        const response = await fetch(`${API_URL}/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
        if (response.ok) {
          fetchProducts();
          setEditId(null);
        }
      } else {
        // Add new product
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
        if (response.ok) fetchProducts();
      }
    } catch (error) {
      console.error("Error adding/updating product:", error);
    }

    // Reset input fields
    setName("");
    setDescription("");
    setPrice("");
  };

  const handleEditProduct = (product) => {
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price.toString());
    setEditId(product._id); // Store product ID instead of index
  };

  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (response.ok) fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.product}>
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>
        <Text style={styles.productPrice}>Rs {item.price}</Text>
        <Image source={{ uri: `http://192.168.1.9:5000/uploads/${item.image}` }} style={styles.image} alt="img" />
        {/* <Text>{item._id}</Text> */}
      </View>
      <View style={styles.productActions}>
        <TouchableOpacity onPress={() => handleEditProduct(item)}>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteProduct(item._id)}>
          <Text style={styles.deleteButton}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>E-commerce</Text>
      <Text style={styles.title}>Product Management</Text>

      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddOrUpdateProduct}
      >
        <Text style={styles.addButtonText}>
          {editId !== null ? "Update Product" : "Add Product"}
        </Text>
      </TouchableOpacity>

      {products.length > 0 ? (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) =>
            item.id?.toString() || Math.random().toString()
          } // Ensures valid key
        />
      ) : (
        <Text style={styles.noProducts}>No products available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    marginTop: 40,
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
    color: "dodgerblue",
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 2,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    fontSize: 18,
  },
  addButton: {
    backgroundColor: "dodgerblue",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  product: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productDescription: {
    fontSize: 16,
    color: "#666",
  },
  productPrice: {
    fontSize: 16,
    color: "green",
  },
  productActions: {
    flexDirection: "row",
  },
  editButton: {
    color: "dodgerblue",
    fontWeight: "bold",
    fontSize: 18,
    marginRight: 10,
  },
  deleteButton: {
    color: "red",
    fontWeight: "bold",
    fontSize: 18,
  },
  noProducts: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 20,
    color: "#666",
  },
  image:{
    width: 100,
    height: 100,
  }
});

export default ProductManager;
