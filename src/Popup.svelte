<script>
  import {
    canLaunchGame,
    clearQueue,
    getQueue,
    launchGame,
    openSettings,
  } from "$lib/api";
  import "./App.css";
  import "@fontsource-variable/inter";

  const queue = getQueue();
  const hasAnyGame = canLaunchGame();

  async function onLaunchGame() {
    await launchGame();
    window.close();
  }

  async function onClear() {
    await clearQueue();
    window.close();
  }

  async function onSettings() {
    await openSettings();
    window.close();
  }

  const allPromises = Promise.all([queue, hasAnyGame]);
</script>

<div class="p-2 bg-lightgray font-semibold text-white whitespace-nowrap">
  {#await allPromises}
    <span>Loading...</span>
  {:then [queue, hasAnyGame]}
    <div class="flex gap-2 items-center">
      {#if hasAnyGame}
        <button onclick={onLaunchGame} class="btn"
          >Start queue ({queue.length} games)</button
        >
        <button onclick={onClear} class="w-6 h-6">
          <img src="/assets/mdi_garbage.svg" alt="Delete" />
        </button>
      {:else}
        <span>No games in queue</span>
      {/if}
      <button onclick={onSettings} class="w-6 h-6">
        <img src="/assets/SettingsIcon.svg" alt="Settings" />
      </button>
    </div>
  {:catch e}
    <span>Error: {e}</span>
  {/await}
</div>
