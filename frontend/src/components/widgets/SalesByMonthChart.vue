<template>
  <q-card bordered flat>
    <!-- Título arriba -->
    <q-card-section class="q-pb-none">
      <div class="text-subtitle2">{{ title }}</div>
    </q-card-section>

    <!-- Gráfico debajo -->
    <q-card-section class="q-pa-none">
      <vue3-apexcharts type="bar" height="220" :options="chartOptions" :series="series" />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Vue3Apexcharts from 'vue3-apexcharts';

const props = defineProps<{
  title?: string;
  categories: string[];
  data: number[];
}>();

const series = computed(() => [{ name: 'Ventas', data: props.data }]);

const chartOptions = computed(() => ({
  chart: { toolbar: { show: false } },
  xaxis: { categories: props.categories },
  yaxis: {
    labels: { formatter: (v: number) => `${v.toFixed(1)}M` },
  },
  dataLabels: { enabled: false },
}));
</script>
