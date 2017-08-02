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
        <span v-if="player.king"> (King!)</span>
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
    let isKing = true // !!context.params.players.find((player) => {
    //  return player.king && player.socketid === Cookies.get('session_id')
    // })
    return {
      stage: context.params.stage,
      roomCode: context.params.roomCode,
      playerName: context.params.playerName,
      players: context.params.players,
      king: isKing
    }
  },

  data () {
    return {
      session_id: Cookies.get('session_id'),
      socket,
      stage: 0,
      roomCode: '????',
      playerName: '????',
      players: [],
      king: false
    }
  },

  created () {
    this.socket.on('roomClosed', () => {
      Cookies.remove('session_id')
      this.$router.push('/')
      alert('Room was disbanded!')
    })

    this.socket.on('updateRoom', (room) => {
      this.stage = room.stage
      this.players = room.players
    })
  },

  methods: {
    closeRoom () {
      this.socket.emit('closeRoom', this.roomCode, Cookies.get('session_id'), () => {
        Cookies.remove('session_id')
        this.$router.push('/')
      })
    },

    leaveRoom () {
      this.socket.emit('leaveRoom', this.roomCode, Cookies.get('session_id'), () => {
        Cookies.remove('session_id')
        this.$router.push('/')
      })
    },

    startGame () {
      this.socket.emit('startGame', this.roomCode, Cookies.get('session_id'), () => {})
    }
  }
}
</script>
