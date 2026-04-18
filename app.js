"use strict";
let students = JSON.parse(localStorage.getItem("students") || "[]");
let editId = null;
function save() {
    localStorage.setItem("students", JSON.stringify(students));
}
function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}
function clearForm() {
    document.getElementById("name").value = "";
    document.getElementById("age").value = "";
    document.getElementById("course").value = "";
    editId = null;
}
function addStudent() {
    const name = document.getElementById("name").value;
    const age = Number(document.getElementById("age").value);
    const course = document.getElementById("course").value;
    if (!name || !age || !course) {
        showToast("Fill all fields!");
        return;
    }
    if (editId) {
        const s = students.find(s => s.id === editId);
        s.name = name;
        s.age = age;
        s.course = course;
        showToast("Student updated");
    }
    else {
        students.push({ id: Date.now(), name, age, course });
        showToast("Student added");
    }
    save();
    clearForm();
    render();
}
function deleteStudent(id) {
    students = students.filter(s => s.id !== id);
    save();
    render();
    showToast("Deleted");
}
function editStudent(id) {
    const s = students.find(s => s.id === id);
    document.getElementById("name").value = s.name;
    document.getElementById("age").value = s.age.toString();
    document.getElementById("course").value = s.course;
    editId = id;
}
function render() {
    const list = document.getElementById("studentList");
    const search = document.getElementById("search").value.toLowerCase();
    list.innerHTML = "";
    students
        .filter(s => s.name.toLowerCase().includes(search))
        .forEach(s => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
        <h3>${s.name}</h3>
        <p>Age: ${s.age}</p>
        <p>Course: ${s.course}</p>
        <button class="edit-btn" onclick="editStudent(${s.id})">Edit</button>
        <button class="delete-btn" onclick="deleteStudent(${s.id})">Delete</button>
      `;
        list.appendChild(div);
    });
}
render();
