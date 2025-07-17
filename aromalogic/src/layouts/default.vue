<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-container class="fill-height d-flex align-center">
        <v-toolbar-title class="text-left flex-grow-1">
          芳療智匯 AromaMind
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-img
          alt="AromaMind Logo"
          class="shrink mx-auto"
          contain
          src="@/assets/logo.png"
          transition="scale-transition"
          width="40"
        />

        <v-spacer></v-spacer>

        <span class="text-right flex-grow-1 mr-4">{{ userEmail }}</span>
      </v-container>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

const userEmail = ref<string | null>(null);
let unsubscribe: () => void;

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
</script>