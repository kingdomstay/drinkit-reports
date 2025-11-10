<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import partners from './data/partners.json'

const route = useRoute()
const router = useRouter()

const getLocationName = () => {
  if (route.params.location && route.params.unit) {
    const location = partners
      .find((partner) => partner.url === route.params.unit)
      ?.locations.find((location) => location.uuid === route.params.location)
    return location?.name
  }
}
</script>

<template>
  <div class="common-layout">
    <el-container class="bg-white">
      <el-header
        class="bg-white flex z-50 items-center fixed top-0 left-0 w-full border-b border-b-gray-300"
      >
        <el-image src="/logo.svg" class="h-2/4 w-auto mr-3" />
        <h1
          :class="{
            'cursor-pointer': route.params.location,
            'hover:bg-gray-100': route.params.location,
          }"
          @click="route.params.location ? router.push({ path: `/${route.params.unit}` }) : null"
        >
          {{ route.params.location ? 'К выбору' : 'Генератор отчета' }}
        </h1>
        <p class="ml-1 text-gray-500" v-if="route.params.location">/ {{ getLocationName() }}</p>
      </el-header>
      <el-main class="mt-16 min-h-screen flex flex-col">
        <router-view />
      </el-main>
      <el-footer class="flex mt-10 items-center justify-center text-center leading-relaxed">
        <a class="text-center text-blue-500 p-1" href="https://t.me/kingdomstay"
          >@kingdomstay ❤️</a
        ></el-footer
      >
    </el-container>
  </div>
</template>

<style scoped></style>
