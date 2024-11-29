<template>
    <q-page>
        <div class="row q-pa-md">
            <q-card
                v-for="(password, username) in auths"
                :key="username"
                class="full-height col-xs-12 col-sm-6 col-md-4 col-lg-3 q-ma-sm"
            >
                <q-card-section class="q-pb-none">
                    <div class="text-h6">{{ username }}</div>
                </q-card-section>

                <q-card-section>
                    <q-input
                        label="Password"
                        filled
                        readonly
                        :model-value="password"
                    ></q-input>
                </q-card-section>

                <q-card-section>
                    <q-input
                        label="Copy (if button doesn't work)"
                        filled
                        :model-value="getAuthForCopy(username, password)"
                        @focus="(event) => event.target.select()"
                        @update:model-value="() => {}"
                    ></q-input>
                </q-card-section>

                <q-card-actions align="right" class="q-mt-auto q-mx-sm">
                    <q-btn
                        color="primary"
                        @click="copyAuth(username, password)"
                    >
                        Copy To Clipboard
                    </q-btn>
                    <q-space></q-space>
                    <q-btn color="negative" @click="removeAuth(username)">
                        Delete
                    </q-btn>
                </q-card-actions>
            </q-card>

            <q-card
                :loading="submittingAuth"
                class="full-height col-xs-12 col-sm-6 col-md-4 col-lg-3 q-ma-sm"
            >
                <q-card-section class="q-pb-none">
                    <div class="text-h6">Add Auth</div>
                </q-card-section>

                <q-card-section>
                    <q-input
                        label="Username"
                        filled
                        counter
                        v-model="username"
                        :rules="authRules"
                    ></q-input>
                </q-card-section>

                <q-card-actions align="right" class="q-mt-auto q-mx-sm">
                    <q-btn
                        :disable="!addAuthValid"
                        color="positive"
                        @click="addAuth()"
                    >
                        Add
                    </q-btn>
                </q-card-actions>
            </q-card>
        </div>
    </q-page>
</template>

<script setup>
import { api } from 'boot/axios';
import { computed, onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';

const quasar = useQuasar();

const regex = /[^A-Za-z0-9]/g;

const auths = ref([]);
const username = ref('');
const submittingAuth = ref(false);
const authRules = [
	(text) => (text.length >= 4 && text.length <= 24)
		|| 'Between 4 and 24 characters',
	(text) => !regex.test(text)
		|| 'Only alphanumerical characters (A-Z, a-z and 0-9)',
];

const addAuthValid = computed(() => {
	const usernames = Object.keys(auths.value);

	for (const authUsername of usernames) {
		// Check if the username matches
		if (authUsername.toLowerCase() === username.value.toLowerCase()) return false;

		// Validate the username using authRules
		for (const rule of authRules) {
			if (rule(username.value) !== true) return false;
		}
	}

	return true;
});

const fetchAuths = async () => {
	const res = await api.get('auth');
	auths.value = res.data;
};

const addAuth = async () => {
	submittingAuth.value = true;
	username.value = username.value.replace(regex, '');

	await api.post('auth', { username: username.value });
	await fetchAuths();

	username.value = '';
	submittingAuth.value = false;
};

const getAuthForCopy = (_username, _password) => `${_username}?pass=${_password}`;

const copyAuth = (_username, _password) => {
	navigator.clipboard.writeText(getAuthForCopy(_username, _password));
	quasar.notify('Stream key copied to clipboard.');
};

const removeAuth = async (_username) => {
	await api.delete(`auth/${_username}`);
	await fetchAuths();
};

onMounted(() => fetchAuths());
</script>
