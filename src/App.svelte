<script>
  import { canLaunchGame, getQueue, launchGame } from "./api";
  import "./App.css";
  import "@fontsource-variable/inter";

  const queue = getQueue();
  const hasAnyGame = canLaunchGame();

  async function onLaunchGame() {
    await launchGame();
    window.close();
  }

  const allPromises = Promise.all([queue, hasAnyGame]);
</script>

<div class="p-2 bg-lightgray font-semibold w-fit">
  {#await allPromises then [queue, hasAnyGame]}
    {#if hasAnyGame}
      <button onclick={onLaunchGame} class="bg-primary p-1 rounded-sm whitespace-nowrap"
        >Start queue ({queue.length} games)</button
      >
    {:else}
      <span>No games in queue</span>
    {/if}
  {/await}
</div>
