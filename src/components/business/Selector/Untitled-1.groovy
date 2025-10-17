    // TODO: 调用实际API加载指标体系图数据
    // const response = await indicatorSystemApi.getGraphData(formData.metricSystemId)
    // cachedData.graphData = response.data
    // return response.data

    // 模拟返回图数据
    console.log('加载指标体系图数据:', formData.metricSystemId)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const graphData = {
      nodes: [
        {
          id: '1',
          label: '根指标',
          type: 'root-node',
          properties: {
            weight: 1,
            content: { id: '1', label: '根指标' }
          }
        },
        {
          id: '2',
          label: '子指标1',
          type: 'branch-node',
          properties: {
            weight: 0.5,
            parentNodeId: '1',
            content: { id: '2', label: '子指标1' }
          }
        },
        {
          id: '3',
          label: '子指标2',
          type: 'branch-node',
          properties: {
            weight: 0.5,
            parentNodeId: '1',
            content: { id: '3', label: '子指标2' }
          }
      ],
      edges: [
        { id: 'e1', sourceNodeId: '1', targetNodeId: '2' },
        { id: 'e2', sourceNodeId: '1', targetNodeId: '3' }
      ]
    }