<template>
  <v-container class="fill-height">
    <v-responsive class="d-flex align-center text-center fill-height">
      <v-card
        class="mx-auto pa-8"
        elevation="8"
        max-width="448"
        rounded="lg"
      >
        <v-img
          class="mx-auto mb-4"
          max-width="100"
          src="@/assets/logo.png"
        ></v-img>

        <h2 class="text-h5 mb-4">芳療智匯 AromaMind</h2>
        <div class="text-subtitle-1 text-medium-emphasis">歡迎回來！請登入您的帳號</div>

        <v-btn
          @click="signInWithGoogle"
          block
          class="my-8"
          color="blue-darken-1"
          size="large"
          variant="tonal"
          prepend-icon="mdi-google"
        >
          使用 Google 帳號登入
        </v-btn>

        <v-divider class="my-4">或</v-divider>

        <div class="text-subtitle-1 text-medium-emphasis">使用 Email 登入</div>

        <v-text-field
          density="compact"
          placeholder="電子郵件地址"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          class="mt-4"
          disabled
        ></v-text-field>

        <v-text-field
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          placeholder="請輸入密碼"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visible = !visible"
          disabled
        ></v-text-field>

        <v-btn
          block
          class="mb-4"
          color="blue-grey-darken-3"
          size="large"
          variant="tonal"
          disabled
        >
          登入
        </v-btn>

        <v-card-text class="text-center">
          <a
            class="text-blue text-decoration-none"
            href="#"
            rel="noopener noreferrer"
            target="_blank"
          >
            忘記密碼?
          </a>
          <span class="mx-2">|</span>
          <a
            class="text-blue text-decoration-none"
            href="#"
            rel="noopener noreferrer"
            target="_blank"
          >
            註冊新帳號
          </a>
        </v-card-text>
      </v-card>
    </v-responsive>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/plugins/firebase";
import { useRouter } from 'vue-router';

const visible = ref(false)
const router = useRouter();

const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      // The signed-in user info.
      const user = result.user;
      console.log("Successfully signed in with Google", user);
      // IdP data available using getAdditionalUserInfo(result)
      // ...
      router.push('/'); // Redirect to home page after successful login
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData?.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.error("Google sign-in error", errorCode, errorMessage);
      // ...
    });
}
</script>

