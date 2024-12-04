<script>



export default {
  name: "SalesLink",
  components: {

  }
}
</script>

<template>
  <main class="d-flex flex-column">
    <router-view :key="$route.path"></router-view>

  </main>
</template>
