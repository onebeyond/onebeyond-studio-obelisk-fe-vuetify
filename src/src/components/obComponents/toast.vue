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
        z-index="5000"
        @update:model-value="onChanged(snackbar.id, $event)"
    >
        <div class="text-subtitle-1 pb-2" v-if="snackbar.title">{{ snackbar.title }}</div>

        <p>{{ snackbar.message }}</p>
    </VSnackbar>
</template>

<script setup lang="ts">
    import type { NotificationType, ToastOptions } from "@js/types/toastTypes";
    import { ref } from "vue";

    interface SnackBar {
        id: number;
        message: string;
        title: string;
        color: string;
        isShow: boolean;
        position: number;
        closeOnContentClick: boolean;
        timeOut: number;
        location: string;
    }

    const snackbars = ref<SnackBar[]>([]);
    const ids = ref(0);
    const theSizeOfSnackbar = 100;

    const remove = (id: number) => {
        const removedIdx = snackbars.value.findIndex((x) => x.id === id);

        snackbars.value.splice(removedIdx, 1);
        snackbars.value.forEach((x, idx) => (x.position = theSizeOfSnackbar * idx));
    };

    const onChanged = (id: number, isShow: boolean) => !isShow && remove(id);

    function show(title: string, message: string, type: NotificationType, toastOptions?: ToastOptions): void {
        const color = type;
        if (snackbars.value) {
            snackbars.value.push({
                id: ++ids.value,
                title,
                message,
                color,
                isShow: true,
                position: theSizeOfSnackbar * snackbars.value.length,
                timeOut: toastOptions?.timeout ?? 5000,
                closeOnContentClick: toastOptions?.closeOnContentClick ?? true,
                location: toastOptions?.location ?? "bottom end",
            });
        }
    }

    defineExpose({
        show,
    });
</script>
