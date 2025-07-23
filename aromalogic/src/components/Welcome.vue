<template>
  <v-container class="fill-height" max-width="900">
    <div>
      <v-img
        class="mb-4"
        height="150"
        src="@/assets/logo.png"
      />

      <div class="mb-8 text-center">
        <div class="text-body-2 font-weight-light mb-n1">Welcome to</div>
        <h1 class="text-h2 font-weight-bold">Aroma Mind</h1>
      </div>

      <v-row>
        <v-col v-for="link in links" :key="link.href" cols="6">
          <v-card
            append-icon="mdi-open-in-new"
            class="py-4"
            color="surface-variant"
            :to="link.href"
            :prepend-icon="link.icon"
            rel="noopener noreferrer"
            rounded="lg"
            :subtitle="link.subtitle"            
            :title="link.title"
            variant="tonal"
          />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
  const links = [
    {
      href: '/case/list',
      icon: 'mdi-doctor',
      subtitle: '選擇客戶，輸入主訴並設定配方',
      title: '個案系統',
    },
    {
      href: '/customers/list',
      icon: 'mdi-account-box-outline',
      subtitle: '客戶資料新增、查詢與編輯',
      title: '客戶管理',
    },
    {
      href: '/customers/list',
      icon: 'mdi-widgets-outline',
      subtitle: '常用配方的編輯與查詢',
      title: '配方資料庫',
    },
    {
      href: '/oil/list',
      icon: 'mdi-account-group-outline',
      subtitle: 'Connect with Vuetify developers.',
      title: '精油資料庫',
    },
  ]
</script>
