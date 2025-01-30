<script setup lang="ts">
import { ref } from 'vue';
import markdownit from 'markdown-it';
const messages = ref([{ text: "你好！我是你的AI伙伴", isUser: false }]);
const inputText = ref('');

const getAIResponse = (input: string) => {
    let req = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: input })
    }
    return fetch('http://localhost:3000/chat/default', req)
};

const md = new markdownit({
    breaks: true,
    html: true,
    linkify: true,
    typographer: true
});

const handleSend = () => {
    if (!inputText.value.trim()) return;

    messages.value.push({
        text: md.render(inputText.value),
        isUser: true
    });

    getAIResponse(inputText.value)
        .then((res: Response) => {
            console.log(res.body);
            return res.text();
        })
        .then((text: string) => {
            // console.log("before render:", text);

            messages.value.push({
                text: md.render(text),
                isUser: false
            });
        })
        .catch(err => {
            console.error(err)
            messages.value.push({
                text: "出现了一些错误，等会儿再试试。",
                isUser: false
            });
        });

    inputText.value = '';
};



</script>

<template>
    <div class="chat-container">
        <div class="messages">
            <div v-for="(msg, index) in messages" :key="index" :class="['message-bubble', msg.isUser ? 'user' : 'ai']">
                <div v-html="msg.text"></div>
            </div>
        </div>

        <div class="input-area">
            <input v-model="inputText" @keyup.enter="handleSend" placeholder="输入消息..." class="message-input" />
            <button @click="handleSend" class="send-button">
                <svg t="1738006839640" class="icon" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="1476" width="32" height="32">
                    <path
                        d="M925.6 559.2L152 145.6c-11.2-5.6-24.8 3.2-23.2 15.2l60 714.4c0.8 11.2 12 17.6 22.4 13.6L460.8 784l136.8 155.2c8.8 9.6 24 5.6 27.2-6.4l65.6-245.6 235.2-99.2c11.2-5.6 12-22.4 0-28.8z m-328 305.6l-72-128-368-568 488 504-48 192z"
                        p-id="1477" fill="#ffffff"></path>
                </svg>
            </button>
        </div>
    </div>
</template>




<style scoped>
.chat-container {
    width: 100%;
    margin: 0 auto;
    height: 90vh;
    display: flex;
    flex-direction: column;
    background: #f5f5f5;
    border-radius: 12px;
    overflow: hidden;
}

.messages {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.message-bubble {
    max-width: 70%;
    width: fit-content;
    margin: 10px 0;
    padding: 12px 18px;
    border-radius: 20px;
    animation: fadeIn 0.3s ease-in;
}

.message-bubble.user {
    background: #007bff;
    color: white;
    margin-left: auto;
    border-bottom-right-radius: 4px;
}

.message-bubble.ai {
    background: #ffffff;
    color: #333;
    margin-right: auto;
    border-bottom-left-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.input-area {
    display: flex;
    padding: 20px;
    background: white;
    border-top: 1px solid #eee;
}

.message-input {
    flex: 1;
    padding: 12px 18px;
    border: 2px solid #007bff;
    border-radius: 25px;
    margin-right: 10px;
    font-size: 16px;
    transition: all 0.3s ease;
}

.message-input:focus {
    outline: none;
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.3);
}

.send-button {
    background: #007bff;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
}

.send-button:hover {
    background: #0056b3;
    transform: translateY(-1px);
}

/* markdown support */
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
        background: rgba(0, 0, 0, 0.05);
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

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>