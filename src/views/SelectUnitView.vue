<template>
  <div class="h-10/12 flex items-center justify-center flex-col">
    <h2 class="text-4xl text-center mb-5 mt-4">Выбор партнёра</h2>
    <div class="flex items-center justify-center flex-wrap gap-4">
      <el-button
        v-for="partner in partners"
        v-bind:key="partner.number"
        @click="goTo(partner.url)"
        size="large"
        class="h-auto! w-auto min-w-56 mx-0!"
        ><span class="text-3xl! block"
          >{{ partner.number }}<br /><span class="text-xl font-normal">Юнит</span></span
        ></el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import partners from '@/data/partners.json'

const goTo = (partner: string) => {
  router.push({ path: partner })
}
</script>
