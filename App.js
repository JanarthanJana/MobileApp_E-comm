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

const API_URL = "http://192.168.1.9:5000/api/products";

const ProductManager = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [products]);
  

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission denied! Please allow access to photos.");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAddOrUpdateProduct = async () => {
    if (!name || !description || !price) return;
    let formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", parseFloat(price));
    if (image) {
      formData.append("image", {
        uri: image,
        type: "image/jpeg",
        name: "product.jpg",
      });
    }
    try {
      const response = await fetch(
        editId !== null ? `${API_URL}/${editId}` : API_URL,
        {
          method: editId !== null ? "PUT" : "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        }
      );
      if (response.ok) {
        fetchProducts();
        setEditId(null);
        setName("");
        setDescription("");
        setPrice("");
        setImage(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error("Error adding/updating product:", error);
    }
  };

  const handleEditProduct = (product) => {
    setEditId(product._id);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price.toString());
    setShowForm(true);
  };

  const handleDeleteProduct = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
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
          onPress={() => setShowForm(true)}
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
          <TouchableOpacity style={styles.imgButton} onPress={pickImage}>
            <Text style={styles.addButtonText}>Upload Image</Text>
          </TouchableOpacity>
          {image && (
            <Image source={{ uri: image }} style={styles.previewImage} />
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
              setName("");
              setDescription("");
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
          data={products}
          renderItem={({ item }) => (
            <View style={styles.product}>
              <Image
                source={{
                  uri: `http://192.168.1.9:5000/uploads/${item.image}`,
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
                  <Text style={styles.editButton}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteProduct(item._id)}>
                  <Text style={styles.deleteButton}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item) =>
            item._id?.toString() || Math.random().toString()
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
  productDetails: { flex: 1, marginLeft: 10 },
  productName: { fontSize: 18, fontWeight: "bold" },
  productDescription: { fontSize: 14, color: "#666" },
  productPrice: { fontSize: 16, fontWeight: "bold", color: "green" },
  productActions: { flexDirection: "row", alignItems: "center" },
  editButton: { color: "blue", fontSize: 16, marginRight: 10 },
  deleteButton: { color: "red", fontSize: 16 },
  image: { width: 50, height: 50, borderRadius: 5 },
  noProducts: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
});

export default ProductManager;
