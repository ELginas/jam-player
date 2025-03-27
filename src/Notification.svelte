<script lang="ts">
  import "./App.css";
  import "@fontsource-variable/inter";
  import { getNotification } from "$lib/api";
  import NotificationMissingContainer from "$lib/components/notifications/NotificationMissingContainer.svelte";
  import MenuContainerSettings from "$lib/components/notifications/MenuContainerSettings.svelte";

  let displayMode = $state("notification");
  let notification = $state(null);
  getNotification().then((res) => (notification = res));

  async function sendResponse(data) {
    await browser.runtime.sendMessage({
      type: "notificationResponse",
      notificationType: notification.type,
      data,
    });
  }
</script>

<div
  class="p-2 bg-lightgray font-semibold items-center min-h-screen flex text-white justify-center"
>
  {#if displayMode === "notification"}
    {#if notification !== null && notification?.type === undefined}
      <span>It seems that there's no notification to show you.</span>
    {:else if notification !== null}
      {#if notification.type === "missingContainer"}
        <NotificationMissingContainer
          {notification}
          bind:displayMode
          {sendResponse}
        />
      {/if}
    {/if}
  {:else if displayMode === "containerSettings"}
    <MenuContainerSettings bind:displayMode {sendResponse} />
  {/if}
</div>
