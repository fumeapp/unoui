<script lang="ts" setup>
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
const test = () => {
  console.log('clicking')
  toggleDark()
}

const items = [
  [{
    label: 'Profile',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/739984?v=4'
    }
  }], [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    shortcuts: ['E'],
    click: () => {
      console.log('Edit')
    }
  }, {
    label: 'Duplicate',
    icon: 'i-heroicons-document-duplicate-20-solid',
    shortcuts: ['D'],
    disabled: true
  }], [{
    label: 'Archive',
    icon: 'i-heroicons-archive-box-20-solid'
  }, {
    label: 'Move',
    icon: 'i-heroicons-arrow-right-circle-20-solid'
  }], [{
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid',
    shortcuts: ['⌘', 'D']
  }]
]
</script>
<template>
  <div absolute top-10 right-10>
    <u-button icon="i-heroicons:light-bulb-solid" :color="isDark ? 'white' : 'black'" @click="test" />
  </div>
  <div dark flex flex-col space-y-4 items-center justify-center w-screen h-screen bg-gray-100 dark:bg-gray-900>
    <UAvatar src="https://avatars.githubusercontent.com/u/967369?v=4" alt="Avatar" chip-color="primary" chip-position="top-right" />
    <UButtonGroup size="sm">
      <UButton label="Action" color="white" />
      <UButton icon="i-heroicons:chevron-down" color="white" />
    </UButtonGroup>
    <u-dropdown :items="items" :popper="{ placement: 'bottom-start' }" />

    <div i-mdi-grid w-12 h-12 border border-red-500 text-white bg-red-100 />
    <u-badge color="red">
      badge
    </u-badge>
    <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
      <UButton color="white" label="Options" trailing-icon="i-heroicons-chevron-down-20-solid" />
    </UDropdown>
  </div>
</template>
