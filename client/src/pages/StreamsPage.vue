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

                <q-card-section>
                    <q-input
                        label="Copy (if button doesn't work)"
                        filled
                        :model-value="getStreamForCopy(username)"
                        @focus="(event) => event.target.select()"
                        @update:model-value="() => {}"
                    ></q-input>
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
import { useQuasar } from 'quasar';

const quasar = useQuasar();

const streams = ref([]);

const fetchStreams = async () => {
	const res = await api.get('streams');
	streams.value = res.data;
};

const getStreamForCopy = (username) => `rtmp://${window.location.hostname}/live/${username}`;

const copyStream = (username) => {
	quasar.notify('Stream URL copied to clipboard.');
	if (!navigator.clipboard) {
		// Fallback
		const textArea = document.createElement('textarea');
		textArea.value = getStreamForCopy(username);
		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();
		try {
			document.execCommand('copy');
		} catch (err) {
			console.error('Unable to copy to clipboard', err);
		}
		document.body.removeChild(textArea);
		return;
	}
	navigator.clipboard.writeText(getStreamForCopy(username));
};

onMounted(() => {
	fetchStreams();
});
</script>
