<script setup>
import MsButton from './MsButton.vue'

defineProps({
  label: { type: String, required: true },
  iconClass: { type: String, default: 'icon-add' },
  mainVariant: { type: String, default: 'primary' }, // thường là primary
})

const emit = defineEmits(['click', 'toggle'])
</script>

<template>
  <div class="d-flex">
    <MsButton :variant="mainVariant" class="item-head-left" :icon-class="iconClass" @click="emit('click')">
      <span class="title-name pl-2">{{ label }}</span>
    </MsButton>

    <div class="more-insert-option d-flex justify-content-center align-items-center">
      <div class="btn-dropdown">
        <div class="toggle-down" role="button" tabindex="0" @click="emit('toggle')">
          <div class="icon-down"></div>
        </div>
      </div>
    </div>
  </div>
</template>