<template>
  <div class="wrap">
    <MapViewer></MapViewer>
    <SideBar></SideBar>
  </div>
</template>
<script setup>
import MapViewer from "@/components/base/MapViewer.vue";
import SideBar from "@/components/SideBar.vue";
</script>
<style>
.wrap {
  height: 100%;
  display: flex;
  position: relative;
  flex: 1 1 auto;
  overflow: hidden;
  box-sizing: border-box;
}
</style>
