<template>
  <main class="auth-shell">
    <section class="auth-wrapper">
      <div class="auth-header">
        <h1 class="auth-page-title">{{ title }}</h1>
        <p class="auth-page-description">{{ description }}</p>
      </div>

      <div class="auth-card">
        <slot />
        <p class="auth-switch-text">
          {{ switchLabel }}
          <RouterLink class="auth-switch-link" :to="switchTo">
            {{ switchAction }}
          </RouterLink>
        </p>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
defineProps<{
  kicker: string
  title: string
  description: string
  switchLabel: string
  switchAction: string
  switchTo: string
}>()
</script>

<style scoped>
.auth-shell {
  min-height: 100vh;
  padding: 24px;
  background: #f3f4f6;
}

.auth-wrapper {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 0 40px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  background: #f3f4f6;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.auth-header {
  padding: 24px;
  border-radius: 12px 12px 0 0;
  background: linear-gradient(90deg, #5b21b6 0%, #d946ef 100%);
  color: white;
}

.auth-page-title {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
}

.auth-page-description {
  margin: 8px 0 0;
  font-size: 1rem;
}

.auth-card {
  width: min(100%, 520px);
  margin: 32px auto 0;
  padding: 32px;
  border: 1px solid #d1d5db;
  background: white;
}

.auth-switch-text {
  margin: 24px 0 0;
  text-align: center;
  color: #525252;
}

.auth-switch-link {
  color: #6d28d9;
  font-weight: 600;
  text-decoration: underline;
}

@media (max-width: 640px) {
  .auth-shell {
    padding: 12px;
  }

  .auth-header {
    padding: 18px;
  }

  .auth-page-title {
    font-size: 1.6rem;
  }

  .auth-card {
    width: auto;
    margin: 20px 16px 0;
    padding: 20px;
  }
}
</style>
