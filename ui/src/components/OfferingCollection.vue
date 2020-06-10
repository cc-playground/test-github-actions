<template>
  <ul>
    <li v-for="offering in offerings" :key="offering.id">
      <offering :id="offering.id" :description="offering.description" :name="offering.name"></offering>
    </li>
  </ul>
</template>

<script>
import axios from 'axios'
import Offering from './Offering'

export default {
  name: 'OfferingCollection',
  components: {
    Offering
  },
  data: () => {
    return {
      offerings: []
    }
  },
  created () {
    this.fetchOfferings();
  },
  methods: {
    fetchOfferings: function() {
      return axios.get('http://localhost:3001/api/v1/offerings').then(response => {
        this.offerings = response.data
      });
    }
  }
}
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
</style>
