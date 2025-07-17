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
      href: 'https://vuetifyjs.com/',
      icon: 'mdi-doctor',
      subtitle: 'Learn about all things Vuetify in our documentation.',
      title: '問診系統',
    },
    {
      href: '/customers/list',
      icon: 'mdi-account-box-outline',
      subtitle: 'Explore available framework Features.',
      title: '客戶管理',
    },
    // {
    //   href: '/customers/new',
    //   icon: 'mdi-account-box-plus-outline',
    //   subtitle: 'Explore available framework Features.',
    //   title: '客戶管理-新增客戶',
    // },
    // {
    //   href: '/customers/edit',
    //   icon: 'mdi-account-box-edit-outline',
    //   subtitle: 'Explore available framework Features.',
    //   title: '客戶管理-客戶資料修改',
    // },
    
    {
      href: 'https://vuetifyjs.com/components/all',
      icon: 'mdi-widgets-outline',
      subtitle: 'Discover components in the API Explorer.',
      title: '配方資料庫',
    },
    {
      href: 'https://discord.vuetifyjs.com',
      icon: 'mdi-account-group-outline',
      subtitle: 'Connect with Vuetify developers.',
      title: '社群',
    },
  ]
</script>
