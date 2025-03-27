<script>
  import Settings from "$lib/components/Settings.svelte";

  let { displayMode = $bindable(), sendResponse } = $props();
</script>

<div class="flex flex-col gap-2 text-center text-primary">
  <Settings />
  <div class="flex justify-center gap-2">
    <button onclick={() => (displayMode = "notification")}>
      <img src="/assets/line-md_arrow-left.svg" alt="Back arrow" />
    </button>
    <button class="btn" onclick={() => sendResponse("change")}>Continue</button>
    <button class="btn" onclick={() => sendResponse("cancel")}>Cancel</button>
  </div>
</div>
