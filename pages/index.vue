<template>
  <section class="container">
    <button v-on:click="startRoom">Start Room</button>
    <label>
      Name
      <input
        v-model="playerName"
      >
    </label>
    <label>
      Join Room
      <input
        v-model="joinCode"
        v-on:keyup.enter="joinRoom"
        maxLength=4
        class="caps-input"
      >
    </label>
    <ul>
      <li v-for="room in rooms" :key="room.roomCode">
        {{ room.roomCode }}
        <ul v-for="player in room.players" :key="player.socketid">
          <li>{{ player }}</li>
        </ul>
      </li>
    </ul>
  </section>
</template>

<script>
import socket from '~/plugins/socket.io'
import axios from '~/plugins/axios'
import Cookies from '~/plugins/js-cookie'

export default {
  async asyncData (context) {
    let rooms = axios.get('/api/rooms/')
    return { rooms }
  },

  data () {
    return {
      socket,
      joinCode: '',
      playerName: ''
    }
  },

  beforeCreate () {
    const sessionId = Cookies.get('session_id')
    const autoconnectURL = '/api/autoconnect/' + sessionId
    console.log(autoconnectURL)
    if (sessionId) {
      return axios.get(autoconnectURL)
        .then((room) => {
          console.log(room.data)
          if (room.data) {
            this.$router.replace({
              name: 'game',
              params: room.data
            })
          }
        })
    }
  },

  created () {
    this.socket.on('updateRooms', (rooms) => {
      this.rooms = rooms
    })
  },

  methods: {
    startRoom () {
      if (this.playerName.length !== 0) {
        Cookies.set('session_id', this.socket.id)
        this.socket.emit('startRoom', this.playerName, Cookies.get('session_id'), (room) => {
          const params = {
            roomCode: room.roomCode,
            playerName: this.playerName,
            players: room.players,
            stage: room.stage,
            king: room.king
          }
          this.$router.push({
            name: 'game',
            params
          })
        })
      } else {
        alert('Please enter a name!')
      }
    },

    joinRoom () {
      if (this.playerName.length !== 0) {
        const upperCode = this.joinCode.toUpperCase()
        if (this.rooms.find((room) => room.roomCode === upperCode)) {
          this.socket.emit('joinRoom', upperCode, this.playerName, Cookies.get('session_id'), (room) => {
            const params = {
              roomCode: room.roomCode,
              playerName: this.playerName,
              stage: room.stage,
              players: room.players
            }
            Cookies.set('roomParams', params)
            this.$router.push({
              name: 'game',
              params
            })
          })
        } else {
          alert('Invalid room code!')
        }
      } else {
        alert('Please enter a name!')
      }
    }
  }
}
</script>

<style scoped>
.caps-input {
  text-transform: uppercase
}
</style>
