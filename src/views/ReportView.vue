<template>
  <el-alert
    type="primary"
    title="Drinkit обновил API. Заметили ошибки в данных? Контакт для связи ниже"
  />
  <el-collapse v-model="activeNames">
    <el-collapse-item
      :disabled="!loaded"
      :title="
        loaded
          ? `Данные получены в ${new Date().toLocaleTimeString('ru-RU').slice(0, 5)}`
          : 'Загрузка...'
      "
      name="auto"
    >
      <el-form :model="form" label-width="auto" label-position="top">
        <el-form-item label="Лайки">
          <el-input disabled v-model="form.likes" />
        </el-form-item>
        <el-form-item label="Дизлайки">
          <el-input disabled v-model="form.dislikes" />
        </el-form-item>
        <el-form-item label="Средняя скорость">
          <el-input disabled v-model="form.averageSpeed" />
        </el-form-item>
        <el-form-item label="Долгие заказы">
          <el-input disabled v-model="form.longOrders" />
        </el-form-item>
        <el-form-item label="Выручка">
          <el-input disabled v-model="form.earnMoney" />
        </el-form-item>
        <el-form-item label="Количество заказов">
          <el-input disabled v-model="form.countOrders" />
        </el-form-item>
        <el-form-item label="Средний чек">
          <el-input disabled v-model="form.averageBill" />
        </el-form-item>
      </el-form>
    </el-collapse-item>
  </el-collapse>
  <el-form
    class="mt-3"
    :model="form"
    ref="ruleFormRef"
    label-width="auto"
    label-position="top"
    style="max-width: 600px"
  >
    <el-button class="mb-4" type="text" plain :icon="InfoFilled" @click="infoDialogVisible = true"
      >Где получить данные?</el-button
    >
    <el-form-item label="Прирост выручки">
      <el-slider
        v-model="form.percentSalary"
        :max="100"
        :min="-100"
        size="default"
        show-input
        input-size="small"
        :show-input-controls="false"
        :format-tooltip="formatTooltip"
      />
    </el-form-item>
    <el-form-item label="Количество новых гостей">
      <el-input size="large" type="number" v-model="form.newGuests" />
    </el-form-item>
    <el-form-item label="Количество старых гостей">
      <el-input size="large" type="number" v-model="form.oldGuests" />
    </el-form-item>
    <el-form-item>
      <el-button
        :disabled="!loaded"
        type="primary"
        size="large"
        @click="successDialogVisible = true"
        class="w-full"
        >Сгенерировать отчёт</el-button
      >
    </el-form-item>
  </el-form>

  <el-dialog title="Инструкция" width="90%" v-model="infoDialogVisible">
    <div class="mt-2">
      <el-steps direction="vertical" space="70px">
        <el-step
          status="finish"
          description="оfficemanager.drinkit.ru"
          title="Перейди в менеджер офиса"
        />
        <el-step
          status="process"
          title='Перейди во вкладку "Месяц"'
          description="Убедись, что выбрана нужная кофейня"
        />
        <el-step
          status="process"
          title='Выбери тип даннных "По дням (операционка)"'
          description="Убедись, что смотришь текущий день"
        />
      </el-steps>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" class="w-full" @click="infoDialogVisible = false"
          >Понял</el-button
        >
      </div>
    </template>
  </el-dialog>

  <el-dialog title="Отчёт" width="90%" v-model="successDialogVisible">
    <template #title>
      <p class="mb-2 text-lg font-medium text-blue-500">Отчёт скопирован!</p>
    </template>
    <div>
      <el-input
        class="w-full!"
        type="textarea"
        ref="textareaRef"
        :rows="copyTextRows"
        :model-value="copyText"
        readonly
      />
    </div>
    <template #footer>
      <el-button
        class="w-full"
        size="large"
        text
        bg
        type="primary"
        @click="successDialogVisible = false"
        >Спасибо за смену 💙</el-button
      >
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed, nextTick, watch } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import partners from '@/data/partners.json'
import { InfoFilled } from '@element-plus/icons-vue'
import type { ElInput } from 'element-plus'

const route = useRoute()

const location = partners
  .find((partner) => partner.url === route.params.unit)
  ?.locations.find((location) => location.uuid === route.params.location)

