<script>
  import { onMount } from "svelte";
  import Chart from "chart.js/auto";
  import { fetchWithAuth } from "$lib/auth";

  let courseChart;
  let gpaChart;
  let courseChartCanvas;
  let gpaChartCanvas;

  let stats = $state({
    total: 0,
    avgGpa: 0,
    courses: {},
    highestGpa: 0,
    lowestGpa: 0,
    growth: 0,
    predictedAvgGpa: 0
  });

  const predictGPA = (students) => {
    if (!students.length) return 0;

    const avg =
      students.reduce((sum, s) => sum + s.gpa, 0) / students.length;

    return Math.min(10, avg + 0.2);
  };

  const loadChart = async () => {
    const res = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/api/students`);
    if (!res) return;

    if (!res.ok) {
      throw new Error("Failed to fetch dashboard data");
    }

    const data = await res.json();

    // Calculate stats
    stats.total = data.length;

    stats.avgGpa =
      data.reduce((sum, s) => sum + s.gpa, 0) / (data.length || 1);

    if (data.length) {
      const gpas = data.map((s) => s.gpa);
      stats.highestGpa = Math.max(...gpas);
      stats.lowestGpa = Math.min(...gpas);
      stats.predictedAvgGpa = predictGPA(data);

      const sortedByTime = [...data].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );

      stats.growth =
        sortedByTime.length > 1
          ? sortedByTime[sortedByTime.length - 1].gpa - sortedByTime[0].gpa
          : 0;
    }

    const courseMap = {};
    data.forEach((s) => {
      courseMap[s.course] = (courseMap[s.course] || 0) + 1;
    });

    stats.courses = courseMap;

    courseChart = new Chart(courseChartCanvas, {
      type: "pie",
      data: {
        labels: Object.keys(courseMap),
        datasets: [{
          data: Object.values(courseMap)
        }]
      }
    });

    const gpaData = data.map((s) => s.gpa);

    gpaChart = new Chart(gpaChartCanvas, {
      type: "line",
      data: {
        labels: data.map((s) => s.name),
        datasets: [{
          label: "GPA",
          data: gpaData
        }]
      }
    });
  };

  onMount(() => {
    loadChart();

    return () => {
      if (courseChart) courseChart.destroy();
      if (gpaChart) gpaChart.destroy();
    };
  });
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

    <div class="card">
      <h3>Highest GPA</h3>
      <p>{stats.highestGpa.toFixed(2)}</p>
    </div>

    <div class="card">
      <h3>Lowest GPA</h3>
      <p>{stats.lowestGpa.toFixed(2)}</p>
    </div>

    <div class="card">
      <h3>Growth Over Time</h3>
      <p>{stats.growth.toFixed(2)}</p>
    </div>

    <div class="card">
      <h3>Predicted Avg GPA</h3>
      <p>{stats.predictedAvgGpa.toFixed(2)} 📈</p>
    </div>
  </div>

  <div class="charts">
    <canvas id="course-chart" bind:this={courseChartCanvas}></canvas>
    <canvas id="gpa-chart" bind:this={gpaChartCanvas}></canvas>
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

  .charts {
    margin-top: 2rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }
</style>
