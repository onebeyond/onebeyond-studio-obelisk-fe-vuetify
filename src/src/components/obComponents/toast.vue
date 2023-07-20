<template>
    <VSnackbar
        v-for="snackbar in snackbars"
        :key="snackbar.id"
        v-model="snackbar.isShow"
        :location="snackbar.location"
        variant="flat"
        :timeOut="snackbar.timeOut"
        :color="snackbar.color"
        :style="{ bottom: `${snackbar.position}px` }"
        :close-on-content-click="snackbar.closeOnContentClick"
        @update:model-value="onChanged(snackbar.id, $event)"
    >
        {{ snackbar.message }}
    </VSnackbar>
</template>

<script setup lang="ts">
    import type { NotificationType, ToastOptions } from "@js/types/toastTypes";
    import { ref } from "vue";

    interface SnackBar {
        id: number;
        message: string;
        color: string;
        isShow: boolean;
        position: number;
        closeOnContentClick: boolean;
        timeOut: number;
        location: string;
    }

    const snackbars = ref<SnackBar[]>([]);
    const ids = ref(0);
    const theSizeOfSnackbar = 50;

    const remove = (id: number) => {
        const removedIdx = snackbars.value.findIndex((x) => x.id === id);

        snackbars.value.splice(removedIdx, 1);
        snackbars.value.forEach((x, idx) => (x.position = theSizeOfSnackbar * idx));
    };

    const onChanged = (id: number, isShow: boolean) => !isShow && remove(id);

    function show(title: string, message: string, type: NotificationType, toastOptions?: ToastOptions): void {
        const color = type;
        console.log(snackbars.value);
        if (snackbars.value) {
            snackbars.value.push({
                id: ++ids.value,
                message,
                color,
                isShow: true,
                position: theSizeOfSnackbar * snackbars.value.length,
                timeOut: toastOptions?.timeout ?? 5000,
                closeOnContentClick: toastOptions?.closeOnContentClick ?? false,
                location: toastOptions?.location ?? "top end",
            });
        }
    }

    defineExpose({
        show,
    });
</script>
