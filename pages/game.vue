<template>
  <section class="container">
    <div>Welcome to room {{ roomCode }}</div>
    <template v-if="king">
      <template v-if="stage === 0">
        <button v-on:click="startGame">Start Game</button>
        <br>
        <button v-on:click="closeRoom">Disband Room</button>
      </template>
    </template>
    <button v-else v-on:click="leaveRoom">Leave Room</button>
    <br>
    Stage {{stage}}
    <br>
    <ul>
      <li v-for="player in players" :key="player.socketid">
        {{ player.playerName }}
        <span v-if="king"> (King!)</span>
      </li>
    </ul>
  </section>
</template>

<script>
import socket from '~/plugins/socket.io'
import Cookies from '~/plugins/js-cookie'

export default {
  asyncData (context) {
    if (!context.params.roomCode) {
      context.redirect('/')
    }
    return {
      king: context.params.king,
      stage: context.params.stage,
      roomCode: context.params.roomCode,
      playerName: context.params.playerName,
      players: context.params.players
    }
  },

  data () {
    return {
      king: false,
      socket
    }
  },

  created () {
    this.socket.on('roomClosed', () => {
      Cookies.remove('roomParams')
      this.$router.push('/')
      alert('Room was disbanded!')
    })

    this.socket.on('updateRoom', (room) => {
      let params = Cookies.getJSON('roomParams')
      this.stage = room.stage
      this.players = room.players
      params.stage = room.stage
      params.players = room.players
      Cookies.set('roomParams', params)
    })
  },

  methods: {
    closeRoom () {
      Cookies.remove('roomParams')
      this.socket.emit('closeRoom', this.roomCode, () => {
        this.$router.push('/')
      })
    },

    leaveRoom () {
      Cookies.remove('roomParams')
      this.socket.emit('leaveRoom', this.roomCode, () => {
        this.$router.push('/')
      })
    },

    startGame () {
      this.socket.emit('startGame', this.roomCode, () => {})
    }
  }
}
</script>
