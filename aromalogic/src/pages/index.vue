<template>
  <div>
    <Welcome />

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
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { auth } from '@/plugins/firebase';
import { useRouter } from 'vue-router';

const showAuthDialog = ref(false);
const authDialogMessage = ref('');
const router = useRouter();

onMounted(() => {
  const user = auth.currentUser;
  if (!user) {
    //authDialogMessage.value = "尚未登入或已經閒置過久，請重新登入";
    //showAuthDialog.value = true;
    redirectToLogin();
  }
});

const redirectToLogin = () => {
  router.push('/login');
};
</script>