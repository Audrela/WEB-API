'use strict'
const playlistSpec = require ('./playlist.Spec')
const storage = require ('node-persist')


describe('playlist', () => {

  beforeEach( () => {
    storage.initSync()
    storage.clearSync()
    const data = {id: '12345'}
    storage.setItemSync(data.id, data)
  })

  describe('add', () => {
  
    it('should add a valid item', () => {
      const data = {id: '54321'}
      const added = playlistSpec.addItem(data)
      expect(added).toBe(true)
      const item = storage.getItemSync(data.id)
      expect(storage.length()).toBe(2)
    })
  })
    it('should not add a duplicate item', () => {
      const data = {id: '12345'}
      const added = playlistSpec.addItem(data)
      expect(added).toBe(false)
      expect(storage.length()).toBe(1)
    })
    
  })
  describe('update', () => {
    it('Should update the item', () => {
        const data = {id: '12345'}
        const item = storage.getItemSync(data.id)
        expect(storage.length()).toBe(1)
        const update = playlistSpec.updateItem(data)
        expect(update).toBe(false)
        expect(storage.length()).toBe(1)
    })
  })
  describe('delete', () => {
    it('Should delete item from a list', () => {
      const data = {id: '12345'}
      const item = storage.getItemSync(data.id)
      expect(storage.length()).toBe(1)
      const removed = playlistSpec.removeItem(data)
      expect(removed).toBe(false)
      expect(storage.length()).toBe(1)
    })
  })