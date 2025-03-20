<script>
  import { getQueue, launchGame } from "./api";
  import "./App.css";

  const queue = getQueue();
</script>

{#await queue then queue}
  <span>{JSON.stringify(queue)}</span>
{/await}
<div class="p-2 bg-orange-200">This is example</div>
<button onclick={launchGame}>Launch game</button>
