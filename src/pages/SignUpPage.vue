<template>
  <AuthShell
    kicker=""
    title="Inscription"
    description="Formulaire d'inscription avec nom d'utilisateur, email et mot de passe"
    switch-label="Déjà un compte ?"
    switch-action="Se connecter"
    switch-to="/connexion"
  >
    <NForm
      ref="formRef"
      :model="formValue"
      :rules="rules"
      @submit.prevent="handleSubmit"
    >
      <NSpace vertical :size="18">
        <NAlert v-if="errorMessage" type="error" :show-icon="true">
          {{ errorMessage }}
        </NAlert>

        <NFormItem path="username" label="Nom d'utilisateur">
          <NInput
            v-model:value="formValue.username"
            size="large"
            placeholder="Blue"
          />
        </NFormItem>

        <NFormItem path="email" label="Email">
          <NInput
            v-model:value="formValue.email"
            size="large"
            placeholder="blue@example.com"
          />
        </NFormItem>

        <NFormItem path="password" label="Mot de passe">
          <NInput
            v-model:value="formValue.password"
            type="password"
            show-password-on="click"
            size="large"
            placeholder="password123"
          />
        </NFormItem>

        <NButton
          attr-type="submit"
          type="primary"
          size="large"
          block
          :loading="isSubmitting"
          :disabled="isSubmitting"
        >
          Creer un compte
        </NButton>
      </NSpace>
    </NForm>
  </AuthShell>
</template>

<script setup lang="ts">
import type { FormInst, FormRules } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import AuthShell from '../components/auth/AuthShell.vue'
import { ROUTES } from '../router.js'
import { useAuthStore } from '../stores/auth.js'

const authStore = useAuthStore()
const formRef = ref<FormInst | null>(null)
const router = useRouter()
const message = useMessage()
const isSubmitting = ref(false)
const errorMessage = ref('')

const formValue = reactive({
  username: '',
  email: '',
  password: '',
})

const rules: FormRules = {
  username: [
    {
      required: true,
      message: "Nom d'utilisateur requis",
      trigger: ['blur', 'input'],
    },
  ],
  email: [
    { required: true, message: 'Email requis', trigger: ['blur', 'input'] },
    { type: 'email', message: 'Email invalide', trigger: ['blur', 'input'] },
  ],
  password: [
    {
      required: true,
      message: 'Mot de passe requis',
      trigger: ['blur', 'input'],
    },
  ],
}

const handleSubmit = async () => {
  // Run Naive UI form validation before API call
  await formRef.value?.validate()

  try {
    errorMessage.value = ''
    isSubmitting.value = true
    await authStore.signUp(formValue)
    message.success('Compte cree')
    // Go to the protected home page after account creation
    await router.push(ROUTES.HOME)
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Impossible de creer le compte'
  } finally {
    isSubmitting.value = false
  }
}
</script>
