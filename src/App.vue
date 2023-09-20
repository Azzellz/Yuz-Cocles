<script setup lang="ts">
// import { YEditor } from '../dist'

// import {YEditor} from 'yuz-cocles'
// import 'yuz-cocles/dist/index.css'
// import { YEditor } from '../packages';
import { reactive } from 'vue'
const context = reactive({
    content: ''
})
</script>

<template>
    <div>
        <y-editor :context="context"></y-editor>
    </div>
</template>

<style scoped></style>
