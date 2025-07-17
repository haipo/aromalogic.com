<template>
  <v-container>
    <v-card class="mx-auto" max-width="1000">
      <v-card-title class="text-h5 pa-4 d-flex align-center">
        客戶列表
        <v-spacer></v-spacer>
        <v-btn color="primary" to="/customers/new" prepend-icon="mdi-plus">
          新增客戶
        </v-btn>
      </v-card-title>
      <v-card-text>
        <div v-if="loading" class="text-center py-4">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          <p class="mt-2">載入中...</p>
        </div>
        <div v-else-if="customers.length === 0" class="text-center py-4">
          <p>目前沒有客戶資料。</p>
          <v-btn color="primary" to="/customers/new" class="mt-4">新增第一位客戶</v-btn>
        </div>
        <v-expansion-panels v-else>
          <v-expansion-panel
            v-for="customer in customers"
            :key="customer.id"
          >
            <v-expansion-panel-title>
              <v-row no-gutters align="center">
                <v-col cols="6">
                  <strong>{{ customer.name }}</strong>
                </v-col>
                <v-col cols="4">
                  {{ customer.phone }}
                </v-col>
                <v-col cols="2" class="text-right">
                  <v-btn
                    icon="mdi-pencil"
                    variant="text"
                    size="small"
                    @click.stop="editCustomer(customer.id)"
                  ></v-btn>
                </v-col>
              </v-row>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list density="compact">
                <v-list-item>
                  <v-list-item-title>性別: {{ customer.gender || '未填寫' }}</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Email: {{ customer.email || '未填寫' }}</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>生日: {{ customer.birthdate || '未填寫' }}</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>身高: {{ customer.height ? `${customer.height} cm` : '未填寫' }}</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>體重: {{ customer.weight ? `${customer.weight} kg` : '未填寫' }}</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>慢性病: {{ customer.chronic_illness || '無' }}</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>長期服藥: {{ customer.long_term_medication || '無' }}</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>過敏: {{ customer.allergies || '無' }}</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>懷孕狀態: {{ customer.is_pregnant ? '是' : '否' }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>

    <v-dialog v-model="showAuthDialog" persistent max-width="400">
      <v-card>
        <v-card-title class="text-h5">認證錯誤</v-card-title>
        <v-card-text>{{ authDialogMessage }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="redirectToLogin">重新登入</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { auth } from '@/plugins/firebase';
import { useRouter } from 'vue-router';

interface Customer {
  id: string;
  name: string;
  gender?: string;
  phone: string;
  email?: string;
  birthdate?: string;
  height?: number;
  weight?: number;
  chronic_illness?: string;
  long_term_medication?: string;
  allergies?: string;
  is_pregnant?: boolean;
}

const customers = ref<Customer[]>([]);
const loading = ref(true);
const showAuthDialog = ref(false);
const authDialogMessage = ref('');
const router = useRouter();

onMounted(async () => {
  const user = auth.currentUser;
  if (!user) {
    console.error("使用者未登入，無法讀取客戶資料");
    authDialogMessage.value = "尚未登入或已經閒置過久，請重新登入";
    showAuthDialog.value = true;
    loading.value = false;
    return;
  }

  try {
    const db = getFirestore();
    const customerCollection = collection(db, 'users', user.uid, 'clients');
    const querySnapshot = await getDocs(customerCollection);
    
    customers.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<Customer, 'id'>
    }));
  } catch (error) {
    console.error("讀取客戶資料時發生錯誤: ", error);
  } finally {
    loading.value = false;
  }
});

const editCustomer = (customerId: string) => {
  console.log("編輯客戶: ", customerId);
  // 這裡將來會實作導航到編輯頁面的邏輯
};

const redirectToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
/* 您可以在這裡添加組件特有的樣式 */
</style>
