<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { fade, scale } from "svelte/transition";
  import { fly } from "svelte/transition";
  import jsPDF from "jspdf";
  import Papa from "papaparse";

  let students = $state([]);
  let loading = $state(true);
  let showModal = $state(false);
  let isEditing = $state(false);
  let editId = $state(null);
  let search = $state("");
  let selectedCourse = $state("");
  let notifications = $state([]);
  let isSaving = $state(false);

  let form = $state({
    name: "",
    age: "",
    course: "",
    gpa: ""
  });

  let filteredStudents = $derived(
    students.filter((s) => {
      const matchesName = s.name.toLowerCase().includes(search.toLowerCase());
      const matchesCourse = selectedCourse
        ? s.course === selectedCourse
        : true;

      return matchesName && matchesCourse;
    })
  );

  const notify = (msg, type = "success") => {
    const id = Date.now();

    notifications = [
      ...notifications,
      { id, msg, type }
    ];

    setTimeout(() => {
      notifications = notifications.filter((n) => n.id !== id);
    }, 3000);
  };

  const handleUnauthorized = (res) => {
    if (res.status === 401) {
      localStorage.removeItem("token");
      goto("/login");
      return true;
    }

    return false;
  };

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/students`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (handleUnauthorized(res)) return;

      if (!res.ok) {
        const text = await res.text();
        console.error(text);
        throw new Error("Request failed");
      }

      const data = await res.json();
      students = data;
    } catch (error) {
      console.error(error);
    }

    loading = false;
  };

  onMount(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      goto("/login");
      return;
    }

    fetchStudents();
  });

  const deleteStudent = async (id) => {
    if (!confirm("Delete this student?")) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/students/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (handleUnauthorized(res)) return;

      if (!res.ok) {
        const text = await res.text();
        console.error(text);
        throw new Error("Request failed");
      }

      notify("Student deleted 🗑️");

      await fetchStudents();
    } catch (error) {
      notify("Delete failed ❌", "error");
      console.error(error);
    }
  };

  const startEdit = (student) => {
    form = { ...student };
    editId = student._id;
    isEditing = true;
    showModal = true;
  };

  const saveStudent = async () => {
    isSaving = true;

    try {
      const url = isEditing
        ? `${import.meta.env.VITE_API_URL}/api/students/${editId}`
        : `${import.meta.env.VITE_API_URL}/api/students`;

      const method = isEditing ? "PUT" : "POST";
      const token = localStorage.getItem("token");

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          age: Number(form.age),
          gpa: Number(form.gpa)
        })
      });

      if (handleUnauthorized(res)) return;

      if (!res.ok) {
        const text = await res.text();
        console.error(text);
        throw new Error("Request failed");
      }

      notify(isEditing ? "Student updated ✏️" : "Student added ✅");

      showModal = false;
      isEditing = false;
      editId = null;

      form = { name: "", age: "", course: "", gpa: "" };

      await fetchStudents();
    } catch (error) {
      notify("Something went wrong ❌", "error");
      console.error(error);
    }

    isSaving = false;
  };

  const exportCSV = () => {
    if (!filteredStudents.length) {
      alert("No data to export");
      return;
    }

    const headers = ["Name", "Age", "Course", "GPA"];

    const rows = filteredStudents.map((s) => [
      s.name,
      s.age,
      s.course,
      s.gpa
    ]);

    const csvContent =
      [headers, ...rows]
        .map((row) => row.join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "students.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    if (!filteredStudents.length) {
      alert("No data to export");
      return;
    }

    const doc = new jsPDF();

    doc.text("Student List", 10, 10);

    filteredStudents.forEach((s, i) => {
      doc.text(
        `${s.name} | ${s.age} | ${s.course} | ${s.gpa}`,
        10,
        20 + i * 10
      );
    });

    doc.save("students.pdf");
  };

  const handleCSV = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        try {
          const token = localStorage.getItem("token");

          for (const row of results.data) {
            if (!row.Name || !row.Age || !row.Course || !row.GPA) continue;

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/students`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                name: row.Name,
                age: Number(row.Age),
                course: row.Course,
                gpa: Number(row.GPA)
              })
            });

            if (handleUnauthorized(res)) return;
          }

          notify("CSV Imported ✅");
          fetchStudents();
        } catch (error) {
          notify("CSV import failed ❌", "error");
          console.error(error);
        }
      }
    });
  };
</script>

