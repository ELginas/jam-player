<script lang="ts">
  import { setSettings } from "$lib/api";
  import ColoredIcon from "$lib/components/ColoredIcon.svelte";

  let { notification, displayMode = $bindable(), sendResponse } = $props();

  const { id, name, iconUrl, colorCode } = notification.data;

  function numberOrder(num: number) {
    if (num === 1) {
      return "1st";
    }
    if (num === 2) {
      return "2nd";
    }
    if (num === 3) {
      return "3rd";
    }
    return `${num}th`;
  }

  async function onYesButton() {
    await setSettings("container", undefined);
    await sendResponse("change");
  }
</script>

<div class="flex flex-col gap-2 text-center">
  <div class="">
    <span>Missing {numberOrder(id + 1)} container</span>
    <ColoredIcon alt="" class="w-6 h-6 inline-block" {iconUrl} {colorCode} />
    <span style="color: {colorCode}">{name}</span>
    <span>. Do you want to open rating page without a container?</span>
  </div>
  <div class="flex justify-center gap-2">
    <button class="btn" onclick={onYesButton}>Yes</button>
    <button class="btn" onclick={() => (displayMode = "containerSettings")}
      >Let me change the container</button
    >
    <button class="btn" onclick={() => sendResponse("cancel")}>No</button>
  </div>
</div>
