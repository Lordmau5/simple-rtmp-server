<template>
    <div class="login-container">
        <q-card style="min-width: 300px;">
            <q-card-section>
                <div class="text-h6">Test your might...</div>
            </q-card-section>

            <q-card-section>
                <q-form
                    @submit="login"
                    class="q-gutter-md"
                >
                    <q-input
                        v-model="password"
                        label="Password"
                        outlined
                        dense
                        type="password"
                    />
                    <div class="q-mt-md flex justify-center">
                        <q-btn
                            label="Login"
                            color="primary"
                            @click="login"
                        />
                    </div>
                </q-form>
            </q-card-section>
        </q-card>
    </div>
</template>

<script setup>
import { useAppStore } from 'stores/app-store.ts';
import { ref } from 'vue';

const password = ref('');
const loginLoading = ref(false);
const appStore = useAppStore();

const login = async () => {
	loginLoading.value = true;

	await appStore.login(password.value);

	loginLoading.value = false;
};
</script>

<style lang="scss" scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;

    background: linear-gradient(322deg,#30e690,#4e4d99,#550e33,#bb1e2e,#83905c);
    background-size: 300% 300%;
    animation: gradient-animation 10s ease infinite;
}

.login-box {
    /*padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    width: 100%;*/
}

@keyframes gradient-animation {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}
</style>
