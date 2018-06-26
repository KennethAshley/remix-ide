const moduleID = require('./module-id.js')
const remixLib = require('remix-lib')
const EventManager = remixLib.EventManager

module.exports = class registry {
  constructor () {
    this.state = {}
    this.stateUid = {}
  }
  put ({ api, events, name }) {
    const serveruid = moduleID() + '.' + (name || '')
    console.log('registering ', serveruid)
    if (this.state[serveruid]) return this.state[serveruid]
    const server = {
      uid: serveruid,
      event: api.event ? api.event : new EventManager(),
      clients: []
    }
    this.state[name] = {
      _name: name,
      _api: api,
      _events: events,
      server: server
    }
    this.state[serveruid] = {
      _name: name,
      _api: api,
      _events: events,
      server: server
    }
    return server
  }
  getByUid (uid) {
    const clientuid = moduleID()
    const state = this.stateUid[uid]
    if (!state) return
    const server = state.server
    const client = {
      uid: clientuid,
      api: state._api,
      event: server.event
    }
    server.clients.push(client)
    return client
  }
  get (name) {
    const clientuid = moduleID()
    const state = this.state[name]
    if (!state) return
    const server = state.server
    const client = {
      uid: clientuid,
      api: state._api,
      event: server.event
    }
    server.clients.push(client)
    return client
  }
}
