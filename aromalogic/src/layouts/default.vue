<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-img
        alt="AromaMind Logo"
        class="shrink mr-2"
        contain
        src="@/assets/logo.png"
        transition="scale-transition"
        width="40"
      />
      <v-toolbar-title>芳療智匯 AromaMind</v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- 可以放一些導航按鈕或使用者資訊 -->
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script lang="ts" setup>
  //
</script>