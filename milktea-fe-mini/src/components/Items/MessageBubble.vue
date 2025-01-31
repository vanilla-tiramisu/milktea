<script lang="ts">
export default {
    props: {
        text: {
            type: String,
            required: true
        },
        isUser: {
            type: Boolean,
            required: true
        }
    }
}

</script>

<template>
    <div class="message-bubble" :class="{ user: isUser, ai: !isUser }">
        <div v-if="isUser" class="user">
            <div v-html="text"></div>
        </div>
        <div v-else class="ai">
            <div v-html="text"></div>
        </div>
    </div>
</template>



<style scoped>
.message-bubble {
    padding: .5em 1em;
    border-radius: 20px;
    margin: 5px;
    max-width: 70%;
    word-wrap: break-word;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.06);
    width: fit-content;
    margin: 10px 0;
    animation: fadeIn 0.3s ease-in;
}

.user {
    text-align: right;
    background: #F78750;
    color: black;
    margin-left: auto;
    border-bottom-right-radius: 4px;
}

.ai {
    text-align: left;
    background: #ffffff;
    color: #333;
    margin-right: auto;
    border-bottom-left-radius: 4px;
}




.message-bubble :deep() {

    code {
        background: rgba(0, 0, 0, 0.1);
        padding: 0.2em 0.4em;
        border-radius: 3px;
        font-family: monospace;
    }

    strong {
        font-weight: 900;
    }

    pre {
        padding: 1em;
        border-radius: 8px;
        overflow-x: auto;

        code {
            background: transparent;
            padding: 0;
        }
    }

    a {
        color: #007bff;
        text-decoration: underline;
    }

    ul,
    ol {
        padding-left: 1.5em;
        margin: 0.5em 0;
    }



}

/* markdown support */
</style>