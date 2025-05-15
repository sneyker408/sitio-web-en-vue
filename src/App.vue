<template>
  <NavComp />

  <transition name="fadeUp" mode="out-in">
    <router-view :key="$route.fullPath" />
  </transition>

  <FootNav />
</template>

<script setup>
import NavComp from '@/components/NavComp.vue'
import FootNav from '@/components/FootNav.vue'
import { useRoute } from 'vue-router'
import { onMounted, watch } from 'vue'
import { analytics } from '@/main'
import { logEvent } from 'firebase/analytics'

const route = useRoute()

onMounted(() => {
  logEvent(analytics, 'page_view', { page_path: route.fullPath })
})

watch(
  () => route.fullPath,
  (newPath) => {
    logEvent(analytics, 'page_view', { page_path: newPath })
  }
)
</script>

<style>
#app {
  color: #2c3e50;
}

.fadeUp-enter-active,
.fadeUp-leave-active {
  transition: opacity 0.25s, transform 0.25s;
}
.fadeUp-enter,
.fadeUp-leave-to {
  opacity: 0;
  transform: translateY(30%);
}
</style>
