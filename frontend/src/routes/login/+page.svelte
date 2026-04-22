<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  let email = $state("");
  let password = $state("");

  onMount(async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/students`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        goto("/");
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      localStorage.removeItem("token");
      console.error(error);
    }
  });

  const login = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        goto("/");
      } else {
        alert("Login failed");
      }
    } catch (err) {
      console.error(err);
    }
  };
</script>

<main>
  <h1>Login</h1>

  <input placeholder="Email" bind:value={email} />
  <input type="password" placeholder="Password" bind:value={password} />

  <button onclick={login}>Login</button>
</main>

<style>
  main {
    max-width: 300px;
    margin: auto;
    padding: 2rem;
  }

  input {
    width: 100%;
    margin: 0.5rem 0;
    padding: 0.5rem;
  }
</style>
