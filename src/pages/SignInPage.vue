<template>
  <AuthShell
    kicker=""
    title="Connexion"
    description="Page de connexion avec email et mot de passe"
    switch-label="Pas encore de compte ?"
    switch-action="S'inscrire"
    switch-to="/inscription"
  >
    <NForm
      ref="formRef"
      :model="formValue"
      :rules="rules"
      @submit.prevent="handleSubmit"
    >
      <NSpace vertical :size="18">
        <NFormItem path="email" label="Email">
          <NInput
            v-model:value="formValue.email"
            size="large"
            placeholder="red@example.com"
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
          Se connecter
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

const formValue = reactive({
  email: '',
  password: '',
})

const rules: FormRules = {
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
    isSubmitting.value = true
    await authStore.signIn(formValue)
    message.success('Connexion reussie')
    // Go to the protected home page after login
    await router.push(ROUTES.HOME)
  } catch (error) {
    const nextMessage =
      error instanceof Error ? error.message : 'Impossible de se connecter'
    message.error(nextMessage)
  } finally {
    isSubmitting.value = false
  }
}
</script>
