<template>
  <aside :class="`${is_expanded && 'is-expanded'}`">
    <div class="bar-container">
      <div class="toggle-button robot">
        <span class="material-symbols-outlined toggle-button" @click="OpenMenu">robot_2</span>
      </div>
    </div>
    <div class="side-wrap">This is SideBar</div>
  </aside>
</template>
<script setup>
import { ref } from "vue";
const is_expanded = ref(false);

const OpenMenu = () => {
  is_expanded.value = !is_expanded.value;
};
</script>
<style lang="scss">
aside {
  position: absolute;
  right: 0;
  display: flex;
  width: calc(2rem + 22px);
  min-height: 100vh;
  overflow: hidden;

  transition: 0.2s ease-out;

  &.is-expanded {
    width: calc($modifybar-width + 2rem + 22px);
  }

  .toggle-button {
    font-size: 1.75rem;
    color: $light-color;
    transition: 0.2s ease-out;
  }

  .bar-container {
    position: relative;
    top: 20px;
    width: auto;
    height: auto;
    background-color: $dark-alt-color;
    padding-top: 1rem;
    border-radius: 14px 0 0 14px;

    .toggle-button {
      padding: 0.5rem 0.5rem;
      cursor: pointer;

      &:hover {
        background: $gray-color;
        .toggle-button {
          color: $secondary-color;
        }
      }
    }
  }

  .modify-wrap {
    display: flex;
    flex-direction: column;
    background-color: $gray-color;
    padding: 0.8rem;
    height: 100%;
    width: $modifybar-width;
    overflow: hidden;
  }

  .modify-close {
    width: fit-content;
    height: auto;
    margin-left: auto;
    padding: 4px;
    cursor: pointer;
    &:hover {
      background: $gray-color;
      .toggle-button {
        color: $dark-alt-color;
      }
    }
  }
}
</style>
