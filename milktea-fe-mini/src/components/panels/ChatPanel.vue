<script lang="ts" setup>
import markdownit from 'markdown-it';
import { onBeforeMount, ref } from 'vue';
import MessageBubble from '@/components/Items/MessageBubble.vue';
const messages = ref([{ text: "你好！我是你的AI伙伴", isUser: false }]);

const md = new markdownit({
    breaks: true,
    html: true,
    linkify: true,
    typographer: true
});

const inputText = ref('');
onBeforeMount(() => {
    try {
        fetch('http://localhost:3000/chat/history')
            .then((res: Response) => res.json())
            .then((data: any) => {
                messages.value = data.map((msg: any) => {
                    console.log(msg);
                    return {
                        text: md.render(msg.content),
                        isUser: msg.role === 'user'
                    }
                });
            });

    } catch (error) {
        console.error(error);
    }
})
// TODO：组件创建后，自动滚动到底部
// const scrollBottom = () => {
//     const messagesDiv = document.querySelector('.messages');
//     messagesDiv.scrollTop = messagesDiv.scrollHeight;
// };


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

const handleSend = () => {
    if (!inputText.value.trim()) return;

    messages.value.push({
        text: inputText.value,
        isUser: true
    });

    getAIResponse(inputText.value)
        .then((res: Response) => {
            console.log(res.body);
            return res.text();
        })
        .then((text: string) => {
            console.log("before render:", text);

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

const handleEnter = (e: KeyboardEvent) => {
    if (!e.shiftKey && e.key === 'Enter') {
        handleSend();
    }
};


// created
// scrollBottom();



</script>

<template>
    <div class="chat-panel">
        <div class="messages">
            <MessageBubble v-for="(msg, index) in messages" :key="index" :is-user="msg.isUser" :text="msg.text">
                <div v-html="msg.text"></div>
            </MessageBubble>
        </div>
        <div class="input-area">
            <el-input :autosize="{ maxRows: 1 }" v-model="inputText" @keyup.enter="handleEnter" placeholder="输入消息..."
                type="textarea" />
            <button @click="handleSend" class="send-button">
                发送
            </button>
        </div>
    </div>

</template>

<style scoped>
.messages {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, #F7ECDE 0%, #F6F4F4 100%);
    padding: 20px;
    overflow-y: auto;
}

.input-area {
    background: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    bottom: 6em;
    padding: 2em;
}

.input-area :deep(textarea) {
    border-radius: 1.5em;
    font-size: 16px;
    transition: all 0.3s ease;
    resize: none;
}

.message-input:focus {
    outline: none;
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.3);
}

.send-button {
    display: inline;
    background: #007bff;
    color: white;
    border: none;
    margin-left: 1em;
    width: 8em;
    padding: 12px 20px;
    border-radius: 1.5em;
    cursor: pointer;
    transition: all 0.3s ease;
    align-items: center;
}

.send-button:hover {
    background: #0056b3;
    transform: translateY(-1px);
}
</style>