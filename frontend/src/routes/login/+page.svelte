<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  let email = $state("");
  let password = $state("");

  onMount(() => {
    const token = localStorage.getItem("token");

    if (token) goto("/");
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

      if (!res.ok) {
        const text = await res.text();
        console.error(text);
        alert("Login failed");
        return;
      }

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

<main class="login">
  <h1>Welcome Back 👋</h1>

  <input placeholder="Email" bind:value={email} />
  <input type="password" placeholder="Password" bind:value={password} />

  <button onclick={login}>Login</button>
</main>

<style>
.login {
    max-width: 320px;
    margin: auto;
    padding: 3rem 2rem;
    background: #1e1e1e;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    color: white;
  }

  input {
    width: 100%;
    margin: 0.5rem 0;
    padding: 0.6rem;
    border-radius: 8px;
    border: none;
  }

  button {
    width: 100%;
    margin-top: 1rem;
    padding: 0.6rem;
    background: #4CAF50;
    color: white;
    border-radius: 8px;
  }
</style>
