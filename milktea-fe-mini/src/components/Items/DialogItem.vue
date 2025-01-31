<script lang="ts" setup>

</script>

<template>
    <div class="dialog-item">
        <slot name="name"></slot>
        <slot name="time"></slot>
    </div>
</template>

<style scoped>
.dialog-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #e0e0e0;
}
</style>