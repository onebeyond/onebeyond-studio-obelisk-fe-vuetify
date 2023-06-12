<template>
    <div id="page-not-found" class="text-center">
        <h1>404</h1>
        <h2>{{ $t("notifications.pageNotFound") }}</h2>

        <router-link to="/" class="btn btn-primary btn-go-to-home">
            {{ $t("button.goToHome") }}
        </router-link>
    </div>
</template>

<script setup lang="ts"></script>
