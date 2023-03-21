<script setup>
import { ref } from "vue";
import { Notification } from '@arco-design/web-vue';
import axios from 'axios'
import EditTeaModal  from "../components/__EditTeaModal.vue";

const loading = ref(false)
const teas = ref([])
const editTeaModal = ref()

// 根据输入内容发送搜索请求
const loadAllTeas = async () => {
    teas.value = []
    loading.value = true
    const res = await axios.post('http://localhost:3000/search', {
        name: ''
    })
    loading.value = false
    teas.value = res.data.teas
}
// 加载页面时自动请求所有数据
loadAllTeas()

// 重建数据库
const reinitializeDatabase = async () => {
    loading.value = true
    const res = await axios.post('http://localhost:3000/reinitialize')
    loadAllTeas()
    if (res.data.success) {
        Notification.success({
            title: 'A Grand Success',
            content: 'Database reinitialization succeeded!',
        })
    } else {
        Notification.error({
            title: 'Something Went Wrong',
            content: res.data.error,
        })
    }
}

// 删除指定数据
const deleteTea = async (teaToDelete) => {
    loading.value = true
    const res = await axios.delete(`http://localhost:3000/delete/${teaToDelete.id}`)
    if (res.data.success) {
        Notification.success({
            title: 'A Grand Success',
            content: `${teaToDelete.name} is deleted from database!`,
        })
    } else {
        Notification.error({
            title: 'Something Went Wrong',
            content: res.data.error,
        })
    }
    loading.value = false
    teas.value = teas.value.filter(tea => tea.id != teaToDelete.id)
}

</script>

<template>
    <a-space>
        <a-popconfirm content="Are you sure you want to reinitialize?" @ok="reinitializeDatabase" v-if="!loading">
            <a-button type="primary" status="danger" style="margin-bottom: 20px;">Reinitialize
                Database</a-button>
        </a-popconfirm>
        <a-button type="primary" status="normal" style="margin-bottom: 20px;" @click="editTeaModal.openModal()">Add tea</a-button>
    </a-space>

    <a-table :data="teas" :loading="loading">
        <template #columns>
            <a-table-column v-if="teas.length > 0" v-for="key in Object.keys(teas[0])" :title="key"
                :data-index="key"></a-table-column>
            <a-table-column title="Operation" data-index="Operation">
                <template #cell="{ record }">
                    <a-space>
                        <a-button shape="round" status="normal" @click="editTeaModal.openModal(record)">
                            <template #icon> <icon-edit /> </template>
                        </a-button>
                        <a-popconfirm content="Are you sure you want to delete?" @ok="() => { deleteTea(record) }">
                            <a-button shape="round" status="danger">
                                <template #icon> <icon-delete /> </template>
                            </a-button>
                        </a-popconfirm>
                    </a-space>
                </template>
            </a-table-column>
        </template>
    </a-table>

    <EditTeaModal ref="editTeaModal" @success="loadAllTeas" />
</template>