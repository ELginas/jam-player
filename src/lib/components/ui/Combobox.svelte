<script lang="ts">
  import ContainerName from "./ContainerName.svelte";

  import Check from "@lucide/svelte/icons/check";
  import ChevronsUpDown from "@lucide/svelte/icons/chevrons-up-down";
  import { tick } from "svelte";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { cn } from "$lib/utils.js";

  const {
    value: _value = undefined,
    containers: _containers,
    onValueChange,
  } = $props();

  let containers = [{ id: undefined, name: "No container" }, ..._containers];

  let open = $state(false);
  let value = $state(_value);
  let triggerRef = $state<HTMLButtonElement>(null!);

  const selectedValue = $derived(containers.find((v) => v.id === value));

  // We want to refocus the trigger button when the user selects
  // an item from the list so users can continue navigating the
  // rest of the form with the keyboard.
  function closeAndFocusTrigger() {
    open = false;
    tick().then(() => {
      triggerRef.focus();
    });
  }
</script>

<Popover.Root bind:open>
  <Popover.Trigger bind:ref={triggerRef}>
    {#snippet child({ props })}
      <Button
        variant="outline"
        class="w-[200px] justify-between"
        {...props}
        role="combobox"
        aria-expanded={open}
      >
        <ContainerName container={selectedValue} />
        <ChevronsUpDown class="opacity-50" />
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-[200px] p-0">
    <Command.Root>
      <Command.Input placeholder="Search container..." />
      <Command.List>
        <Command.Empty>No container found.</Command.Empty>
        <Command.Group>
          {#each containers as container (container.id)}
            <Command.Item
              value={container.name}
              onSelect={() => {
                value = container.id;
                onValueChange(value);
                closeAndFocusTrigger();
              }}
            >
              <Check class={cn(value !== container.id && "text-transparent")} />
              <ContainerName {container} />
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
