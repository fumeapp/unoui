<script setup>
const groups = computed(() => {
  return [{
    key: 'users',
    label: q => q && `Users matching “${q}”...`,
    search: async (q) => {
      if (!q) {
        return []
      }

      const users = await $fetch(`https://jsonplaceholder.typicode.com/users`, { params: { q } })

      return users.map(user => ({ id: user.id, label: user.name, suffix: user.email }))
    }
  }].filter(Boolean)
})
</script>

<template>
  <UCommandPalette :groups="groups" :autoselect="false" />
</template>
