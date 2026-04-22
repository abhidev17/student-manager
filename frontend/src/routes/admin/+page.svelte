<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { fetchWithAuth } from "$lib/auth";

  let users = $state([]);

  const fetchUsers = async () => {
    const res = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/api/users`);
    if (!res) return;

    if (res.status === 401 || res.status === 403) {
      goto("/");
      return;
    }

    users = await res.json();
  };

  onMount(fetchUsers);
</script>

<h1>Admin Panel 👑</h1>

{#each users as user}
  <div class="card">
    <p>{user.email}</p>
    <p>{user.role}</p>
  </div>
{/each}

<style>
  .card {
    padding: 1rem;
    border-radius: 10px;
    border: 1px solid #ddd;
    margin-bottom: 0.75rem;
  }
</style>
