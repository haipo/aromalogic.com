<template>
  <v-container>
    <v-row>
      <!-- Main Content Column -->
      <v-col cols="12" md="8">
        <!-- Block 3: Formulation Record -->
        <v-card>
          <v-card-title>精油調配紀錄表</v-card-title>
          <v-card-text>
            <!-- 3-1: Symptoms -->
            <v-textarea
              v-model="caseRecord.symptoms_text"
              label="處理症狀"
              rows="3"
              variant="outlined"
              class="mb-4"
            ></v-textarea>

            <!-- 3-2: Essential Oil Formula -->
            <h3 class="text-h6 mb-2">精油配方</h3>
            <v-row v-for="(oil, index) in caseRecord.essential_oils" :key="index" align="center">
              <v-col cols="12" sm="4">
                <v-autocomplete
                  v-model="oil.name"
                  :items="essentialOilsFullData"
                  :item-title="item => `${item['name_zh_tw']} (${item.name})`"
                  item-value="name"
                  label="精油名稱"
                  variant="underlined"
                  hide-details
                  @update:modelValue="onOilNameChange(oil)"
                ></v-autocomplete>
              </v-col>
              <v-col cols="5" sm="2">
                <v-text-field
                  v-model.number="oil.dosage"
                  label="劑量 (滴)"
                  type="number"
                  variant="underlined"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="7" sm="5">
                 <v-combobox
                  v-model="oil.expected_effect"
                  :items="getSymptomsForOil(oil.name)"
                  label="預期處理症狀"
                  multiple
                  chips
                  closable-chips
                  variant="underlined"
                  hide-details
                  :disabled="!oil.name"
                ></v-combobox>
              </v-col>
              <v-col cols="12" sm="1">
                <v-btn icon="mdi-delete-outline" size="small" variant="text" @click="removeEssentialOil(index)"></v-btn>
              </v-col>
            </v-row>
            <v-btn text color="primary" @click="addEssentialOil" class="mt-2">+ 新增精油</v-btn>

            <v-divider class="my-6"></v-divider>

            <!-- 3-3: Vegetable Oil -->
            <h3 class="text-h6 mb-2">植物油</h3>
             <v-row v-for="(oil, index) in caseRecord.vegetable_oils" :key="index" align="center">
                <v-col cols="12" sm="5">
                    <v-text-field v-model="oil.name" label="植物油名稱" variant="underlined" hide-details></v-text-field>
                </v-col>
                <v-col cols="6" sm="3">
                    <v-text-field v-model.number="oil.dosage_ml" label="劑量 (ml)" type="number" variant="underlined" hide-details></v-text-field>
                </v-col>
                <v-col cols="6" sm="3">
                    <v-text-field v-model="oil.expected_effect" label="預期功效" variant="underlined" hide-details></v-text-field>
                </v-col>
                 <v-col cols="12" sm="1">
                    <v-btn icon="mdi-delete-outline" size="small" variant="text" @click="removeVegetableOil(index)"></v-btn>
                </v-col>
            </v-row>
            <v-btn text color="primary" @click="addVegetableOil" class="mt-2">+ 新增植物油</v-btn>

            <v-divider class="my-6"></v-divider>

            <!-- 3-4: Lifestyle Advice -->
            <h3 class="text-h6 mb-2">生活建議</h3>
            <v-textarea
              v-model="caseRecord.lifestyle_advice"
              label="生活建議"
              rows="4"
              variant="outlined"
            ></v-textarea>

          </v-card-text>
           <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
                <v-btn color="primary" variant="elevated" @click="saveCaseRecord">儲存個案紀錄</v-btn>
            </v-card-actions>
        </v-card>
      </v-col>

      <!-- Side Column -->
      <v-col cols="12" md="4">
        <!-- Block 1: Customer Data -->
        <v-card class="mb-6">
          <v-card-title>客戶基本資料</v-card-title>
          <v-card-text v-if="loadingCustomer">載入中...</v-card-text>
          <v-card-text v-else-if="customer">
            <v-list-item><strong>姓名:</strong> {{ customer.name }}</v-list-item>
            <v-list-item><strong>性別:</strong> {{ customer.gender }}</v-list-item>
            <v-list-item><strong>生日:</strong> {{ customer.birthdate }}</v-list-item>
            <v-list-item><strong>手機:</strong> {{ customer.phone }}</v-list-item>
            <v-list-item><strong>Email:</strong> {{ customer.email }}</v-list-item>
            <v-list-item><strong>身高:</strong> {{ customer.height }} cm</v-list-item>
            <v-list-item><strong>體重:</strong> {{ customer.weight }} kg</v-list-item>
            <v-list-item><strong>慢性病:</strong> {{ customer.chronic_illness }}</v-list-item>
            <v-list-item><strong>長期服藥:</strong> {{ customer.long_term_medication }}</v-list-item>
            <v-list-item><strong>過敏:</strong> {{ customer.allergies }}</v-list-item>
            <v-list-item><strong>懷孕狀態:</strong> {{ customer.is_pregnant ? '是' : '否' }}</v-list-item>
          </v-card-text>
          <v-card-text v-else>找不到客戶資料。</v-card-text>
        </v-card>

        <!-- Block 2: Case History (Placeholder) -->
        <v-card>
          <v-card-title>歷史個案資料</v-card-title>
          <v-card-text>
            <p class="text-grey">此功能開發中。</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// --- Interfaces ---
