<template>
  <v-container>
    <v-card class="mx-auto">
      <v-card-title class="d-flex align-center pa-4">
        精油資料列表
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="addOil" prepend-icon="mdi-plus">
          新增精油
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-alert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          class="mb-4"
          :text="errorMessage"
        ></v-alert>

        <v-data-table
          :headers="headers"
          :items="oils"
          :loading="loading"
          class="elevation-1"
          loading-text="正在載入資料..."
          no-data-text="目前無精油資料"
        >
          <template v-slot:item.actions="{ item }">
            <v-btn
              icon="mdi-pencil"
              variant="text"
              size="small"
              @click="editOil(item.id)"
            ></v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { getFirestore, collection, getDocs, FirestoreError } from 'firebase/firestore';

// Define the structure for an Essential Oil
interface EssentialOil {
  id: string; // This is the document ID from Firestore
  oil_id: string;
  name: string;
  name_latin: string;
  'name_zh-TW': string;
  oil_type: string;
  symptoms: string[];
  type: string;
}

const oils = ref<EssentialOil[]>([]);
const loading = ref(true);
const errorMessage = ref<string | null>(null);

// Define static headers for controlled order and display names
const headers = ref([
  { title: '編號', key: 'oil_id' },
  { title: '分類', key: 'type' },
  { title: '中文名稱', key: 'name_zh_tw' },
  { title: '英文名稱', key: 'name' },
  { title: '拉丁學名', key: 'name_latin' },
  { title: '類型', key: 'oil_type' },
  { title: '對應症狀', key: 'symptoms' },  
  { title: '操作', key: 'actions', sortable: false, align: 'end' },
]);

// Fetch data from Firestore on component mount
onMounted(async () => {
  try {
    const db = getFirestore();
    const oilCollection = collection(db, 'essential_oils');
    const querySnapshot = await getDocs(oilCollection);

    oils.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<EssentialOil, 'id'>),
    }));

  } catch (error) {
    console.error("讀取精油資料時發生錯誤: ", error);
    if (error instanceof FirestoreError && error.code === 'permission-denied') {
      errorMessage.value = "權限不足，無法讀取精油資料。請確認您的 Firestore 安全性規則是否正確設定。";
    } else {
      errorMessage.value = "讀取資料時發生未預期的錯誤。";
    }
  } finally {
    loading.value = false;
  }
});

const addOil = () => {
  console.log("新增精油功能尚未實作");
  // Future implementation: router.push('/oils/new');
};

const editOil = (id: string) => {
  console.log(`編輯精油功能尚未實作，ID: ${id}`);
  // Future implementation: router.push(`/oils/edit/${id}`);
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
