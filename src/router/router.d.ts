import { RouteMeta } from 'vue-router'

declare module "vue-router" {
  interface RouteMeta {
    // is optional
    requireInternet?: boolean;
  }
}
