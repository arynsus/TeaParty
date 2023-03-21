<script setup>
import { ref } from "vue";
import axios from "axios";
import { Notification } from '@arco-design/web-vue';

const modalVisible = ref(false)
const modalTitle = ref('')
const modalFormData = ref({})

const openModal = (tea) => {
    modalTitle.value = tea ? `Edit ${tea.name}` : 'Add New Tea'
    modalFormData.value.id = tea ? tea.id : 'new'
    modalFormData.value.name = tea ? tea.name : ''
    modalFormData.value.countryOfOrigin = tea ? tea.countryOfOrigin : ''
    modalFormData.value.color = tea ? tea.color : ''
    modalFormData.value.ingredients = tea ? tea.ingredients : ''
    modalFormData.value.picture = tea ? tea.picture : ''
    modalVisible.value = true;
};

const closeModal = () => {
    modalVisible.value = false
}

const handleSubmit = async () => {
    const res = await axios.post(`http://localhost:3000/edit/${modalFormData.value.id}`, modalFormData.value)
    if (res.data.success) {
        Notification.success({
            title: 'A Grand Success',
            content: `${modalFormData.value.name} is successfully updated!`,
        })
        emit('success', res)
        closeModal()
    } else {
        Notification.error({
            title: 'Something Went Wrong',
            content: res.data.error,
        })
    }
}

defineExpose({ openModal, closeModal })
const emit = defineEmits(['success'])

</script>

<template>
    <a-modal v-model:visible="modalVisible" :title="modalTitle" @cancel="closeModal" @before-ok="handleSubmit">
        <a-form :model="modalFormData">
            <a-form-item field="name" label="Name">
                <a-input v-model="modalFormData.name" />
            </a-form-item>
            <a-form-item field="countryOfOrigin" label="Country">
                <a-input v-model="modalFormData.countryOfOrigin" />
            </a-form-item>
            <a-form-item field="color" label="Color">
                <a-input v-model="modalFormData.color" />
            </a-form-item>
            <a-form-item field="ingredients" label="Ingredients">
                <a-input v-model="modalFormData.ingredients" />
            </a-form-item>
            <a-form-item field="picture" label="Picture">
                <a-input v-model="modalFormData.picture" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>