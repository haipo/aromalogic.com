<template>
  <v-container>
    <v-card class="mx-auto" max-width="800">
      <v-card-title class="text-h5 pa-4">
        新增客戶資料
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="customer.name"
                label="姓名 *"
                :rules="[rules.required]"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="customer.gender"
                :items="['男性', '女性', '其他']"
                label="性別"
              ></v-select>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="customer.phone"
                label="手機 (帳號) *"
                :rules="[rules.required, rules.phone]"
                required
                placeholder="E.164 格式, e.g., +886912345678"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="customer.email"
                label="Email"
                :rules="[rules.email]"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="customer.birthdate"
                label="生日"
                type="date"
                :max="today"
              ></v-text-field>
            </v-col>
             <v-col cols="12" md="3">
              <v-text-field
                v-model.number="customer.height"
                label="身高 (cm)"
                type="number"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-model.number="customer.weight"
                label="體重 (kg)"
                type="number"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>

          <v-textarea
            v-model="customer.chronic_illness"
            label="慢性病"
            rows="2"
          ></v-textarea>

          <v-textarea
            v-model="customer.long_term_medication"
            label="長期服藥"
            rows="2"
          ></v-textarea>

          <v-textarea
            v-model="customer.allergies"
            label="過敏"
            rows="2"
          ></v-textarea>

          <v-checkbox
            v-model="customer.is_pregnant"
            label="懷孕狀態 (若適用)"
          ></v-checkbox>

        </v-form>
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn :disabled="loading" color="grey" @click="resetForm">重設</v-btn>
        <v-btn :loading="loading" :disabled="!valid || loading" color="primary" @click="submitForm">儲存客戶</v-btn>
      </v-card-actions>
    </v-card>

    <v-snackbar
      v-model="showSnackbar"
      :timeout="3000"
      color="error"
      location="top right"
    >
      {{ errorMessage }}
    </v-snackbar>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { getFirestore, collection, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth } from '@/plugins/firebase';

const form = ref<any>(null);
const valid = ref(true);
const loading = ref(false);
const router = useRouter();
const errorMessage = ref('');
const showSnackbar = ref(false);

const today = new Date().toISOString().split('T')[0];

const customer = reactive({
  name: '',
  gender: null,
  phone: '',
  email: '',
  birthdate: null,
  height: null,
  weight: null,
  chronic_illness: '',
  long_term_medication: '',
  allergies: '',
  is_pregnant: false,
});

const rules = {
  required: (v: any) => !!v || '此欄位為必填',
  email: (v: string) => !v || /.+@.+\..+/.test(v) || 'E-mail 格式不正確',
  phone: (v: string) => !v || /^\+[1-9]\d{1,14}$/.test(v) || '手機格式不正確 (需為 E.164 格式)',
};

const submitForm = async () => {
  if (!form.value?.validate()) return;

  loading.value = true;
  errorMessage.value = ''; // Clear previous errors
  showSnackbar.value = false;

  const user = auth.currentUser;

  if (!user) {
    console.error("使用者未登入，無法新增客戶");
    errorMessage.value = "使用者未登入，請先登入";
    showSnackbar.value = true;
    loading.value = false;
    return;
  }

  try {
    const db = getFirestore();
    const phoneWithoutPlus = customer.phone.startsWith('+') ? customer.phone.substring(1) : customer.phone;
    const customerDocRef = doc(db, 'users', user.uid, 'clients', phoneWithoutPlus);
    
    // Check if document already exists
    const docSnap = await getDoc(customerDocRef);
    if (docSnap.exists()) {
      errorMessage.value = "此手機號碼的客戶資料已存在，請勿重複新增";
      showSnackbar.value = true;
      loading.value = false;
      return;
    }

    const customerData = {
      ...customer,
      createdAt: serverTimestamp(), // Use server timestamp for consistency
    };

    await setDoc(customerDocRef, customerData);
    console.log("客戶資料已成功儲存，文件 ID: ", phoneWithoutPlus);
    router.push('/'); // Redirect to home page after successful submission
  } catch (error) {
    console.error("儲存客戶資料時發生錯誤: ", error);
    errorMessage.value = `儲存失敗: ${error.message}`;
    showSnackbar.value = true;
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  form.value?.reset();
  errorMessage.value = '';
  showSnackbar.value = false;
};

</script>

