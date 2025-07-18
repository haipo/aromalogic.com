<template>
  <v-container>
    <!-- Section 1: Current Appointments (Placeholder) -->
    <v-card class="mb-6">
      <v-card-title>目前預約客戶</v-card-title>
      <v-card-text>
        <p class="text-grey">此功能開發中。</p>
      </v-card-text>
    </v-card>

    <!-- Section 2: All Customers -->
    <v-card>
      <v-card-title class="d-flex align-center">
        所有客戶
        <v-spacer></v-spacer>
        <v-text-field
          v-model="searchQuery"
          label="搜尋客戶 (ID 或名稱)"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          dense
          hide-details
          class="search-field"
        ></v-text-field>
      </v-card-title>

      <v-card-text>
        <div v-if="loading" class="text-center py-4">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          <p class="mt-2">載入中...</p>
        </div>
        <v-alert v-else-if="errorMessage" type="error" variant="tonal">{{ errorMessage }}</v-alert>
        
        <v-list v-else-if="filteredCustomers.length > 0">
          <v-list-item
            v-for="customer in filteredCustomers"
            :key="customer.id"
            @click="createNewCase(customer)"
            class="customer-item"
          >
            <v-list-item-title class="font-weight-bold">{{ customer.name }}</v-list-item-title>
            <v-list-item-subtitle>
              ID: {{ customer.id }} | 性別: {{ customer.gender || '未填寫' }} | 生日: {{ customer.birthdate || '未填寫' }}
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>

        <div v-else class="text-center py-4">
          <p>找不到符合條件的客戶，或目前沒有客戶資料。</p>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

interface Customer {
  id: string;
  name: string;
  gender?: string;
  birthdate?: string;
  // Add other fields if necessary for display or logic
}

const allCustomers = ref<Customer[]>([]);
const loading = ref(true);
const errorMessage = ref<string | null>(null);
const searchQuery = ref('');

// Fetch customer data on component mount
onMounted(async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    errorMessage.value = "使用者未登入，無法讀取客戶資料。";
    loading.value = false;
    return;
  }

  try {
    const db = getFirestore();
    const customerCollection = collection(db, 'users', user.uid, 'clients');
    const querySnapshot = await getDocs(customerCollection);
    
    allCustomers.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Customer, 'id'>)
    }));
  } catch (error) {
    console.error("讀取客戶資料時發生錯誤: ", error);
    errorMessage.value = "讀取客戶資料失敗，請稍後再試。";
  } finally {
    loading.value = false;
  }
});

// Computed property for fuzzy search
const filteredCustomers = computed(() => {
  if (!searchQuery.value) {
    return allCustomers.value;
  }
  const lowerCaseQuery = searchQuery.value.toLowerCase();
  return allCustomers.value.filter(customer => 
    customer.name.toLowerCase().includes(lowerCaseQuery) ||
    customer.id.toLowerCase().includes(lowerCaseQuery)
  );
});

// Placeholder function for creating a new case
const createNewCase = (customer: Customer) => {
  console.log(`觸發新增個案功能，客戶: ${customer.name} (ID: ${customer.id})`);
  // Future implementation will navigate to a new case page, e.g.:
  // router.push(`/case/new?customerId=${customer.id}`);
};

</script>

<style scoped>
.search-field {
  max-width: 350px;
}
.customer-item {
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  transition: background-color 0.2s;
}
.customer-item:last-child {
  border-bottom: none;
}
.customer-item:hover {
  background-color: #f5f5f5;
}
</style>
