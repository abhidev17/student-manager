<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { fade, scale } from "svelte/transition";
  import { fly } from "svelte/transition";

  let students = $state([]);
  let loading = $state(true);
  let showModal = $state(false);
  let isEditing = $state(false);
  let editId = $state(null);
  let search = $state("");
  let selectedCourse = $state("");
  let toast = $state("");
  let showToast = $state(false);
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

  const triggerToast = (message) => {
    toast = message;
    showToast = true;

    setTimeout(() => {
      showToast = false;
    }, 2000);
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

      triggerToast("Student deleted 🗑️");

      await fetchStudents();
    } catch (error) {
      triggerToast("Delete failed ❌");
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

      triggerToast(isEditing ? "Student updated ✏️" : "Student added ✅");

      showModal = false;
      isEditing = false;
      editId = null;

      form = { name: "", age: "", course: "", gpa: "" };

      await fetchStudents();
    } catch (error) {
      triggerToast("Something went wrong ❌");
      console.error(error);
    }

    isSaving = false;
  };
</script>

<main>
  <h1>Student Management</h1>

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

  {#if showToast}
    <div class="toast">
      {toast}
    </div>
  {/if}
</main>

<style>
  main {
    max-width: 900px;
    margin: auto;
    padding: 2rem;
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
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .card {
    background: #ffffff;
    padding: 1.5rem;
    border-radius: 14px;
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

  .toast {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #333;
    color: white;
    padding: 0.8rem 1.2rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }
</style>
