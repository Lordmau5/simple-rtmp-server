<template>
    <q-space v-if="type === 'space'"/>
    <q-separator v-else-if="type === 'separator'" spaced />
    <q-item
        v-else
        clickable
        tag="a"
        :target="link ? '_blank' : undefined"
        :href="link"
        :to="to"
        @click="func && func()"
    >
        <q-item-section
            v-if="icon"
            avatar
        >
            <q-icon :name="icon" :color="color"/>
        </q-item-section>

        <q-item-section>
            <q-item-label>{{ title }}</q-item-label>
            <q-item-label caption>{{ caption }}</q-item-label>
        </q-item-section>
    </q-item>
</template>

<script setup lang="ts">
defineOptions({
    name: 'EssentialLink',
});

export interface EssentialLinkProps {
  title?: string;
  caption?: string;
  link?: string;
  icon?: string;
  color?: string;
  to?: string;
  type?: 'space' | 'separator' | undefined;
  func?: () => void;
}

withDefaults(defineProps<EssentialLinkProps>(), {
    caption: '',
    icon: '',
});
</script>
