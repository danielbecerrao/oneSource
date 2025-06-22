<template>
  <q-page class="row">
    <q-drawer show-if-above bordered :width="220">
      <q-scroll-area class="fit q-pa-sm">
        <div class="text-overline">Añadir widget</div>

        <q-list separator>
          <q-item v-if="!currentDashboard" clickable v-ripple @click="openDialogDashboard()">
            <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
            <q-item-section>Crear Dashboard</q-item-section>
          </q-item>
          <template v-else>
            <q-item clickable v-ripple @click="openDialogWidgets('info')">
              <q-item-section avatar><q-icon name="info" /></q-item-section>
              <q-item-section>Tarjeta Informativa</q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="openDialogWidgets('top')">
              <q-item-section avatar><q-icon name="list" /></q-item-section>
              <q-item-section>Top Productos</q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="openDialogWidgets('chart')">
              <q-item-section avatar><q-icon name="bar_chart" /></q-item-section>
              <q-item-section>Ventas por Mes</q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <div class="col">
      <div class="text-h6 q-pa-md">
        {{ currentDashboard ? currentDashboard.name : 'Crea un Dashboard' }} 
      </div>
      <GridLayout
        v-model:layout="layout"
        :row-height="30"
        :col-num="12"
        :is-draggable="true"
        :is-resizable="true"
        @layout-updated="onLayoutUpdated"
      >
        <template #item="{ item }">
          <div class="widget-wrapper">
            <q-btn
              icon="close"
              round
              dense
              flat
              color="negative"
              class="delete-btn"
              @click.stop="removeWidget(item.i)"
            />
            <component
              :is="resolveWidget((item as DashboardItem).type)"
              v-bind="(item as DashboardItem).props"
              class="fit"
            />
          </div>
        </template>
      </GridLayout>
    </div>

    <q-dialog v-model="dialogWidgets.open" persistent>
      <q-card style="min-width: 360px">
        <q-card-section>
          <div class="text-h6">Configurar {{ dialogLabels[dialogWidgets.type!] }}</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form ref="formRef" @submit.prevent.stop>
            <div v-if="dialogWidgets.type === 'info'">
              <q-input v-model.number="formInfo.value" label="Valor" type="number" />
              <q-input v-model.number="formInfo.variation" label="% Variación" type="number" />
              <q-input v-model="formInfo.title" label="Título" />
            </div>

            <div v-else-if="dialogWidgets.type === 'chart'">
              <q-input v-model="formChart.title" label="Título" class="q-mb-sm" />
              <q-select
                v-model="formChart.months"
                :options="monthOptions"
                label="Meses"
                multiple
                use-chips
                emit-value
                :rules="[(val) => val.length > 0 || 'Selecciona al menos un mes']"
              />
              <q-input
                v-model="formChart.dataCsv"
                label="Datos (csv: 3.2,4.1,4.8)"
                :rules="[validateDataCount]"
                class="q-mt-sm"
              />
            </div>

            <div v-else-if="dialogWidgets.type === 'top'">
              <q-input v-model="formTop.title" label="Título" class="q-mb-sm" />

              <q-list bordered separator>
                <q-item v-for="row in formTop.items" :key="row.id">
                  <q-item-section>
                    <q-input
                      v-model="row.name"
                      label="Producto"
                      dense
                      outlined
                      :rules="[(val) => val.trim() !== '' || 'Requerido']"
                    />
                  </q-item-section>

                  <q-item-section side style="min-width: 120px">
                    <q-input
                      v-model.number="row.total"
                      label="Total"
                      dense
                      outlined
                      type="number"
                      :rules="[(val) => val > 0 || '≥ 1']"
                    />
                  </q-item-section>

                  <q-item-section side>
                    <q-btn
                      icon="delete"
                      dense
                      flat
                      round
                      color="negative"
                      @click="removeProduct(row.id)"
                    />
                  </q-item-section>
                </q-item>
              </q-list>

              <q-btn
                icon="add"
                label="Añadir fila"
                color="primary"
                flat
                dense
                class="q-mt-sm"
                @click="addProductRow"
                :disable="formTop.items.length >= 5"
              />
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn flat label="Agregar" color="primary" @click="addWidget" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogDashboard.open" persistent>
      <q-card style="min-width: 360px">
        <q-card-section>
          <div class="text-h6">Crear Dashboard</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form ref="formRef" @submit.prevent.stop>
            <q-input v-model="dashboard.name" label="Nombre del Dashboard" />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn flat label="Crear" color="primary" @click="addDashboard" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { GridLayout } from 'grid-layout-plus';
