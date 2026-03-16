<template>
  <div class="container">
    <NCard title="Espace joueur" class="home-card">
      <NSpace vertical :size="12">
        <NText
          >Connexion reussie. Les tickets 2 et 3 rempliront cette page.</NText
        >
        <NText depth="3"
          >Tu peux maintenant gerer la session et les guards d'acces.</NText
        >
      </NSpace>
    </NCard>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  padding-top: 40px;
}

.home-card {
  width: min(100%, 640px);
}
</style>
