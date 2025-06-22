import { defineBoot } from '#q-app/wrappers';
import axios, { type AxiosInstance } from 'axios';
import { useAuthStore } from 'src/stores/auth';

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: process.env.BASEURL ?? 'http://127.0.0.1:3000' })

export default defineBoot(({ app, store }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api
  const auth = useAuthStore(store)
  api.interceptors.request.use(config => {
    config.headers.authorization = 'Bearer ' + auth.token
    config.headers.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    return config
  })
  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