import { reactive, ref, onMounted } from 'vue';
import type { LayoutItem } from 'grid-layout-plus';
import { QForm, useQuasar } from 'quasar';
import { api } from 'boot/axios';

import InfoCardWidget from 'src/components/widgets/InfoCardWidget.vue';
import TopProductsWidget from 'src/components/widgets/TopProductsWidget.vue';
import SalesByMonthChart from 'src/components/widgets/SalesByMonthChart.vue';
import { useDebounceFn } from '@vueuse/core';
import type {
  InfoProps,
  DashboardItem,
  Product,
  ChartProps,
  TopProps,
  BackendWidget,
} from '../types/dashboard';

const layout = reactive<DashboardItem[]>([]);

const dialogWidgets = reactive<{ open: boolean; type: null | 'info' | 'top' | 'chart' }>({
  open: false,
  type: null,
});
const dialogDashboard = reactive<{ open: boolean }>({ open: false });
const dialogLabels = { info: 'Tarjeta Informativa', top: 'Top Productos', chart: 'Ventas por Mes' };

const formRef = ref<QForm>();
const $q = useQuasar();

const dashboard = reactive<{ name: string }>({ name: '' });

const currentDashboard = ref();

const formInfo = reactive<InfoProps>({ title: 'Ventas', value: 0, variation: 0 });

const formChart = reactive({
  title: 'Ventas por Mes',
  months: [] as string[],
  dataCsv: '',
});

function validateDataCount(csv: string) {
  const dataArr = csv.split(',').filter((s) => s.trim() !== '');
  return (
    dataArr.length === formChart.months.length || `Se necesitan ${formChart.months.length} valores`
  );
}

const formTop = reactive<{
  title: string;
  items: Product[];
}>({
  title: 'Top Productos',
  items: [{ id: 1, name: '', total: 0 }],
});

function addProductRow() {
  formTop.items.push({ id: Date.now(), name: '', total: 0 });
}

function removeProduct(id: number) {
  formTop.items = formTop.items.filter((p) => p.id !== id);
}

const monthOptions = [
  { label: 'Enero', value: 'Ene' },
  { label: 'Febrero', value: 'Feb' },
  { label: 'Marzo', value: 'Mar' },
  { label: 'Abril', value: 'Abr' },
  { label: 'Mayo', value: 'May' },
  { label: 'Junio', value: 'Jun' },
  { label: 'Julio', value: 'Jul' },
  { label: 'Agosto', value: 'Ago' },
  { label: 'Septiembre', value: 'Sep' },
  { label: 'Octubre', value: 'Oct' },
  { label: 'Noviembre', value: 'Nov' },
  { label: 'Diciembre', value: 'Dic' },
];

function openDialogWidgets(type: 'info' | 'top' | 'chart') {
  dialogWidgets.open = true;
  dialogWidgets.type = type;
}

function openDialogDashboard() {
  dialogDashboard.open = true;
  dashboard.name = '';
}

async function addWidget() {
  const isValid = await formRef.value?.validate();
  if (!isValid || !dialogWidgets.type) return;

  const base: LayoutItem = { x: 0, y: 0, w: 4, h: 6, i: '' };
  let newWidget: DashboardItem;

  if (dialogWidgets.type === 'info') {
    newWidget = { ...base, w: 3, h: 3, type: 'info', props: { ...formInfo } } as DashboardItem;
  } else if (dialogWidgets.type === 'chart') {
    newWidget = {
      ...base,
      h: 7,
      type: 'chart',
      props: {
        title: formChart.title,
        categories: [...formChart.months],
        data: formChart.dataCsv.split(',').map(Number),
      },
    } as DashboardItem;
  } else {
    const ok = formTop.items.every((p) => p.name.trim() && p.total > 0);
    if (!ok) {
      $q.notify({ type: 'negative', message: 'Completa todos los productos' });
      return;
    }
    newWidget = {
      ...base,
      type: 'top',
      props: { title: formTop.title, products: formTop.items.slice(0, 5) },
    } as DashboardItem;
  }

  const widgetWithId = await createWidget(newWidget);
  if (!widgetWithId) return;

  layout.push(widgetWithId);

  dialogWidgets.open = false;
}

