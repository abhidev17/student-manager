<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
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
  <div class="auth-form-section" in:fade={{ duration: 600 }}>
    <div class="form-wrapper">
      <header>
        <div class="logo-icon-generic">L</div>
        <h1>Secure access</h1>
        <p>Enter your credentials to continue</p>
      </header>

      <form on:submit|preventDefault={handleLogin}>
        <div class="input-group">
          <label for="email">User email</label>
          <input type="email" id="email" bind:value={email} placeholder="you@email.com" required />
        </div>

        <div class="input-group">
          <div class="label-row">
            <label for="password">System password</label>
            <a href="/forgot" class="forgot-link">Recover access?</a>
          </div>
          <input type="password" id="password" bind:value={password} placeholder="••••••••" required />
        </div>

        {#if error}
          <div class="error" transition:fade={{ duration: 200 }}>{error}</div>
        {/if}

        <button type="submit" class="btn-primary">Login</button>
      </form>
    </div>
  </div>

  <div class="auth-visual-section" in:fade={{ duration: 400 }}>
    <div class="background-texture-overlay"></div>
    <div class="graphic-orb orb-one"></div>
    <div class="graphic-orb orb-two"></div>
    <div class="graphic-grid"></div>
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
    padding: 60px;
  }

  .form-wrapper {
    width: 100%;
    max-width: 420px;
  }

  header {
    margin-bottom: 40px;
  }

  .logo-icon-generic {
    width: 48px;
    height: 48px;
    background: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
    border-radius: 12px;
    display: grid;
    place-items: center;
    font-weight: 700;
    font-size: 1.15rem;
    margin-bottom: 24px;
    border: 1px solid rgba(59, 130, 246, 0.2);
  }

  h1 {
    font-size: 2rem;
    color: #0f172a;
    margin: 0 0 10px 0;
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  header p {
    color: #64748b;
    font-size: 1rem;
    line-height: 1.5;
  }

  .input-group {
    margin-bottom: 24px;
  }

  .label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  label {
    display: block;
    font-size: 0.9rem;
    font-weight: 600;
    color: #475569;
  }

  input {
    width: 100%;
    padding: 14px 18px;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    font-size: 1rem;
    transition: all 0.2s;
    outline: none;
    color: #1e293b;
    background: #f8fafc;
  }

  input:focus {
    border-color: #3b82f6;
    background: #ffffff;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }

  .btn-primary {
    width: 100%;
    padding: 14px;
    background: #0f172a;
    color: white;
    border: none;
    border-radius: 10px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
    margin-top: 10px;
  }

  .btn-primary:hover {
    background: #1e293b;
  }

  .btn-primary:active {
    transform: scale(0.99);
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

  .forgot-link {
    color: #64748b;
    text-decoration: none;
    font-size: 0.85rem;
    font-weight: 500;
  }

  .forgot-link:hover {
    color: #3b82f6;
  }

  .auth-visual-section {
    flex: 1.3;
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 80px;
    color: white;
    overflow: hidden;
  }

  .background-texture-overlay {
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(circle at 25% 20%, rgba(148, 163, 184, 0.16), transparent 34%),
      radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.12), transparent 32%);
  }

  .graphic-orb {
    position: absolute;
    border-radius: 50%;
    border: 1px solid rgba(148, 163, 184, 0.25);
    box-shadow: inset 0 0 24px rgba(148, 163, 184, 0.08);
  }

  .orb-one {
    width: 320px;
    height: 320px;
    top: 18%;
    right: 12%;
    background: radial-gradient(circle at 30% 30%, rgba(203, 213, 225, 0.16), rgba(15, 23, 42, 0.02));
  }

  .orb-two {
    width: 220px;
    height: 220px;
    bottom: 14%;
    left: 14%;
    background: radial-gradient(circle at 65% 35%, rgba(59, 130, 246, 0.18), rgba(30, 41, 59, 0.03));
  }

  .graphic-grid {
    position: absolute;
    inset: 12%;
    border-radius: 24px;
    border: 1px solid rgba(148, 163, 184, 0.16);
    background-image:
      linear-gradient(rgba(148, 163, 184, 0.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(148, 163, 184, 0.07) 1px, transparent 1px);
    background-size: 24px 24px;
    backdrop-filter: blur(1px);
  }

  @media (max-width: 1000px) {
    .auth-visual-section {
      display: none;
    }

    .auth-form-section {
      padding: 40px;
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
