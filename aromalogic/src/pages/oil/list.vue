<template>
  <v-container>
    <v-card class="mx-auto">
      <v-card-title class="d-flex align-center pa-4">
        精油資料列表
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="addOil" prepend-icon="mdi-plus">
          新增精油
        </v-btn>
        <v-btn color="secondary" @click="triggerFileInput" prepend-icon="mdi-upload" class="ml-2">
          匯入精油
        </v-btn>
        <input type="file" ref="fileInput" style="display: none;" @change="handleFileUpload" accept=".csv,.txt" />
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
          <!-- Template for editable text fields -->
          <template v-slot:item.name="{ item }">
            <v-text-field v-if="editingId === item.id && editingItem" v-model="editingItem.name" dense hide-details></v-text-field>
            <span v-else>{{ item.name }}</span>
          </template>
          <template v-slot:item.name_latin="{ item }">
            <v-text-field v-if="editingId === item.id && editingItem" v-model="editingItem.name_latin" dense hide-details></v-text-field>
            <span v-else>{{ item.name_latin }}</span>
          </template>
          <template v-slot:item.name_zh_tw="{ item }">
            <v-text-field v-if="editingId === item.id && editingItem" v-model="editingItem['name_zh_tw']" dense hide-details></v-text-field>
            <span v-else>{{ item['name_zh_tw'] }}</span>
          </template>
          <template v-slot:item.oil_type="{ item }">
            <v-text-field v-if="editingId === item.id && editingItem" v-model="editingItem.oil_type" dense hide-details></v-text-field>
            <span v-else>{{ item.oil_type }}</span>
          </template>
          <template v-slot:item.type="{ item }">
            <v-text-field v-if="editingId === item.id && editingItem" v-model="editingItem.type" dense hide-details></v-text-field>
            <span v-else>{{ item.type }}</span>
          </template>

          <!-- Template for symptoms using v-combobox -->
          <template v-slot:item.symptoms="{ item }">
            <v-combobox
              v-if="editingId === item.id && editingItem"
              v-model="editingItem.symptoms"
              chips
              clearable
              multiple
              closable-chips
              label="新增或移除症狀"
              :items="[]"
              hide-details
              variant="underlined"
            ></v-combobox>
            <div v-else>
              <v-chip v-for="symptom in item.symptoms" :key="symptom" class="ma-1" small label>{{ symptom }}</v-chip>
            </div>
          </template>

          <!-- Template for actions (edit/save/cancel) -->
          <template v-slot:item.actions="{ item }">
            <div v-if="editingId === item.id">
              <v-btn icon="mdi-content-save" variant="text" size="small" @click="saveChanges" :loading="isSaving"></v-btn>
              <v-btn icon="mdi-close-circle-outline" variant="text" size="small" @click="cancelEdit"></v-btn>
            </div>
            <div v-else>
              <v-btn icon="mdi-pencil" variant="text" size="small" @click="startEdit(item)"></v-btn>
            </div>
          </template>

        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { getFirestore, collection, getDocs, doc, updateDoc, setDoc, FirestoreError } from 'firebase/firestore';
import Papa from 'papaparse';

interface EssentialOil {
  id: string;
  oil_id: string;
  name: string;
  name_latin: string;
  'name_zh_tw': string;
  oil_type: string;
  symptoms: string[];
  type: string;
}

const oils = ref<EssentialOil[]>([]);
const loading = ref(true);
const isSaving = ref(false);
const errorMessage = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    loading.value = true;
    errorMessage.value = null;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const db = getFirestore();
        const oilCollection = collection(db, 'essential_oils');
        let successCount = 0;
        let errorCount = 0;

        for (const data of results.data) {
          try {
            // Ensure oil_id exists and is a string
            const oilData = data as EssentialOil;
            if (oilData.oil_id) {
              // Process symptoms field: convert comma-separated string to array
              if (typeof oilData.symptoms === 'string') {
                oilData.symptoms = oilData.symptoms.split(',').map(s => s.trim()).filter(s => s.length > 0);
              }
              await setDoc(doc(oilCollection, oilData.oil_id), oilData, { merge: true });
              successCount++;
            } else {
              console.warn('Skipping row due to missing oil_id:', data);
              errorCount++;
            }
          } catch (e) {
            console.error('Error adding/updating document:', data, e);
            errorCount++;
          }
        }
        errorMessage.value = `匯入完成：成功 ${successCount} 筆，失敗 ${errorCount} 筆。`;
        loading.value = false;
        // Refresh the list after import
        await fetchOils();
      },
      error: (err: Error) => {
        errorMessage.value = `檔案解析失敗: ${err.message}`;
        loading.value = false;
      }
    });
  }
};

const fetchOils = async () => {
  loading.value = true;
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
};

onMounted(async () => {
  await fetchOils();
});

const editingId = ref<string | null>(null);
const editingItem = ref<EssentialOil | null>(null);

// Define a type for the header items to ensure correct 'align' type
interface DataTableHeader {
  title: string;
  key: string;
  align?: 'start' | 'end' | 'center';
  sortable?: boolean;
  width?: string;
}

const headers = ref<DataTableHeader[]>([
  { title: '編號', key: 'oil_id' },
  { title: '分類', key: 'type' },
  { title: '中文名稱', key: 'name_zh_tw' },
  { title: '英文名稱', key: 'name' },
  { title: '拉丁學名', key: 'name_latin' },
  { title: '類型', key: 'oil_type' },
  { title: '對應症狀', key: 'symptoms', width: '25%' },  
  { title: '操作', key: 'actions', sortable: false, align: 'end' },
]);

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

const startEdit = (item: EssentialOil) => {
  editingId.value = item.id;
  // Create a deep copy for editing to allow cancellation
  editingItem.value = JSON.parse(JSON.stringify(item));
};

const cancelEdit = () => {
  editingId.value = null;
  editingItem.value = null;
};

const saveChanges = async () => {
  if (!editingId.value || !editingItem.value) return;

  isSaving.value = true;
  errorMessage.value = null;

  try {
    const db = getFirestore();
    const oilDocRef = doc(db, 'essential_oils', editingId.value);
    
    // Create a plain object from the reactive ref for Firestore
    const dataToUpdate = { ...editingItem.value };
    delete (dataToUpdate as any).id; // Do not save the document ID inside the document itself

    await updateDoc(oilDocRef, dataToUpdate);

    // Update the local array to reflect the changes
    const index = oils.value.findIndex(o => o.id === editingId.value);
    if (index !== -1) {
      oils.value[index] = { ...editingItem.value };
    }

    // Exit editing mode
    cancelEdit();

  } catch (error) {
    console.error("儲存精油資料時發生錯誤: ", error);
    errorMessage.value = "儲存失敗，請稍後再試。";
  } finally {
    isSaving.value = false;
  }
};

const addOil = () => {
  console.log("新增精油功能尚未實作");
};

</script>

<style scoped>
/* Add any component-specific styles here */
</style>