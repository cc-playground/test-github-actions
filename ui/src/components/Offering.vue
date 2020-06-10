<template>
    <div>
        <p>{{ name }}</p>
        <p>{{ description }}</p>
    </div>
</template>

<script>
export default {
    props: ['id', 'name', 'description'] 
}
</script>