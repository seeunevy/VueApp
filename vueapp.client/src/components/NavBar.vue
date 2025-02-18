<template>
  <nav class="navbar">
    <a href="#" class="nav-logo">
      <h2 class="logo-text">😼</h2>
    </a>
    <div class="nav-menu">
      <RouterLink to="/" class="nav-link">
        <span class="material-symbols-outlined">
          desktop_windows
        </span>
      </RouterLink>
      <RouterLink to="/test" class="nav-link">
        <span class="material-symbols-outlined">
          send
        </span>
      </RouterLink>
    </div>
  </nav>
</template>
<script setup lang="ts">
</script>
<style lang="scss">
  .navbar {
    background: $primary-color;
    padding: 10px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid $dark-color;
    margin-bottom: 1px;

    .nav-logo {
      .logo-text {
        font-size: $font-size-xl;
        padding-bottom: 10px;
      }
    }

    .nav-menu {
      display: flex;
      gap: 20px;

      .nav-link {
        color: $dark-color;
        font-size: $font-size-xl;
      }
    }
  }
</style>
