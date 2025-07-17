<template>
  <v-container>
    <v-card class="mx-auto" max-width="800">
      <v-card-title class="text-h5 pa-4">
        編輯客戶資料
      </v-card-title>
      <v-card-text>
        <!-- 這裡將是編輯客戶資料的表單 -->
        <p>客戶 ID: {{ customerId }}</p>
        <p>在這裡載入並編輯客戶資料。</p>
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="grey">取消</v-btn>
        <v-btn color="primary">儲存變更</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const customerId = ref<string | string[] | null>(null);

onMounted(() => {
  //customerId.value = route.params.id as string;
  // 在這裡根據 customerId 載入客戶資料
});
</script>

<style scoped>
/* 您可以在這裡添加組件特有的樣式 */
</style>
