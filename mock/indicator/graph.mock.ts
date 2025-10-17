// 油料库火灾损毁评估体系 - 图数据
export const fireAccidentGraphData = {
  nodes: [
    // Level 1: 根节点 - 油料库火灾损毁
    {
      id: 'root-1',
      type: 'root-node',
      label: '油料库火灾损毁',
      x: 950,
      y: 50,
      properties: {
        content: { id: 'root-content-1', label: '油料库火灾损毁' },
        weight: 100,
        otherData: {},
        parentNodeId: null,
        customType: '',
        customProperties: '',
        unit: '',
        priority: '',
        defaultValue: '',
        notes: '油料库火灾损毁综合评估指标',
        level: 1
      }
    },

    // Level 2: 四大类别
    {
      id: 'cat-1',
      type: 'sub-node',
      label: '泄漏与扩散',
      x: 250,
      y: 250,
      properties: {
        content: { id: 'cat-content-1', label: '泄漏与扩散' },
        weight: 16,
        otherData: {},
        parentNodeId: 'root-1',
        customType: '',
        customProperties: '',
        unit: '',
        priority: '',
        defaultValue: '',
        notes: '',
        level: 2
      }
    },
    {
      id: 'cat-2',
      type: 'sub-node',
      label: '危害影响',
      x: 650,
      y: 250,
      properties: {
        content: { id: 'cat-content-2', label: '危害影响' },
        weight: 34,
        otherData: {},
        parentNodeId: 'root-1',
        customType: '',
        customProperties: '',
        unit: '',
        priority: '',
        defaultValue: '',
        notes: '',
        level: 2
      }
    },
    {
      id: 'cat-3',
      type: 'sub-node',
      label: '应急响应效能',
      x: 1100,
      y: 250,
      properties: {
        content: { id: 'cat-content-3', label: '应急响应效能' },
        weight: 30,
        otherData: {},
        parentNodeId: 'root-1',
        customType: '',
        customProperties: '',
        unit: '',
        priority: '',
        defaultValue: '',
        notes: '',
        level: 2
      }
    },
    {
      id: 'cat-4',
      type: 'sub-node',
      label: '处置效果与损失',
      x: 1600,
      y: 250,
      properties: {
        content: { id: 'cat-content-4', label: '处置效果与损失' },
        weight: 20,
        otherData: {},
        parentNodeId: 'root-1',
        customType: '',
        customProperties: '',
        unit: '',
        priority: '',
        defaultValue: '',
        notes: '',
        level: 2
      }
    },

    // Level 3: 泄漏与扩散 - 4个指标
    {
      id: 'ind-1-1',
      type: 'sub-node',
      label: '泄漏速率',
      x: 50,
      y: 450,
      properties: {
        content: { id: 'ind-content-1-1', label: '泄漏速率' },
        weight: 4,
        otherData: {},
        parentNodeId: 'cat-1',
        customType: '',
        customProperties: '由油料事故泄漏机理模型计算',
        unit: 'L/min',
        priority: '',
        defaultValue: '',
        notes: '',
        level: 3
      }
    },
    {
      id: 'ind-1-2',
      type: 'sub-node',
      label: '总泄漏量',
      x: 180,
      y: 450,
      properties: {
        content: { id: 'ind-content-1-2', label: '总泄漏量' },
        weight: 4,
        otherData: {},
        parentNodeId: 'cat-1',
        customType: '',
        customProperties:
          '事故过程中总的泄漏量，总泄漏量=点1泄漏量+点2泄漏量+┈+点n泄漏量；单点泄漏量=泄漏速率×泄漏时间',
        unit: 'm³',
        priority: '',
        defaultValue: '',
        notes: '',
        level: 3
      }
    },
    {
      id: 'ind-1-3',
      type: 'sub-node',
      label: '泄漏覆盖面积',
      x: 310,
      y: 450,
      properties: {
        content: { id: 'ind-content-1-3', label: '泄漏覆盖面积' },
        weight: 4,
        otherData: {},
        parentNodeId: 'cat-1',
        customType: '',
        customProperties: '由油料事故泄漏机理模型计算',
        unit: 'm²',
        priority: '',
        defaultValue: '',
        notes: '',
        level: 3
      }
    },
    {
      id: 'ind-1-4',
      type: 'sub-node',
      label: '燃烧面积',
      x: 440,
      y: 450,
      properties: {
        content: { id: 'ind-content-1-4', label: '燃烧面积' },
        weight: 4,
        otherData: {},
        parentNodeId: 'cat-1',
        customType: '',
        customProperties: '由油料事故燃烧机理模型计算',
        unit: 'm²',
        priority: '',
        defaultValue: '',
        notes: '',
        level: 3
      }
    },

    // Level 3: 危害影响 - 5个指标
    {
      id: 'ind-2-1',
      type: 'sub-node',
      label: '人员死亡数量',
      x: 500,
      y: 450,
      properties: {
        content: { id: 'ind-content-2-1', label: '人员死亡数量' },
        weight: 11,
        otherData: {},
        parentNodeId: 'cat-2',
        customType: '',
        customProperties: '平台统计实际死亡人员数据',
        unit: '人',
        priority: '',
        defaultValue: '',
        notes: '',
        level: 3
      }
    },
    {
      id: 'ind-2-2',
      type: 'sub-node',
      label: '人员重伤数量',
      x: 600,
      y: 450,
      properties: {
        content: { id: 'ind-content-2-2', label: '人员重伤数量' },
        weight: 7,
        otherData: {},
        parentNodeId: 'cat-2',
        customType: '',
        customProperties: '平台统计实际重伤人员数据',
        unit: '人',
        priority: '',
        defaultValue: '',
        notes: '',
        level: 3
      }
    },
    {
      id: 'ind-2-3',
      type: 'sub-node',
      label: '人员轻伤数量',
      x: 700,
      y: 450,
      properties: {
        content: { id: 'ind-content-2-3', label: '人员轻伤数量' },
        weight: 6,
        otherData: {},
        parentNodeId: 'cat-2',
        customType: '',
        customProperties: '平台统计实际轻伤人员数据',
        unit: '个',
        priority: '',
        defaultValue: '',
        notes: '',
        level: 3
      }
    },
    {
      id: 'ind-2-4',
      type: 'sub-node',
      label: '中毒发生率',
      x: 800,
      y: 450,
      properties: {
        content: { id: 'ind-content-2-4', label: '中毒发生率' },
        weight: 5,
        otherData: {},
        parentNodeId: 'cat-2',
        customType: '',
        customProperties: 'CO/NO₂超标暴露人数，中毒发生率=（暴露人数/总人数）×100%',
        unit: '%',
        priority: '',
        defaultValue: '',
        notes: '',
        level: 3
      }
    },
    {
      id: 'ind-2-5',
      type: 'sub-node',
      label: '车辆损毁数量',
      x: 900,
      y: 450,
      properties: {
        content: { id: 'ind-content-2-5', label: '车辆损毁数量' },
        weight: 5,
        otherData: {},
        parentNodeId: 'cat-2',
        customType: '',
        customProperties: '平台统计实际车辆损毁数据',
        unit: '台',
        priority: '',
        defaultValue: '',
        notes: '',
        level: 3
      }
    },

    // Level 3: 应急响应效能 - 6个指标
    {
      id: 'ind-3-1',
      type: 'sub-node',
      label: '报警延迟时间',
      x: 940,
      y: 450,
      properties: {
        content: { id: 'ind-content-3-1', label: '报警延迟时间' },
        weight: 6,
        otherData: {},
        parentNodeId: 'cat-3',
        customType: '',
        customProperties: '从起火到首次报警的时间，报警延迟=首次报警时间-起火时间',
        unit: 'min',
        priority: '',
        defaultValue: '',
        notes: '',
        level: 3
      }
    },
    {
      id: 'ind-3-2',
      type: 'sub-node',
      label: '疏散时间',
      x: 1030,
      y: 450,
      properties: {
        content: { id: 'ind-content-3-2', label: '疏散时间' },
        weight: 6,
        otherData: {},
        parentNodeId: 'cat-3',
        customType: '',
        customProperties: '从报警到全员撤离的时间，疏散时间通过仿真平台计时',
        unit: 'min',
        priority: '',
        defaultValue: '',
        notes: '',
        level: 3
      }
    },
    {
      id: 'ind-3-3',
      type: 'sub-node',
      label: '内部救援到位时间',
      x: 1120,
      y: 450,
      properties: {
        content: { id: 'ind-content-3-3', label: '内部救援到位时间' },
        weight: 5,
        otherData: {},
        parentNodeId: 'cat-3',
        customType: '',
        customProperties: '微型消防站抵达时间，救援抵达时间=到达现场时间-接警时间',
        unit: 'min',
        priority: '',
        defaultValue: '',
        notes: '',
        level: 3
      }
    },
    {
      id: 'ind-3-4',
      type: 'sub-node',
      label: '消防力量到位时间',
      x: 1210,
      y: 450,
      properties: {
        content: { id: 'ind-content-3-4', label: '消防力量到位时间' },
        weight: 5,
        otherData: {},
        parentNodeId: 'cat-3',
        customType: '',
        customProperties: '消防支队抵达时间，救援抵达时间=到达现场时间-接警时间',
        unit: 'min',
        priority: '',
        defaultValue: '',
        notes: '',
        level: 3
      }
    },
    {
      id: 'ind-3-5',
      type: 'sub-node',
      label: '消防车出动数量',
      x: 1300,
      y: 450,
      properties: {
        content: { id: 'ind-content-3-5', label: '消防车出动数量' },
        weight: 4,
        otherData: {},
        parentNodeId: 'cat-3',
        customType: '',
        customProperties: '平台统计实际出动消防车数量数据',
        unit: '台',
        priority: '',
        defaultValue: '',
        notes: '',
        level: 3
      }
    },
    {
      id: 'ind-3-6',
      type: 'sub-node',
      label: '消防员出动数量',
      x: 1390,
      y: 450,
      properties: {
        content: { id: 'ind-content-3-6', label: '消防员出动数量' },
        weight: 4,
        otherData: {},
        parentNodeId: 'cat-3',
        customType: '',
        customProperties: '平台统计实际出动消防员数量数据',
        unit: '人',
        priority: '',
        defaultValue: '',
        notes: '',
        level: 3
      }
    },

    // Level 3: 处置效果与损失 - 4个指标
    {
      id: 'ind-4-1',
      type: 'sub-node',
      label: '火灾扑灭时间',
      x: 1450,
      y: 450,
      properties: {
        content: { id: 'ind-content-4-1', label: '火灾扑灭时间' },
        weight: 5,
        otherData: {},
        parentNodeId: 'cat-4',
        customType: '',
        customProperties: '从火灾开始到火灾扑灭的时间，平台统计火灾时间数据',
        unit: 'min',
        priority: '',
        defaultValue: '',
        notes: '',
        level: 3
      }
    },
    {
      id: 'ind-4-2',
      type: 'sub-node',
      label: '泄漏控制时间',
      x: 1560,
      y: 450,
      properties: {
        content: { id: 'ind-content-4-2', label: '泄漏控制时间' },
        weight: 5,
        otherData: {},
        parentNodeId: 'cat-4',
        customType: '',
        customProperties: '从泄漏开始到停止泄漏的时间，平台统计泄漏时间数据',
        unit: 'min',
        priority: '',
        defaultValue: '',
        notes: '',
        level: 3
      }
    },
    {
      id: 'ind-4-3',
      type: 'sub-node',
      label: '疏散人员数量',
      x: 1670,
      y: 450,
      properties: {
        content: { id: 'ind-content-4-3', label: '疏散人员数量' },
        weight: 5,
        otherData: {},
        parentNodeId: 'cat-4',
        customType: '',
        customProperties: '平台统计疏散人员数量',
        unit: '人',
        priority: '',
        defaultValue: '',
        notes: '',
        level: 3
      }
    },
    {
      id: 'ind-4-4',
      type: 'sub-node',
      label: '直接经济损失',
      x: 1780,
      y: 450,
      properties: {
        content: { id: 'ind-content-4-4', label: '直接经济损失' },
        weight: 5,
        otherData: {},
        parentNodeId: 'cat-4',
        customType: '',
        customProperties: '烧毁设备、建筑、物资价值，人员伤亡救治、赔偿等',
        unit: '万元',
        priority: '',
        defaultValue: '',
        notes: '',
        level: 3
      }
    }
  ],
  edges: [
    // Level 1 -> Level 2 连接
    {
      id: 'edge-root-cat1',
      type: 'mindmap-edge',
      sourceNodeId: 'root-1',
      targetNodeId: 'cat-1',
      startPoint: { x: 950, y: 50 },
      endPoint: { x: 250, y: 250 },
      properties: { router: 'manhattan' },
      pointsList: []
    },
    {
      id: 'edge-root-cat2',
      type: 'mindmap-edge',
      sourceNodeId: 'root-1',
      targetNodeId: 'cat-2',
      startPoint: { x: 950, y: 50 },
      endPoint: { x: 650, y: 250 },
      properties: { router: 'manhattan' },
      pointsList: []
    },
    {
      id: 'edge-root-cat3',
      type: 'mindmap-edge',
      sourceNodeId: 'root-1',
      targetNodeId: 'cat-3',
      startPoint: { x: 950, y: 50 },
      endPoint: { x: 1100, y: 250 },
      properties: { router: 'manhattan' },
      pointsList: []
    },
    {
      id: 'edge-root-cat4',
      type: 'mindmap-edge',
      sourceNodeId: 'root-1',
      targetNodeId: 'cat-4',
      startPoint: { x: 950, y: 50 },
      endPoint: { x: 1600, y: 250 },
      properties: { router: 'manhattan' },
      pointsList: []
    },

    // Level 2 -> Level 3 连接 - 泄漏与扩散
    {
      id: 'edge-cat1-ind1',
      type: 'mindmap-edge',
      sourceNodeId: 'cat-1',
      targetNodeId: 'ind-1-1',
      startPoint: { x: 250, y: 250 },
      endPoint: { x: 50, y: 450 },
      properties: { router: 'manhattan' },
      pointsList: []
    },
    {
      id: 'edge-cat1-ind2',
      type: 'mindmap-edge',
      sourceNodeId: 'cat-1',
      targetNodeId: 'ind-1-2',
      startPoint: { x: 250, y: 250 },
      endPoint: { x: 180, y: 450 },
      properties: { router: 'manhattan' },
      pointsList: []
    },
    {
      id: 'edge-cat1-ind3',
      type: 'mindmap-edge',
      sourceNodeId: 'cat-1',
      targetNodeId: 'ind-1-3',
      startPoint: { x: 250, y: 250 },
      endPoint: { x: 310, y: 450 },
      properties: { router: 'manhattan' },
      pointsList: []
    },
    {
      id: 'edge-cat1-ind4',
      type: 'mindmap-edge',
      sourceNodeId: 'cat-1',
      targetNodeId: 'ind-1-4',
      startPoint: { x: 250, y: 250 },
      endPoint: { x: 440, y: 450 },
      properties: { router: 'manhattan' },
      pointsList: []
    },

    // Level 2 -> Level 3 连接 - 危害影响
    {
      id: 'edge-cat2-ind1',
      type: 'mindmap-edge',
      sourceNodeId: 'cat-2',
      targetNodeId: 'ind-2-1',
      startPoint: { x: 650, y: 250 },
      endPoint: { x: 500, y: 450 },
      properties: { router: 'manhattan' },
      pointsList: []
    },
    {
      id: 'edge-cat2-ind2',
      type: 'mindmap-edge',
      sourceNodeId: 'cat-2',
      targetNodeId: 'ind-2-2',
      startPoint: { x: 650, y: 250 },
      endPoint: { x: 600, y: 450 },
      properties: { router: 'manhattan' },
      pointsList: []
    },
    {
      id: 'edge-cat2-ind3',
      type: 'mindmap-edge',
      sourceNodeId: 'cat-2',
      targetNodeId: 'ind-2-3',
      startPoint: { x: 650, y: 250 },
      endPoint: { x: 700, y: 450 },
      properties: { router: 'manhattan' },
      pointsList: []
    },
    {
      id: 'edge-cat2-ind4',
      type: 'mindmap-edge',
      sourceNodeId: 'cat-2',
      targetNodeId: 'ind-2-4',
      startPoint: { x: 650, y: 250 },
      endPoint: { x: 800, y: 450 },
      properties: { router: 'manhattan' },
      pointsList: []
    },
    {
      id: 'edge-cat2-ind5',
      type: 'mindmap-edge',
      sourceNodeId: 'cat-2',
      targetNodeId: 'ind-2-5',
      startPoint: { x: 650, y: 250 },
      endPoint: { x: 900, y: 450 },
      properties: { router: 'manhattan' },
      pointsList: []
    },

    // Level 2 -> Level 3 连接 - 应急响应效能
    {
      id: 'edge-cat3-ind1',
      type: 'mindmap-edge',
      sourceNodeId: 'cat-3',
      targetNodeId: 'ind-3-1',
      startPoint: { x: 1100, y: 250 },
      endPoint: { x: 940, y: 450 },
      properties: { router: 'manhattan' },
      pointsList: []
    },
    {
      id: 'edge-cat3-ind2',
      type: 'mindmap-edge',
      sourceNodeId: 'cat-3',
      targetNodeId: 'ind-3-2',
      startPoint: { x: 1100, y: 250 },
      endPoint: { x: 1030, y: 450 },
      properties: { router: 'manhattan' },
      pointsList: []
    },
    {
      id: 'edge-cat3-ind3',
      type: 'mindmap-edge',
      sourceNodeId: 'cat-3',
      targetNodeId: 'ind-3-3',
      startPoint: { x: 1100, y: 250 },
      endPoint: { x: 1120, y: 450 },
      properties: { router: 'manhattan' },
      pointsList: []
    },
    {
      id: 'edge-cat3-ind4',
      type: 'mindmap-edge',
      sourceNodeId: 'cat-3',
      targetNodeId: 'ind-3-4',
      startPoint: { x: 1100, y: 250 },
      endPoint: { x: 1210, y: 450 },
      properties: { router: 'manhattan' },
      pointsList: []
    },
    {
      id: 'edge-cat3-ind5',
      type: 'mindmap-edge',
      sourceNodeId: 'cat-3',
      targetNodeId: 'ind-3-5',
      startPoint: { x: 1100, y: 250 },
      endPoint: { x: 1300, y: 450 },
      properties: { router: 'manhattan' },
      pointsList: []
    },
    {
      id: 'edge-cat3-ind6',
      type: 'mindmap-edge',
      sourceNodeId: 'cat-3',
      targetNodeId: 'ind-3-6',
      startPoint: { x: 1100, y: 250 },
      endPoint: { x: 1390, y: 450 },
      properties: { router: 'manhattan' },
      pointsList: []
    },

    // Level 2 -> Level 3 连接 - 处置效果与损失
    {
      id: 'edge-cat4-ind1',
      type: 'mindmap-edge',
      sourceNodeId: 'cat-4',
      targetNodeId: 'ind-4-1',
      startPoint: { x: 1600, y: 250 },
      endPoint: { x: 1450, y: 450 },
      properties: { router: 'manhattan' },
      pointsList: []
    },
    {
      id: 'edge-cat4-ind2',
      type: 'mindmap-edge',
      sourceNodeId: 'cat-4',
      targetNodeId: 'ind-4-2',
      startPoint: { x: 1600, y: 250 },
      endPoint: { x: 1560, y: 450 },
      properties: { router: 'manhattan' },
      pointsList: []
    },
    {
      id: 'edge-cat4-ind3',
      type: 'mindmap-edge',
      sourceNodeId: 'cat-4',
      targetNodeId: 'ind-4-3',
      startPoint: { x: 1600, y: 250 },
      endPoint: { x: 1670, y: 450 },
      properties: { router: 'manhattan' },
      pointsList: []
    },
    {
      id: 'edge-cat4-ind4',
      type: 'mindmap-edge',
      sourceNodeId: 'cat-4',
      targetNodeId: 'ind-4-4',
      startPoint: { x: 1600, y: 250 },
      endPoint: { x: 1780, y: 450 },
      properties: { router: 'manhattan' },
      pointsList: []
    }
  ]
}
