<script>
  import { fade, scale } from 'svelte/transition';
  export let isOpen = false;
  export let close;
</script>

{#if isOpen}
  <div class="modal-backdrop" on:click|self={close} transition:fade={{ duration: 200 }}>
    <div class="modal-content" transition:scale={{ start: 0.95, duration: 200 }}>
      <header>
        <slot name="header" />
        <button class="close-icon" on:click={close}>&times;</button>
      </header>
      <div class="body">
        <slot name="body" />
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(15, 23, 42, 0.5);
    backdrop-filter: blur(4px);
    display: grid;
    place-items: center;
    z-index: 100;
    padding: 1rem;
  }

  .modal-content {
    background: white;
    width: 100%;
    max-width: 500px;
    border-radius: 16px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    overflow: hidden;
  }

  header {
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .body {
    padding: 1.5rem;
  }

  .close-icon {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #94a3b8;
    cursor: pointer;
  }
</style>
