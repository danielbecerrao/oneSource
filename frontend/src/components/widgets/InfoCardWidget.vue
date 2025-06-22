<template>
  <q-card flat bordered class="column items-center justify-center q-pa-md">
    <div class="text-subtitle2 text-grey-7">{{ title }}</div>
    <div class="text-h4">{{ formattedValue }}</div>

    <q-badge
      :color="variation > 0 ? 'positive' : variation < 0 ? 'negative' : 'grey'"
      align="middle"
      class="q-mt-sm"
    >
      {{ variation > 0 ? '+' : '' }}{{ variation }}%
    </q-badge>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  value: number
  variation: number
}>()

const formattedValue = computed(() =>
  props.value.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })
)
</script>
