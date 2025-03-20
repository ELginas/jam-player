<script>
  import "./App.css";

  const queue = browser.runtime.sendMessage({
    type: "getQueue",
  });
</script>

{#await queue then queue}
  <span>{JSON.stringify(queue)}</span>
{/await}
<div class="p-2 bg-orange-200">This is example</div>