interface OperationalStatisticsByUnit {
  StationaryRevenue: number
  StationaryOrderCount: number
  DeliveryRevenue: number
  DeliveryOrderCount: number
  Revenue: number
  OrderCount: number
  AvgPizzaTimePreparationInMin: number
}

const form = reactive({
  likes: null as number | null,
  dislikes: null as number | null,
  averageSpeed: null as string | null,
  longOrders: null as number | null,
  earnMoney: null as number | null,
  countOrders: null as number | null,
  averageBill: null as string | null,
  percentSalary: 0,
  newGuests: null as number | null,
  oldGuests: null as number | null,
})

const loaded = ref(false)
const infoDialogVisible = ref(false)
const successDialogVisible = ref(false)

const activeNames = ref([] as string[])

const formatTooltip = (val: number) => {
  if (val > 0) return `+${val}%`
  return `${val}%`
}

// Вычисляемый отчёт
const copyText = computed(() => {
  const reportLines = [
    `Отчёт ${location?.name} ${new Date().toLocaleDateString('ru-RU')}:`,
    `Выручка - ${form.earnMoney ?? '-'}` +
      (form.percentSalary
        ? ` (${form.percentSalary > 0 ? '+' + form.percentSalary : form.percentSalary}%)`
        : ''),
    `Заказы - ${form.countOrders ?? '-'}`,
    `Средний чек - ${form.averageBill ?? '-'}`,
    `Средняя скорость - ${form.averageSpeed ?? '-'}`,
    `Долгих - ${form.longOrders ?? '-'}`,
    `Лайки - ${form.likes ?? '-'}`,
    `Дизлайки - ${form.dislikes ?? '-'}`,
    form.newGuests ? `Новых гостей - ${form.newGuests}` : '',
    form.oldGuests ? `Старых гостей - ${form.oldGuests}` : '',
  ].filter((line) => line.trim() !== '')
  return reportLines.join('\n')
})

const textareaRef = ref<InstanceType<typeof ElInput> | null>(null)

watch(successDialogVisible, async (visible) => {
  if (visible) {
    await nextTick()
    // Получаем нативный textarea внутри компонента
    const textarea = textareaRef.value?.$el?.querySelector('textarea')
    if (textarea) {
      textarea.select()
      try {
        await navigator.clipboard.writeText(textarea.value)
      } catch {
        document.execCommand('copy')
      }
    }
  }
})

const copyTextRows = computed(() => {
  return copyText.value.split('\n').length
})

// Функция форматирования секунд в MM:SS
const toHHMMSS = (time: any) => {
  const sec_num = parseInt(time, 10) || 0
  let hours = Math.floor(sec_num / 3600)
  let minutes = Math.floor((sec_num - hours * 3600) / 60)
  let seconds = sec_num - hours * 3600 - minutes * 60

  const hoursStr = hours < 10 ? '0' + hours : '' + hours
  const minutesStr = minutes < 10 ? '0' + minutes : '' + minutes
  const secondsStr = seconds < 10 ? '0' + seconds : '' + seconds

  return `${minutesStr}:${secondsStr}`
}

onMounted(async () => {
  if (!location?.id) return
  try {
    const resOperational = await axios.get(
      `https://publicapi.drinkit.dodois.io/ru/api/v1/OperationalStatisticsByUnit/${location.id}`,
    )
    const operationalData = resOperational.data as OperationalStatisticsByUnit
    form.earnMoney = operationalData.Revenue ?? null
    form.countOrders = operationalData.OrderCount ?? null
    form.averageBill = operationalData.OrderCount
      ? (operationalData.Revenue / operationalData.OrderCount).toFixed(2)
      : null

    const resMotivation = await axios.get(
      `https://dodo-proxy.kirill-troitskij.workers.dev/api/v1/boards?countryId=643&unitId=${location.uuid}`,
    )
    const motivationData = resMotivation.data
    form.likes = motivationData.orderRatingCounter.likeCount ?? null
    form.dislikes = motivationData.orderRatingCounter.dislikeCount ?? null
    form.averageSpeed = toHHMMSS(motivationData.todayCounter.readySecondsAvg ?? null)
    form.longOrders = motivationData.todayCounter.ratedOrderCounts.slow ?? 0

    loaded.value = true
  } catch (error) {
    console.error('Ошибка загрузки данных:', error)
  }
})
</script>
