<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { goto } from '$app/navigation';

  let email = $state('');
  let password = $state('');
  let error = $state('');

  onMount(() => {
    const token = localStorage.getItem('token');

    if (token) goto('/dashboard');
  });

  async function handleLogin(event) {
    event.preventDefault();
    error = '';

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const text = await res.text();
        console.error(text);
        error = 'Invalid credentials. Please try again.';
        return;
      }

      const data = await res.json();

      if (data.accessToken || data.token) {
        localStorage.setItem('token', data.accessToken || data.token);
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
        goto('/dashboard');
      } else {
        error = 'Login failed. Please try again.';
      }
    } catch (err) {
      console.error(err);
      error = 'Something went wrong. Please try again.';
    }
  }
</script>

<div class="auth-container">
  <div class="auth-form-section" in:fly={{ x: -20, duration: 600 }}>
    <div class="form-wrapper">
      <header>
        <div class="logo-circle">G</div>
        <h1>Welcome back</h1>
        <p>Enter your credentials to access your dashboard</p>
      </header>

      <form on:submit|preventDefault={handleLogin}>
        <div class="input-group">
          <label for="email">Email address</label>
          <input type="email" id="email" bind:value={email} placeholder="name@university.edu" required />
        </div>

        <div class="input-group">
          <div class="label-row">
            <label for="password">Password</label>
            <a href="/forgot" class="forgot-link">Forgot?</a>
          </div>
          <input type="password" id="password" bind:value={password} placeholder="••••••••" required />
        </div>

        {#if error}
          <div class="error" transition:fade={{ duration: 200 }}>{error}</div>
        {/if}

        <button type="submit" class="btn-primary">Sign in</button>
      </form>

      <footer>
        <p>Don't have an account? <a href="/signup">Create one for free</a></p>
      </footer>
    </div>
  </div>

  <div class="auth-visual-section" in:fade={{ duration: 400 }}>
    <div class="overlay-content">
      <blockquote>
        "Gradely has transformed how we track student progress. The AI insights are a game changer."
      </blockquote>
      <cite>— Academic Director, Tech University</cite>
    </div>
  </div>
</div>

<style>
.auth-container {
    display: flex;
    min-height: 100vh;
    background: #ffffff;
  }

  .auth-form-section {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
  }

  .form-wrapper {
    width: 100%;
    max-width: 400px;
  }

  header {
    margin-bottom: 32px;
  }

  .logo-circle {
    width: 40px;
    height: 40px;
    background: #3b82f6;
    color: white;
    border-radius: 10px;
    display: grid;
    place-items: center;
    font-weight: bold;
    margin-bottom: 20px;
  }

  h1 {
    font-size: 1.875rem;
    color: #0f172a;
    margin: 0 0 8px 0;
  }

  header p {
    color: #64748b;
    font-size: 0.95rem;
  }

  .input-group {
    margin-bottom: 20px;
  }

  .label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #334155;
  }

  input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.2s;
    outline: none;
  }

  input:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }

  .btn-primary {
    width: 100%;
    padding: 12px;
    background: #0f172a;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    margin-top: 10px;
  }

  .btn-primary:hover {
    background: #1e293b;
  }

  .error {
    background: #fee2e2;
    color: #991b1b;
    border: 1px solid #fecaca;
    padding: 10px;
    border-radius: 8px;
    font-size: 0.875rem;
    margin-bottom: 10px;
  }

  .forgot-link,
  footer a {
    color: #3b82f6;
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
  }

  footer {
    margin-top: 32px;
    text-align: center;
    font-size: 0.875rem;
    color: #64748b;
  }

  .auth-visual-section {
    flex: 1.2;
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    position: relative;
    display: flex;
    align-items: flex-end;
    padding: 80px;
    color: white;
  }

  .overlay-content {
    max-width: 450px;
  }

  blockquote {
    font-size: 1.5rem;
    font-weight: 300;
    margin: 0 0 20px 0;
    line-height: 1.4;
  }

  cite {
    color: #94a3b8;
    font-style: normal;
  }

  @media (max-width: 900px) {
    .auth-visual-section {
      display: none;
    }

    .auth-form-section {
      padding: 24px;
    }
  }

  @media (max-width: 480px) {
    .form-wrapper {
      max-width: 100%;
    }

    h1 {
      font-size: 1.6rem;
    }
  }
</style>
