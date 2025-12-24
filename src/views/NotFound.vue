<template>
  <div class="not-found">
    <div class="not-found__content">
      <h1 class="not-found__title">404</h1>
      <p class="not-found__message">Trang không tồn tại</p>
      <router-link to="/" class="not-found__link">Quay lại trang chủ</router-link>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.not-found__content {
  text-align: center;
  color: white;
}

.not-found__title {
  font-size: 120px;
  font-weight: bold;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.not-found__message {
  font-size: 24px;
  margin: 20px 0;
}

.not-found__link {
  display: inline-block;
  margin-top: 30px;
  padding: 12px 30px;
  background: white;
  color: #667eea;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  transition: all 0.3s;
}

.not-found__link:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}
</style>
