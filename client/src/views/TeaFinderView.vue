<script setup>
import { ref } from "vue";
import axios from 'axios'
const loading = ref(false)
const search = ref('')
const results = ref([])

// 根据输入内容发送搜索请求
const searchForTea = async () => {
  results.value = []
  loading.value = true
  const res = await axios.post('http://localhost:3000/search', {
    name: search.value
  })
  loading.value = false
  results.value = res.data.teas
}
</script>

<template>
  <a-space>
    <a-input v-model="search" placeholder="Search for a cup of tea..." allow-clear size="large" />
    <a-button type="primary" @click="searchForTea">Click Me!</a-button>
  </a-space>

  <a-space direction="vertical" style="width: 100%; margin-top: 20px;">
    <p v-if="loading">Preparing for a tea party...</p>
    <p v-else-if="results.length == 0">{{`Currently no suitable tea for the party :(`}}</p>

    <a-grid justify="start" :colGap="12" :rowGap="16" :cols="{ xs: 1, sm: 2, md: 2, lg: 4, xl: 4, xxl: 6 }">
      <a-grid-item v-for="tea in results">
        <a-card hoverable :style="{ width: '100%' }">
          <template #cover>
            <div :style="{ height: '200px', overflow: 'hidden', display: 'flex', alignItems: 'center' }">
              <img :style="{ width: '100%' }" :alt="tea.name" :src="tea.picture" />
            </div>
          </template>
          <a-card-meta>
            <template #description>
              <a-descriptions :title="tea.name" :column="1">
                <a-descriptions-item label="Country of origin"><a-tag>{{ tea.countryOfOrigin
                }}</a-tag></a-descriptions-item>
                <a-descriptions-item label="Color"><a-tag>{{ tea.color }}</a-tag></a-descriptions-item>
                <a-descriptions-item label="Ingredients"><a-tag>{{ tea.ingredients }}</a-tag></a-descriptions-item>
              </a-descriptions>
            </template>
          </a-card-meta>
        </a-card>
      </a-grid-item>
    </a-grid>
  </a-space>
</template>

<style scoped>
.tea-result {
  display: flex;
  align-items: center;
  gap: 20px;
}
</style>
