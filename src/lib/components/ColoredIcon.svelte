<script>
  const { alt, class: klass = {}, iconUrl, colorCode } = $props();
</script>

<img
  {alt}
  class={klass}
  style="
    -webkit-mask-image: url({iconUrl});
    mask-image: url({iconUrl});
    mask-size: cover;
    background-color: {colorCode};
  "
/>
