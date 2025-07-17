<template>
  <v-container fluid>
    <v-toolbar color="transparent">
      <v-toolbar-title>客戶管理</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" to="/customers/new" prepend-icon="mdi-plus">
        新增客戶
      </v-btn>
    </v-toolbar>

    <HelloWorld />

  </v-container>
</template>

<script lang="ts" setup>
  //
</script>
