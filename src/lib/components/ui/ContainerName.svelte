<script lang="ts">
  import ColoredIcon from "../ColoredIcon.svelte";

  const { container } = $props();
</script>

<div class="flex items-center gap-1">
  {#if container?.iconUrl}
    <ColoredIcon
      alt=""
      class="w-5 h-5"
      iconUrl={container?.iconUrl}
      colorCode={container?.colorCode}
    />
  {/if}
  {container?.name}
</div>
