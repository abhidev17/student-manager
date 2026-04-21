<script>
  import { onMount } from "svelte";

  let students = [];
  let loading = true;

  let showModal = false;

  let form = {
    name: "",
    age: "",
    course: "",
    gpa: ""
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/students");
      students = await res.json();
    } catch (error) {
      console.error(error);
    } finally {
      loading = false;
    }
  };

  onMount(fetchStudents);

  const addStudent = async () => {
    try {
      await fetch("http://localhost:3000/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          age: Number(form.age),
          gpa: Number(form.gpa)
        })
      });

      showModal = false;

      form = { name: "", age: "", course: "", gpa: "" };

      await fetchStudents();
    } catch (error) {
      console.error(error);
    }
  };
</script>

<main>
  <h1>Student Management</h1>

  <button class="add-btn" on:click={() => showModal = true}>
    + Add Student
  </button>

  {#if loading}
    <p>Loading students...</p>
  {:else}
    <div class="grid">
      {#each students as student}
        <div class="card">
          <h2>{student.name}</h2>
          <p><strong>Age:</strong> {student.age}</p>
          <p><strong>Course:</strong> {student.course}</p>
          <p><strong>GPA:</strong> {student.gpa}</p>

          <div class="actions">
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
          </div>
        </div>
      {/each}
    </div>
  {/if}

  {#if showModal}
    <div class="modal-overlay">
      <div class="modal">
        <h2>Add Student</h2>

        <input placeholder="Name" bind:value={form.name} />
        <input type="number" placeholder="Age" bind:value={form.age} />
        <input placeholder="Course" bind:value={form.course} />
        <input type="number" step="0.1" placeholder="GPA" bind:value={form.gpa} />

        <div class="modal-actions">
          <button on:click={addStudent}>Save</button>
          <button class="cancel" on:click={() => showModal = false}>Cancel</button>
        </div>
      </div>
    </div>
  {/if}
</main>

<style>
  main {
    padding: 2rem;
    font-family: system-ui, -apple-system, sans-serif;
  }

  h1 {
    margin-bottom: 2rem;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .card {
    background: #ffffff;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    transition: transform 0.2s ease;
  }

  .card:hover {
    transform: translateY(-5px);
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
    border-radius: 8px;
    cursor: pointer;
  }

  .edit {
    background: #4CAF50;
    color: white;
  }

  .delete {
    background: #f44336;
    color: white;
  }
</style>
