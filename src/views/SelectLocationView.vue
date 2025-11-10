<template>
  <el-alert
    title="Закрепите новую ссылку!"
    effect="dark"
    :description="`kingdomstay.github.io/drinkit-reports/${route.params.unit}`"
    type="error"
    :show-after="1500"
  />
  <div class="mt-5 flex items-center justify-center flex-col">
    <div class="flex items-center justify-center flex-wrap gap-4">
      <el-button
        v-for="location in locations"
        v-bind:key="location.id"
        @click="goTo(location.uuid)"
        size="large"
        class="h-auto! w-full min-w-56 mx-0!"
        ><span class="text-2xl! block"
          >{{ location.number }}<br /><span class="text-lg font-normal">{{
            location.name
          }}</span></span
        ></el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import partners from '@/data/partners.json'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const partner = partners.find((partner) => partner.url === route.params.unit)
const locations = partner!.locations

const goTo = (location: string) => {
  router.push({ path: `${route.params.unit}/${location}` })
}
</script>
