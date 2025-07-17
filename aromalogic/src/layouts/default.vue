<template>
  <v-app>
    <v-app-bar app color="primary">
      <v-btn to="/" variant="text" class="text-h6">
        芳療智匯 AromaMind
      </v-btn>
      <v-spacer></v-spacer>
      <span class="mr-4">{{ userEmail }}</span>
      <v-btn @click="logout" variant="text">登出</v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { useRouter } from 'vue-router';

const userEmail = ref<string | null>(null);
let unsubscribe: () => void;
const router = useRouter();

onMounted(() => {
  const auth = getAuth();
  unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
    if (user) {
      userEmail.value = user.email;
    } else {
      userEmail.value = null;
    }
  });
});

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});

const logout = async () => {
  try {
    await signOut(getAuth());
    router.push('/login');
  } catch (error) {
    console.error("登出失敗: ", error);
  }
};
</script>