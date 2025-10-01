// 创建网格位置对象的工厂函数
export const createGridPos = (options: any = {}) => {
  return {
    w: 6,
    h: 3,
    minH: 1,
    minW: 1,
    maxH: undefined,
    maxW: undefined,
    static: false,
    y: 0,
    x: 0,
    ...options
  }
}

// 面板模型的默认值和验证函数
export const createPanelModel = (options: any = {}) => {
  return {
    gridPos: createGridPos(options.gridPos || {}),
    title: '',
    path: '',
    params: {},
    type: 'panel',
    ...options
  }
}

// 验证网格位置对象
export const validateGridPos = (gridPos: any) => {
  return (
    gridPos &&
    typeof gridPos.w === 'number' &&
    typeof gridPos.h === 'number' &&
    typeof gridPos.y === 'number'
  )
}

// 验证面板模型对象
export const validatePanelModel = (panel: any) => {
  return (
    panel &&
    validateGridPos(panel.gridPos) &&
    typeof panel.title === 'string' &&
    typeof panel.path === 'string' &&
    typeof panel.params === 'object'
  )
}
