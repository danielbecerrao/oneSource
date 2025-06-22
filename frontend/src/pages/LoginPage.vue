<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card v-bind:style="$q.screen.lt.sm ? { width: '80%' } : { width: '30%' }">
          <q-card-section>
            <q-avatar size="103px" class="absolute-center shadow-10">
              <img alt="profile" src="~assets/profile.svg" />
            </q-avatar>
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">Inicio de sesión</div>
            </div>
          </q-card-section>
          <q-card-section align="center">
            <q-form class="q-gutter-md">
              <q-input filled v-model="username" label="Usuario" lazy-rules autocapitalize="none" />

              <q-input type="password" filled v-model="password" label="Contraseña" lazy-rules />
              <div>
                <q-btn color="primary" @click="login" label="Iniciar sesión" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { QVueGlobals } from 'quasar';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';
import { useAuthStore } from '../stores/auth';
import { storeToRefs } from 'pinia';
import type { Router } from 'vue-router';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'LoginPage',
});

const username = ref<string>('');
const password = ref<string>('');
const $q: QVueGlobals = useQuasar();
const $router: Router = useRouter();
const auth = useAuthStore();
const { token, user } = storeToRefs(auth);

const login = () => {
  if (!username.value || !password.value) {
    $q.notify({
      type: 'negative',
      message: 'Por favor, completa todos los campos.',
    });
    return;
  }

  api
    .post('/auth/login', {
      username: username.value,
      password: password.value,
    })
    .then(async (response) => {
      token.value = response.data.access_token;
      user.value = response.data.user;
      await $router.push({ name: 'index' });
    })
    .catch((error) => {
      $q.notify({
        type: 'negative',
        message: error.response?.data?.message || 'Error al iniciar sesión.',
      });
    });
};
</script>

<style>
.bg-image {
  background-image: linear-gradient(135deg, #1f07f8 0%, #5fecf7 100%);
}
</style>
