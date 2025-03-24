<script>
  import { canLaunchGame, clearQueue, getQueue, launchGame } from "./api";
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

  const allPromises = Promise.all([queue, hasAnyGame]);
</script>

<div class="p-2 bg-lightgray font-semibold whitespace-nowrap">
  {#await allPromises}
    <span>Loading...</span>
  {:then [queue, hasAnyGame]}
    {#if hasAnyGame}
      <div class="flex gap-2">
        <button onclick={onLaunchGame} class="bg-primary p-1 rounded-sm"
          >Start queue ({queue.length} games)</button
        >
        <button onclick={onClear}>
          <img src="/assets/mdi_garbage.svg" alt="Delete" />
        </button>
      </div>
    {:else}
      <span>No games in queue</span>
    {/if}
  {:catch e}
    <span>Error: {e}</span>
  {/await}
</div>
