

import React, { useState, useEffect } from "react";
import { db } from "../../auth/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import HomeNavbar from "../navbar/HomeNavbar";

const DataAdd = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    company: "",
    role: ""
  });

  const [errors, setErrors] = useState({});
  const [savedData, setSavedData] = useState([]);
  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, "8viewsData"));
    const dataList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    setSavedData(dataList);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setErrors(prev => ({ ...prev, [e.target.name]: "" })); // clear error on input change
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.age.trim()) newErrors.age = "Age is required.";
    if (!formData.company.trim()) newErrors.company = "Company is required.";
    if (!formData.role.trim()) newErrors.role = "Role is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    if (editId) {
      const docRef = doc(db, "8viewsData", editId);
      await updateDoc(docRef, formData);
      alert("Data updated successfully!");
      setEditId(null);
    } else {
      await addDoc(collection(db, "8viewsData"), formData);
      alert("Data added successfully!");
    }

    setFormData({ name: "", age: "", company: "", role: "" });
    fetchData();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "8viewsData", id));
    alert("Data deleted successfully!");
    fetchData();
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      age: item.age,
      company: item.company,
      role: item.role
    });
    setEditId(item.id);
    setErrors({});
  };

  return (
    <div >
      <HomeNavbar />
      <div className="container">
        <div className="mt-4 mt-lg-5">
          <h2>{editId ? "Update" : "Add"} Employee  Data (CRUD)</h2>

          <div className="mt-4 col-lg-6">
            <input
              type="text"
              name="name"
              value={formData.name}
              placeholder="Name"
              onChange={handleChange}
              className="data-input mb-2"
            />
            {errors.name && <div className="mb-3" style={{ color: "red", fontSize: "14px" }}>{errors.name}</div>}


            <input
              type="number"
              name="age"
              value={formData.age}
              placeholder="Age"
              onChange={handleChange}
              className="data-input mb-2"
            />
            {errors.age && <div className="mb-3" style={{ color: "red", fontSize: "14px" }}>{errors.age}</div>}


            <input
              type="text"
              name="company"
              value={formData.company}
              placeholder="Company"
              onChange={handleChange}
              className="data-input mb-2"
            />
            {errors.company && <div className="mb-3" style={{ color: "red", fontSize: "14px" }}>{errors.company}</div>}


            <input
              type="text"
              name="role"
              value={formData.role}
              placeholder="Role"
              onChange={handleChange}
              className="data-input mb-2"
            />
            {errors.role && <div className="mb-3" style={{ color: "red", fontSize: "14px" }}>{errors.role}</div>}


            <button onClick={handleSave} className="add-to-cart-btn">
              {editId ? "Update Data" : "Save Data"}
            </button>
          </div>

          <hr />

          <div>
            <h3 className="mb-4">Saved Employee   Data</h3>
          </div>

          {savedData.length > 0 ? (
            <div className="row mb-5" style={{ textAlign: "left" }}>
              {savedData.map((item) => (
                <div key={item.id} className="col-lg-3 border-bottom mb-3 mb-lg-0">
                  <div style={{ marginBottom: "10px", paddingBottom: "10px" }}>
                    <p><strong>Name:</strong> {item.name}</p>
                    <p><strong>Age:</strong> {item.age}</p>
                    <p><strong>Company:</strong> {item.company}</p>
                    <p><strong>Role:</strong> {item.role}</p>
                    <button onClick={() => handleEdit(item)} style={{ marginRight: "10px" }} className="view-details-btn">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="delete-btn">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No data found.</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default DataAdd;