interface Customer {
  id: string;
  name: string;
  gender?: string;
  phone?: string;
  email?: string;
  birthdate?: string;
  height?: number;
  weight?: number;
  chronic_illness?: string;
  long_term_medication?: string;
  allergies?: string;
  is_pregnant?: boolean;
}

interface EssentialOilEntry {
  name: string | null; // This will now store the English name (the value)
  dosage: number | null;
  expected_effect: string[];
}

interface VegetableOilEntry {
    name: string;
    dosage_ml: number | null;
    expected_effect: string;
}

interface CaseRecord {
  symptoms_text: string;
  essential_oils: EssentialOilEntry[];
  vegetable_oils: VegetableOilEntry[];
  lifestyle_advice: string;
}

// --- State ---
const route = useRoute();
const customer = ref<Customer | null>(null);
const loadingCustomer = ref(true);
const essentialOilsFullData = ref<any[]>([]); // To store full oil data for the dropdown

const caseRecord = reactive<CaseRecord>({
  symptoms_text: '',
  essential_oils: [{ name: null, dosage: null, expected_effect: [] }],
  vegetable_oils: [{ name: '', dosage_ml: null, expected_effect: '' }],
  lifestyle_advice: '',
});

// --- Functions ---

// Fetch customer details and essential oil list on mount
onMounted(async () => {
  const customerId = route.query.customerId as string;
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user || !customerId) {
    console.error("未提供使用者或客戶ID");
    loadingCustomer.value = false;
    return;
  }

  const db = getFirestore();

  // Fetch customer data
  try {
    const customerDocRef = doc(db, 'users', user.uid, 'clients', customerId);
    const docSnap = await getDoc(customerDocRef);
    if (docSnap.exists()) {
      customer.value = { id: docSnap.id, ...docSnap.data() } as Customer;
    } else {
      console.error("找不到客戶資料");
    }
  } catch (error) {
    console.error("讀取客戶資料失敗: ", error);
  } finally {
    loadingCustomer.value = false;
  }

  // Fetch essential oil full data for autocomplete
  try {
    const oilCollection = collection(db, 'essential_oils');
    const querySnapshot = await getDocs(oilCollection);
    essentialOilsFullData.value = querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error("讀取精油列表失敗: ", error);
  }
});

// --- Essential Oil Management ---
const addEssentialOil = () => {
  caseRecord.essential_oils.push({ name: null, dosage: null, expected_effect: [] });
};

const removeEssentialOil = (index: number) => {
  caseRecord.essential_oils.splice(index, 1);
};

const getSymptomsForOil = (oilName: string | null): string[] => {
  if (!oilName) return [];
  // Search by the English name, which is the value of the autocomplete
  const selectedOil = essentialOilsFullData.value.find(o => o.name === oilName);
  return selectedOil ? selectedOil.symptoms || [] : [];
};

const onOilNameChange = (oilEntry: EssentialOilEntry) => {
  oilEntry.expected_effect = []; // Reset symptoms when a new oil is chosen
};

// --- Vegetable Oil Management ---
const addVegetableOil = () => {
    caseRecord.vegetable_oils.push({ name: '', dosage_ml: null, expected_effect: '' });
};

const removeVegetableOil = (index: number) => {
    caseRecord.vegetable_oils.splice(index, 1);
};

// --- Save Logic (Placeholder) ---
const saveCaseRecord = () => {
  console.log("儲存個案紀錄功能開發中...");
  console.log("客戶ID:", customer.value?.id);
  console.log("個案內容:", JSON.parse(JSON.stringify(caseRecord)));
  // Future implementation will save this record to a 'cases' subcollection for the customer.
};

</script>

<style scoped>
/* Add specific styles if needed */
</style>