<main>
  <h1>Student Management</h1>

  <a href="/dashboard">Dashboard</a>

  <button onclick={() => {
    localStorage.removeItem("token");
    goto("/login");
  }}>
    Logout
  </button>

  <button class="add-btn" onclick={() => showModal = true}>
    + Add Student
  </button>

  <div class="controls" in:fly={{ y: -8, duration: 180 }}>
    <input
      placeholder="Search by name..."
      bind:value={search}
    />

    <select bind:value={selectedCourse}>
      <option value="">All Courses</option>
      <option value="CSE">CSE</option>
      <option value="ECE">ECE</option>
      <option value="ME">ME</option>
    </select>
  </div>

  <button onclick={exportCSV} class="export">
    Export CSV 📄
  </button>

  <button onclick={exportPDF}>
    Export PDF 📑
  </button>

  <input type="file" accept=".csv" onchange={handleCSV} />

  {#if loading}
    <p>Loading students...</p>

  {:else if students.length === 0}
    <div class="empty">
      <p>No students yet 📭</p>
      <small>Add your first student</small>
    </div>

  {:else if filteredStudents.length === 0}
    <p>No matching students for current filters.</p>

  {:else}
    <div class="grid">
      {#each filteredStudents as student (student._id)}
        <div
          class="card"
          in:scale={{ duration: 200 }}
          out:fade={{ duration: 150 }}
        >
          <h2>{student.name}</h2>
          <p>Age: {student.age}</p>
          <p>Course: {student.course}</p>
          <p>GPA: {student.gpa}</p>

          <div class="actions">
            <button class="edit" onclick={() => startEdit(student)}>Edit</button>
            <button class="delete" onclick={() => deleteStudent(student._id)}>Delete</button>
          </div>
        </div>
      {/each}
    </div>
  {/if}

  {#if showModal}
    <div class="modal-overlay" in:fade out:fade>
      <div class="modal" in:scale={{ duration: 200 }}>
        <h2>Add Student</h2>

        <input placeholder="Name" bind:value={form.name} />
        <input type="number" placeholder="Age" bind:value={form.age} />
        <input placeholder="Course" bind:value={form.course} />
        <input type="number" step="0.1" placeholder="GPA" bind:value={form.gpa} />

        <div class="modal-actions">
          <button onclick={saveStudent} disabled={isSaving}>
            {isSaving ? "Saving..." : isEditing ? "Update" : "Save"}
          </button>
          <button class="cancel" onclick={() => showModal = false}>Cancel</button>
        </div>
      </div>
    </div>
  {/if}

  <div class="notifications">
    {#each notifications as n (n.id)}
      <div class={`toast ${n.type}`}>
        {n.msg}
      </div>
    {/each}
  </div>
</main>

<style>
  main {
    max-width: 1000px;
    margin: auto;
    padding: 1rem;
    font-family: system-ui, -apple-system, sans-serif;
  }

  h1 {
    margin-bottom: 2rem;
  }

  .controls {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .controls input,
  .controls select {
    padding: 0.5rem;
    border-radius: 8px;
    border: 1px solid #ccc;
  }

  .empty {
    text-align: center;
    color: #777;
    margin-top: 2rem;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1rem;
  }

  .card {
    background: #ffffff;
    padding: 1rem;
    border-radius: 10px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.08);
    transition: all 0.25s ease;
  }

  .card:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 12px 30px rgba(0,0,0,0.12);
  }

  h2 {
    margin-bottom: 0.5rem;
  }

  p {
    margin: 0.3rem 0;
    color: #555;
  }


  .add-btn {
    margin-bottom: 1.5rem;
    padding: 0.6rem 1.2rem;
    background: #0077ff;
    color: white;
    border-radius: 8px;
    border: none;
    cursor: pointer;
  }

  .export {
    background: #28a745;
    color: white;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.4);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    width: 300px;
  }

  .modal input {
    width: 100%;
    margin: 0.5rem 0;
    padding: 0.5rem;
  }

  .modal-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
  }

  .cancel {
    background: #ccc;
  }
  .actions {
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;
  }

  button {
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  button:hover {
    transform: scale(1.05);
  }

  .edit {
    background: #4CAF50;
    color: white;
  }

  .delete {
    background: #f44336;
    color: white;
  }

  .notifications {
    position: fixed;
    bottom: 20px;
    right: 20px;
  }

  .toast {
    margin-top: 10px;
    padding: 10px;
    border-radius: 8px;
    color: white;
  }

  .toast.success {
    background: green;
  }

  .toast.error {
    background: red;
  }

  @media (max-width: 600px) {
    h1 {
      font-size: 1.5rem;
    }

    .controls {
      flex-direction: column;
    }

    button {
      width: 100%;
    }

    .modal {
      width: 90%;
    }
  }
</style>