async function createWidget(widget: DashboardItem): Promise<DashboardItem | null> {
  try {
    const { data } = await api.post('/widgets', {
      dashboardId: currentDashboard.value.id,
      type: widget.type,
      config: widget.props,
      x: widget.x,
      y: widget.y,
      w: widget.w,
      h: widget.h,
    });

    widget.i = data.id;
    return widget;
  } catch (err: unknown) {
    let message = 'Error al crear el widget';
    interface ApiError {
      response?: {
        data?: {
          message?: string;
        };
      };
    }
    const apiErr = err as ApiError;
    if (
      typeof apiErr === 'object' &&
      apiErr !== null &&
      apiErr.response &&
      typeof apiErr.response.data?.message === 'string'
    ) {
      message = apiErr.response.data.message;
    }
    $q.notify({
      type: 'negative',
      message,
    });
    return null;
  }
}

function resolveWidget(type: DashboardItem['type']) {
  switch (type) {
    case 'info':
      return InfoCardWidget;
    case 'chart':
      return SalesByMonthChart;
    case 'top':
      return TopProductsWidget;
  }
}

async function removeWidget(id: string | number) {
  const idx = layout.findIndex((w) => w.i === id);
  if (idx !== -1) layout.splice(idx, 1);
  await api.delete(`/widgets/${id}`).catch(console.error);
}

function addDashboard() {
  api
    .post('/dashboards', {
      name: dashboard.name,
    })
    .then((response) => {
      currentDashboard.value = response.data;
      $q.notify({
        type: 'positive',
        message: `Dashboard "${dashboard.name}" creado exitosamente.`,
      });
      dashboard.name = '';
      dialogDashboard.open = false;
    })
    .catch((error) => {
      $q.notify({
        type: 'negative',
        message: error.response?.data?.message || 'Error al crear el Dashboard.',
      });
    });
}

function getDashboard() {
  api
    .get('/dashboards')
    .then(({ data }) => {
      if (data.length > 0) {
        currentDashboard.value = data[0];
        layout.splice(0, layout.length, ...data[0].widgets.map(mapBackendWidget));
      }
    })
    .catch((error) => {
      $q.notify({
        type: 'negative',
        message: error.response?.data?.message || 'Error al obtener los Dashboards.',
      });
    });
}

const syncPositions = useDebounceFn(() => {
  const payload = layout.map((item) => ({
    id: item.i,
    x: item.x,
    y: item.y,
    w: item.w,
    h: item.h,
  }));
  api.patch('/widgets/positions', payload).catch(console.error);
}, 500);

async function onLayoutUpdated() {
  await syncPositions();
}

function mapBackendWidget(w: BackendWidget): DashboardItem {
  const base = {
    x: w.x,
    y: w.y,
    w: w.w,
    h: w.h,
    i: w.id,
  };

  switch (w.type) {
    case 'info':
      return {
        ...base,
        type: 'info',
        props: w.config as InfoProps,
      };
    case 'chart':
      return {
        ...base,
        type: 'chart',
        props: w.config as ChartProps,
      };
    case 'top':
      return {
        ...base,
        type: 'top',
        props: w.config as TopProps,
      };
    default:
      throw new Error(`Tipo de widget desconocido: ${w.type as string}`);
  }
}

onMounted(() => {
  getDashboard();
});
</script>

<style scoped>
.vgl-layout {
  background: #eee;
}
:deep(.vgl-item:not(.vgl-item--placeholder)) {
  background: #fafafa;
  border: 1px dashed #ccc;
}
.widget-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}
.delete-btn {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
}
</style>
