<script setup>
import { ref } from 'vue'

const searchText = ref('')

function clearSearch() {
  searchText.value = ''
}
</script>

<template>
  <div class="app-navbar">
    <div class="navbar-wrap">
      <div class="navbar-left-container">
        <div class="navbar-title d-flex align-items-center p-l-16">
          <div class="booking-title pointer">
            <div class="navbar-icon icon-switch pointer"></div>
          </div>

          <div class="pos-relative mx-3">
            <div class="navbar-logo-container pointer">
              <div class="navbar-icon logo-recruiment"></div>
            </div>
            <div class="navbar-bg"></div>
          </div>

          <div class="title-name pointer m-r-24">Tuyển dụng</div>
        </div>

        <div class="wrap-navbar-search d-flex align-items-center">
          <div class="navbar-search">
            <div class="text-editor-container">
              <div class="text-editor">
                <div class="icon-search"></div>
                <input
                  id="text-editor-input"
                  v-model="searchText"
                  autocomplete="off"
                  placeholder="Tìm kiếm tin tuyển dụng, ứng viên, nhân tài..."
                />
              </div>
              <div class="text-editor-button-container">
                <span class="clear-button-area" @click="clearSearch" title="Xóa">
                  <span class="icon-clear"></span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="navbar-right-container">
        <div
          class="recruiment-page d-flex pointer m-r-20 no-bg btn-secondary-2 no-box-shadow-hover"
        >
          <div class="icon-global m-r-10 m-t-3"></div>
          <div class="icon-text">Website tuyển dụng</div>
        </div>

        <div class="notification-icon-container">
          <div class="icon-notification"></div>
        </div>

        <div class="integration-cart mr-3">
          <div class="cs-store">
            <div class="store-icon"></div>
            <div class="store-notice">2</div>
          </div>
        </div>

        <div class="user-control-panel d-flex">
          <div class="invite-box apui-user-controlpanel-item"></div>
          <div class="message-box apui-user-controlpanel-item"></div>
          <div class="noti-box apui-user-controlpanel-item">
            <div class="noti-number">4</div>
          </div>
          <div class="help-menu apui-user-controlpanel-item"></div>
          <div class="more-menu apui-user-controlpanel-item"></div>
          <div class="knowledge-menu apui-user-controlpanel-item"></div>
          <div class="user-menu apui-user-controlpanel-item">
            <div class="avatar-account">
              <img
                src="https://amisplatform.misacdn.net/APIS/PlatformAPI/api/Avatar/77b8feac-dfe5-4b47-b1ff-ac9a2eaced5a/LT0YJBOP.jpg?avatarID=03762a31-c8c5-45ae-887b-17bcdc47043b&width=64&height=64"
                alt="avatar"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
