<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'primary' }, // primary | secondary-2 | link
  iconClass: { type: String, default: '' }, // vd: "icon-add"
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  title: { type: String, default: '' },
  extraClass: { type: [String, Array, Object], default: '' },
})

const classes = computed(() => {
  if (props.variant === 'link') return ['btn-link', props.extraClass]
  if (props.variant === 'secondary-2') return ['btn', 'btn-secondary-2', props.extraClass]
  return ['btn', 'btn-primary', props.extraClass]
})
</script>

<template>
  <button :type="type" :class="classes" :disabled="disabled" :title="title">
    <span v-if="iconClass" :class="iconClass"></span>
    <span v-if="$slots.default" class="btn-text">
      <slot />
    </span>
  </button>
</template>