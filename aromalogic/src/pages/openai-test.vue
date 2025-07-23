<template>
  <v-container>
    <v-card class="mx-auto" max-width="800">
      <v-card-title class="d-flex align-center pa-4">
        OpenAI API 測試頁面
      </v-card-title>
      <v-card-text>
        <v-textarea
          v-model="prompt"
          label="輸入您的提示詞"
          rows="5"
          variant="outlined"
          class="mb-4"
        ></v-textarea>
        <v-btn color="primary" @click="callOpenAI" :loading="loading" :disabled="loading">
          發送請求
        </v-btn>

        <v-alert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          class="mt-4"
          :text="errorMessage"
        ></v-alert>

        <v-card v-if="response" class="mt-4" variant="outlined">
          <v-card-title>AI 回應:</v-card-title>
          <v-card-text style="white-space: pre-wrap;">{{ response }}</v-card-text>
        </v-card>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getOpenAICompletion } from '@/services/openaiService';

const prompt = ref('請用中文簡要介紹芳香療法。');
const response = ref<string | null>(null);
const loading = ref(false);
const errorMessage = ref<string | null>(null);

const callOpenAI = async () => {
  loading.value = true;
  errorMessage.value = null;
  response.value = null;
  try {
    const result = await getOpenAICompletion(prompt.value);
    if (result) {
      response.value = result;
    } else {
      errorMessage.value = '未能從 OpenAI 獲得回應。';
    }
  } catch (error) {
    console.error('呼叫 OpenAI 失敗:', error);
    errorMessage.value = `呼叫 OpenAI 失敗: ${error instanceof Error ? error.message : String(error)}`;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>