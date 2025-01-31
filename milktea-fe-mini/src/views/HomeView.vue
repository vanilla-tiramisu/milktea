<script setup lang="ts">
import { Menu as Setting } from '@element-plus/icons-vue'
import chatPanel from '@/components/panels/ChatPanel.vue';
import leftPanel from '@/components/panels/LeftPanel.vue';
</script>

<template>
  <el-container class="wrapper">
    <el-header height="60px" style="background-color: #EAB099;">
      <div class="toolbar">
        <el-dropdown>
          <el-icon style="margin-right: 8px; margin-top: 1px">
            <setting />
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>View</el-dropdown-item>
              <el-dropdown-item>Add</el-dropdown-item>
              <el-dropdown-item>Delete</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <span>Tom</span>
      </div>
    </el-header>
    <el-container>
      <left-panel></left-panel>
      <el-container class=" main">
        <el-scrollbar height="100%">
          <chat-panel style="width: 100%;height: 100%;overflow: hidden;"></chat-panel>
        </el-scrollbar>
      </el-container>
    </el-container>
  </el-container>
</template>

<style scoped>
.el-container.wrapper {
  height: 100vh;
  width: 100vw;
  max-width: 100%;
  max-height: 100vh;

  .main {
    width: 100%;
    min-height: 100%;
    display: block;
  }

  .main :deep(.el-scrollbar__view) {
    display: flex;
    flex-direction: column;
    place-content: flex-end;
    height: 100%;
  }



  .toolbar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    right: 20px;
  }
}
</style>
