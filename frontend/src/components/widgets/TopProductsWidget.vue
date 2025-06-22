<template>
  <q-card bordered flat>

    <q-card-section class="q-pb-none">
      <div class="text-subtitle2">{{ title }}</div>
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pa-none">
      <q-list dense>
        <q-item v-for="prod in products" :key="prod.id">
          <q-item-section>{{ prod.name }}</q-item-section>
          <q-item-section side>
            {{ prod.total.toLocaleString('es-CO', {
              style: 'currency',
              currency: 'COP'
            }) }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

  </q-card>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  products: { id: number; name: string; total: number }[]
}>()
</script>
