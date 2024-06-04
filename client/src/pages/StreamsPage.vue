<template>
    <q-page>
        <div class="row q-pa-md">
            <q-card
                v-for="username in streams"
                :key="username"
                class="full-height col-xs-12 col-sm-6 col-md-4 col-lg-3 q-ma-sm"
            >
                <q-card-section class="q-pb-none">
                    <div class="text-h6">{{ username }}</div>
                </q-card-section>

                <q-card-actions align="right" class="q-mt-auto q-mx-sm">
                    <q-btn
                        color="primary"
                        @click="copyStream(username)"
                    >Copy To Clipboard</q-btn>
                </q-card-actions>
            </q-card>
        </div>
    </q-page>
</template>

<script setup>
import {
	onMounted, ref,
} from 'vue';
import { api } from 'boot/axios';
import { useClipboard } from '@vueuse/core';

const { copy } = useClipboard();

const streams = ref([]);

const fetchStreams = async () => {
	const res = await api.get('streams');
	streams.value = res.data;
};

const copyStream = (username) => {
	copy(`rtmp://lordmau5.com/live/${username}`);
};

onMounted(() => {
	fetchStreams();
});
</script>
