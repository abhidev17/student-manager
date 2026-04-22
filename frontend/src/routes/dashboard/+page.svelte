<script>
  import { onMount } from "svelte";

  let stats = $state({
    total: 0,
    avgGpa: 0,
    courses: {}
  });

  const fetchStats = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/students`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    // Calculate stats
    stats.total = data.length;

    stats.avgGpa =
      data.reduce((sum, s) => sum + s.gpa, 0) / (data.length || 1);

    const courseMap = {};
    data.forEach((s) => {
      courseMap[s.course] = (courseMap[s.course] || 0) + 1;
    });

    stats.courses = courseMap;
  };

  onMount(fetchStats);
</script>

<main>
  <h1>Dashboard 📊</h1>

  <div class="grid">
    <div class="card">
      <h3>Total Students</h3>
      <p>{stats.total}</p>
    </div>

    <div class="card">
      <h3>Average GPA</h3>
      <p>{stats.avgGpa.toFixed(2)}</p>
    </div>

    <div class="card">
      <h3>Courses</h3>
      {#each Object.entries(stats.courses) as [course, count]}
        <p>{course}: {count}</p>
      {/each}
    </div>
  </div>
</main>

<style>
  main {
    padding: 2rem;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .card {
    padding: 1.5rem;
    border-radius: 12px;
    background: #1e1e1e;
    color: white;
  }

  h1 {
    margin-bottom: 1.5rem;
  }
</style>
