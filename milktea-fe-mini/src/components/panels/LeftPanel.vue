<script setup lang="ts">
import DialogItem from '../Items/DialogItem.vue';
</script>

<template>
    <el-aside>
        <el-scrollbar>
            <dialog-item>
                <template #name>test</template>
                <template #time>2021-10-10</template>
            </dialog-item>
            <dialog-item>
                <template #name>test</template>
                <template #time>2021-10-10</template>
            </dialog-item>
            <dialog-item>
                <template #name>test</template>
                <template #time>2021-10-10</template>
            </dialog-item>
        </el-scrollbar>
    </el-aside>
</template>

<style scoped>
.el-aside {
    width: 300px;
    background-color: #eed3c5;
}
</style>