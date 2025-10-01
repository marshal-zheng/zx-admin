import ZxGridList from './index.vue'

ZxGridList.install = function (app) {
  app.component(ZxGridList.name || ZxGridList.__name, ZxGridList)
}

export default ZxGridList
export { ZxGridList }
