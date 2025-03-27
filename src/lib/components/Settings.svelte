<script>
  import { getContainers, getAllSettings, setSettings } from "$lib/api";
  import Combobox from "./ui/Combobox.svelte";

  const settings = getAllSettings();
  const containers = getContainers();

  // const containers = [
  //   {
  //     id: 1,
  //     name: "Personal",
  //     iconUrl: "/assets/mdi_garbage.svg",
  //     colorCode: "#37adff",
  //   },
  //   {
  //     id: 2,
  //     name: "Other",
  //     iconUrl: "/assets/mdi_garbage.svg",
  //     colorCode: "#37adff",
  //   },
  //   {
  //     id: 3,
  //     name: "Bank",
  //     iconUrl: "/assets/mdi_garbage.svg",
  //     colorCode: "#37adff",
  //   },
  // ];

  async function updateRatingContainer(value, containers) {
    if (value === undefined) {
      await setSettings("ratingContainer", undefined);
      return;
    }
    const container = containers.find((v) => v.id === value);
    await setSettings("ratingContainer", container);
  }
</script>

{#await settings then settings}
  <span class="text-white text-xl">Settings</span>
  <!-- <pre class="text-white">{JSON.stringify(settings, null, 2)}</pre> -->
  <div class="flex items-center gap-2">
    <span class="text-white font-medium">Rating page container:</span>
    {#await containers then containers}
      <Combobox
        {containers}
        value={settings.ratingContainer?.id}
        onValueChange={(value) => updateRatingContainer(value, containers)}
      />
    {/await}
  </div>
{/await}
