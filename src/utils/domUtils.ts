import { isServer } from './is'
const ieVersion = isServer ? 0 : Number((document as any).documentMode)
const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g
const MOZ_HACK_REGEXP = /^moz([A-Z])/

export interface ViewportOffsetResult {
  left: number
  top: number
  right: number
  bottom: number
  rightIncludeBody: number
  bottomIncludeBody: number
}

/* istanbul ignore next */
const trim = function (string: string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
}

/* istanbul ignore next */
const camelCase = function (name: string) {
  return name
    .replace(SPECIAL_CHARS_REGEXP, function (_, __, letter, offset) {
      return offset ? letter.toUpperCase() : letter
    })
    .replace(MOZ_HACK_REGEXP, 'Moz$1')
}

/* istanbul ignore next */
export function hasClass(el: Element, cls: string) {
  if (!el || !cls) return false
  if (cls.indexOf(' ') !== -1) {
    throw new Error('className should not contain space.')
  }
  if (el.classList) {
    return el.classList.contains(cls)
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1
  }
}

/* istanbul ignore next */
export function addClass(el: Element, cls: string) {
  if (!el) return
  let curClass = el.className
  const classes = (cls || '').split(' ')

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.add(clsName)
    } else if (!hasClass(el, clsName)) {
      curClass += ' ' + clsName
    }
  }
  if (!el.classList) {
    el.className = curClass
  }
}

/* istanbul ignore next */
export function removeClass(el: Element, cls: string) {
  if (!el || !cls) return
  const classes = cls.split(' ')
  let curClass = ' ' + el.className + ' '

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.remove(clsName)
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(' ' + clsName + ' ', ' ')
    }
  }
  if (!el.classList) {
    el.className = trim(curClass)
  }
}

export function getBoundingClientRect(element: Element): DOMRect | number {
  if (!element || !element.getBoundingClientRect) {
    return 0
  }
  return element.getBoundingClientRect()
}

/**
 * 获取当前元素的left、top偏移
 *   left：元素最左侧距离文档左侧的距离
 *   top:元素最顶端距离文档顶端的距离
 *   right:元素最右侧距离文档右侧的距离
 *   bottom：元素最底端距离文档底端的距离
 *   rightIncludeBody：元素最左侧距离文档右侧的距离
 *   bottomIncludeBody：元素最底端距离文档最底部的距离
 *
 * @description:
 */
export function getViewportOffset(element: Element): ViewportOffsetResult {
  const doc = document.documentElement

  const docScrollLeft = doc.scrollLeft
  const docScrollTop = doc.scrollTop
  const docClientLeft = doc.clientLeft
  const docClientTop = doc.clientTop

  const pageXOffset = window.pageXOffset
  const pageYOffset = window.pageYOffset

  const box = getBoundingClientRect(element)

  const { left: retLeft, top: rectTop, width: rectWidth, height: rectHeight } = box as DOMRect

  const scrollLeft = (pageXOffset || docScrollLeft) - (docClientLeft || 0)
  const scrollTop = (pageYOffset || docScrollTop) - (docClientTop || 0)
  const offsetLeft = retLeft + pageXOffset
  const offsetTop = rectTop + pageYOffset

  const left = offsetLeft - scrollLeft
  const top = offsetTop - scrollTop

  const clientWidth = window.document.documentElement.clientWidth
  const clientHeight = window.document.documentElement.clientHeight
  return {
    left: left,
    top: top,
    right: clientWidth - rectWidth - left,
    bottom: clientHeight - rectHeight - top,
    rightIncludeBody: clientWidth - left,
    bottomIncludeBody: clientHeight - top
  }
}

/* istanbul ignore next */
export const on = function (
  element: HTMLElement | Document | Window,
  event: string,
  handler: EventListenerOrEventListenerObject
): void {
  if (element && event && handler) {
    element.addEventListener(event, handler, false)
  }
}

/* istanbul ignore next */
export const off = function (
  element: HTMLElement | Document | Window,
  event: string,
  handler: any
): void {
  if (element && event && handler) {
    element.removeEventListener(event, handler, false)
  }
}

/* istanbul ignore next */
export const once = function (el: HTMLElement, event: string, fn: EventListener): void {
  const listener = function (this: any, ...args: unknown[]) {
    if (fn) {
      // @ts-ignore
      fn.apply(this, args)
    }
    off(el, event, listener)
  }
  on(el, event, listener)
}

/* istanbul ignore next */
export const getStyle =
  ieVersion < 9
    ? function (element: Element | any, styleName: string) {
        if (isServer) return
        if (!element || !styleName) return null
        styleName = camelCase(styleName)
        if (styleName === 'float') {
          styleName = 'styleFloat'
        }
        try {
          switch (styleName) {
            case 'opacity':
              try {
                return element.filters.item('alpha').opacity / 100
              } catch (e) {
                return 1.0
              }
            default:
              return element.style[styleName] || element.currentStyle
                ? element.currentStyle[styleName]
                : null
          }
        } catch (e) {
          return element.style[styleName]
        }
      }
    : function (element: Element | any, styleName: string) {
        if (isServer) return
        if (!element || !styleName) return null
        styleName = camelCase(styleName)
        if (styleName === 'float') {
          styleName = 'cssFloat'
        }
        try {
          const computed = (document as any).defaultView.getComputedStyle(element, '')
          return element.style[styleName] || computed ? computed[styleName] : null
        } catch (e) {
          return element.style[styleName]
        }
      }

/* istanbul ignore next */
export function setStyle(element: Element | any, styleName: any, value: any) {
  if (!element || !styleName) return

  if (typeof styleName === 'object') {
    for (const prop in styleName) {
      if (Object.prototype.hasOwnProperty.call(styleName, prop)) {
        setStyle(element, prop, styleName[prop])
      }
    }
  } else {
    styleName = camelCase(styleName)
    if (styleName === 'opacity' && ieVersion < 9) {
      element.style.filter = isNaN(value) ? '' : 'alpha(opacity=' + value * 100 + ')'
    } else {
      element.style[styleName] = value
    }
  }
}

/* istanbul ignore next */
export const isScroll = (el: Element, vertical: any) => {
  if (isServer) return

  const determinedDirection = vertical !== null || vertical !== undefined
  const overflow = determinedDirection
    ? vertical
      ? getStyle(el, 'overflow-y')
      : getStyle(el, 'overflow-x')
    : getStyle(el, 'overflow')

  return overflow.match(/(scroll|auto)/)
}

/* istanbul ignore next */
export const getScrollContainer = (el: Element, vertical?: any) => {
  if (isServer) return

  let parent: any = el
  while (parent) {
    if ([window, document, document.documentElement].includes(parent)) {
      return window
    }
    if (isScroll(parent, vertical)) {
      return parent
    }
    parent = parent.parentNode
  }

  return parent
}

/* istanbul ignore next */
export const isInContainer = (el: Element, container: any) => {
  if (isServer || !el || !container) return false

  const elRect = el.getBoundingClientRect()
  let containerRect

  if ([window, document, document.documentElement, null, undefined].includes(container)) {
    containerRect = {
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
      left: 0
    }
  } else {
    containerRect = container.getBoundingClientRect()
  }

  return (
    elRect.top < containerRect.bottom &&
    elRect.bottom > containerRect.top &&
    elRect.right > containerRect.left &&
    elRect.left < containerRect.right
  )
}

/**
 * window.open 方法封装的配置选项
 */
export interface WindowOpenOptions {
  /** 窗口名称 */
  target?: string
  /** 窗口宽度 */
  width?: number
  /** 窗口高度 */
  height?: number
  /** 窗口左边距 */
  left?: number
  /** 窗口上边距 */
  top?: number
  /** 是否显示菜单栏 */
  menubar?: boolean
  /** 是否显示工具栏 */
  toolbar?: boolean
  /** 是否显示地址栏 */
  location?: boolean
  /** 是否显示状态栏 */
  status?: boolean
  /** 是否可调整大小 */
  resizable?: boolean
  /** 是否显示滚动条 */
  scrollbars?: boolean
  /** 是否置顶 */
  alwaysRaised?: boolean
  /** 是否置底 */
  alwaysLowered?: boolean
  /** 是否全屏 */
  fullscreen?: boolean
  /** 是否居中显示 */
  centered?: boolean
}

/**
 * 封装的 window.open 方法
 * @param url 要打开的URL
 * @param options 窗口配置选项
 * @returns 返回新窗口的引用，如果失败则返回 null
 */
export function openWindow(url: string, options: WindowOpenOptions = {}): Window | null {
  // 服务端渲染环境下直接返回 null
  if (isServer) {
    console.warn('openWindow: 服务端环境下无法打开窗口')
    return null
  }

  // 检查 URL 是否有效
  if (!url || typeof url !== 'string') {
    console.error('openWindow: URL 参数无效')
    return null
  }

  const {
    target = '_blank',
    width = 800,
    height = 600,
    left,
    top,
    menubar = false,
    toolbar = false,
    location = false,
    status = false,
    resizable = true,
    scrollbars = true,
    alwaysRaised = false,
    alwaysLowered = false,
    fullscreen = false,
    centered = true
  } = options

  // 计算窗口位置（如果需要居中）
  let finalLeft = left
  let finalTop = top

  if (centered && (finalLeft === undefined || finalTop === undefined)) {
    const screenWidth = window.screen.availWidth
    const screenHeight = window.screen.availHeight
    finalLeft = finalLeft ?? Math.round((screenWidth - width) / 2)
    finalTop = finalTop ?? Math.round((screenHeight - height) / 2)
  }

  // 构建窗口特性字符串
  const features: string[] = []
  
  if (width) features.push(`width=${width}`)
  if (height) features.push(`height=${height}`)
  if (finalLeft !== undefined) features.push(`left=${finalLeft}`)
  if (finalTop !== undefined) features.push(`top=${finalTop}`)
  
  features.push(`menubar=${menubar ? 'yes' : 'no'}`)
  features.push(`toolbar=${toolbar ? 'yes' : 'no'}`)
  features.push(`location=${location ? 'yes' : 'no'}`)
  features.push(`status=${status ? 'yes' : 'no'}`)
  features.push(`resizable=${resizable ? 'yes' : 'no'}`)
  features.push(`scrollbars=${scrollbars ? 'yes' : 'no'}`)
  
  if (alwaysRaised) features.push('alwaysRaised=yes')
  if (alwaysLowered) features.push('alwaysLowered=yes')
  if (fullscreen) features.push('fullscreen=yes')

  const featuresString = features.join(',')

  try {
    const newWindow = window.open(url, target, featuresString)
    
    if (!newWindow) {
      console.warn('openWindow: 窗口可能被浏览器阻止弹出')
      return null
    }

    // 尝试聚焦新窗口
    if (newWindow.focus) {
      newWindow.focus()
    }

    return newWindow
  } catch (error) {
    console.error('openWindow: 打开窗口时发生错误', error)
    return null
  }
}

/**
 * 打开新标签页的便捷方法
 * @param url 要打开的URL
 * @returns 返回新窗口的引用，如果失败则返回 null
 */
export function openTab(url: string): Window | null {
  return openWindow(url, { target: '_blank' })
}

/**
 * 打开弹窗的便捷方法
 * @param url 要打开的URL
 * @param width 窗口宽度，默认 800
 * @param height 窗口高度，默认 600
 * @returns 返回新窗口的引用，如果失败则返回 null
 */
export function openPopup(url: string, width = 800, height = 600): Window | null {
  return openWindow(url, {
    width,
    height,
    centered: true,
    menubar: false,
    toolbar: false,
    location: false,
    status: false,
    resizable: true,
    scrollbars: true
  })
}

/**
 * 下载方法的配置选项
 */
export interface DownloadOptions {
  /** 下载的文件名 */
  filename?: string
  /** MIME 类型 */
  mimeType?: string
  /** 是否在新窗口中打开（用于某些浏览器的兼容性） */
  openInNewWindow?: boolean
}

/**
 * 通用下载方法
 * @param data 要下载的数据，可以是 URL、Blob 或字符串
 * @param options 下载配置选项
 */
export function download(data: string | Blob, options: DownloadOptions = {}): void {
  // 服务端渲染环境下直接返回
  if (isServer) {
    console.warn('download: 服务端环境下无法执行下载')
    return
  }

  const { filename = 'download', mimeType, openInNewWindow = false } = options

  try {
    let url: string
    let shouldRevokeUrl = false

    // 处理不同类型的数据
    if (typeof data === 'string') {
      // 如果是 URL 字符串
      if (data.startsWith('http') || data.startsWith('data:') || data.startsWith('blob:')) {
        url = data
      } else {
        // 如果是普通字符串，创建 Blob
        const blob = new Blob([data], { type: mimeType || 'text/plain' })
        url = URL.createObjectURL(blob)
        shouldRevokeUrl = true
      }
    } else if (data instanceof Blob) {
      // 如果是 Blob 对象（File 继承自 Blob）
      url = URL.createObjectURL(data)
      shouldRevokeUrl = true
    } else {
      console.error('download: 不支持的数据类型')
      return
    }

    // 创建下载链接
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.style.display = 'none'

    // 添加到 DOM 并触发点击
    document.body.appendChild(link)

    if (openInNewWindow) {
      // 在某些浏览器中，可能需要在新窗口中打开
      link.target = '_blank'
    }

    link.click()

    // 清理
    document.body.removeChild(link)

    // 如果创建了临时 URL，需要释放
    if (shouldRevokeUrl) {
      // 延迟释放 URL，确保下载完成
      setTimeout(() => {
        URL.revokeObjectURL(url)
      }, 100)
    }
  } catch (error) {
    console.error('download: 下载时发生错误', error)
  }
}

/**
 * 下载文本文件
 * @param text 文本内容
 * @param filename 文件名，默认为 'text.txt'
 * @param mimeType MIME 类型，默认为 'text/plain'
 */
export function downloadText(text: string, filename = 'text.txt', mimeType = 'text/plain'): void {
  download(text, { filename, mimeType })
}

/**
 * 下载 JSON 文件
 * @param data 要下载的数据对象
 * @param filename 文件名，默认为 'data.json'
 */
export function downloadJson(data: any, filename = 'data.json'): void {
  const jsonString = JSON.stringify(data, null, 2)
  download(jsonString, { filename, mimeType: 'application/json' })
}

/**
 * 下载 CSV 文件
 * @param data CSV 数据，可以是字符串或二维数组
 * @param filename 文件名，默认为 'data.csv'
 */
export function downloadCsv(data: string | string[][], filename = 'data.csv'): void {
  let csvContent: string

  if (typeof data === 'string') {
    csvContent = data
  } else {
    // 将二维数组转换为 CSV 格式
    csvContent = data.map(row => 
      row.map(cell => {
        // 如果单元格包含逗号、引号或换行符，需要用引号包围
        if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))) {
          return `"${cell.replace(/"/g, '""')}"`
        }
        return cell
      }).join(',')
    ).join('\n')
  }

  download(csvContent, { filename, mimeType: 'text/csv' })
}

/**
 * 通过 URL 下载文件（支持从响应头获取文件名）
 * @param url 文件 URL
 * @param filename 文件名（可选，不传则从响应头 Content-Disposition 中获取）
 * @param options 额外配置
 */
export function downloadByUrl(
  url: string, 
  filename?: string,
  options?: {
    /** 请求方法，默认 GET */
    method?: 'GET' | 'POST'
    /** 请求头 */
    headers?: Record<string, string>
    /** 请求体（POST 时使用） */
    body?: any
  }
): Promise<void> {
  if (!url) {
    console.error('downloadByUrl: URL 不能为空')
    return Promise.reject(new Error('URL 不能为空'))
  }

  const { method = 'GET', headers = {}, body } = options || {}

  return fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // 如果没有传入 filename，尝试从响应头中获取
      let finalFilename = filename
      if (!finalFilename) {
        // 从 Content-Disposition 响应头中提取文件名
        const contentDisposition = response.headers.get('Content-Disposition')
        if (contentDisposition) {
          // 支持多种格式：
          // attachment; filename="filename.jpg"
          // attachment; filename*=UTF-8''filename.jpg
          // attachment; filename="filename.jpg"; filename*=UTF-8''filename.jpg
          
          // 优先尝试 UTF-8 编码的文件名
          const filenameStarMatch = contentDisposition.match(/filename\*=UTF-8''(.+?)(?:;|$)/i)
          if (filenameStarMatch) {
            finalFilename = decodeURIComponent(filenameStarMatch[1])
          } else {
            // 尝试普通 filename
            const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/i)
            if (filenameMatch && filenameMatch[1]) {
              finalFilename = filenameMatch[1].replace(/['"]/g, '')
              // 尝试 URL 解码
              try {
                finalFilename = decodeURIComponent(finalFilename)
              } catch (e) {
                // 解码失败则使用原值
              }
            }
          }
        }
        
        // 如果还是没有文件名，尝试从 URL 中提取
        if (!finalFilename) {
          try {
            const urlObj = new URL(url)
            const pathname = urlObj.pathname
            finalFilename = pathname.split('/').pop() || 'download'
          } catch {
            finalFilename = 'download'
          }
        }
      }

      return response.blob().then(blob => ({ blob, filename: finalFilename }))
    })
    .then(({ blob, filename: finalFilename }) => {
      download(blob, { filename: finalFilename })
    })
    .catch(error => {
      console.error('downloadByUrl: 下载文件时发生错误', error)
      throw error
    })
}

/**
 * 下载 Blob 数据
 * @param blob Blob 对象
 * @param filename 文件名
 */
export function downloadBlob(blob: Blob, filename: string): void {
  download(blob, { filename })
}

/**
 * 将 Canvas 下载为图片
 * @param canvas Canvas 元素
 * @param filename 文件名，默认为 'image.png'
 * @param quality 图片质量（0-1），仅对 JPEG 格式有效
 * @param format 图片格式，默认为 'png'
 */
export function downloadCanvas(
  canvas: HTMLCanvasElement, 
  filename = 'image.png', 
  quality = 0.92,
  format: 'png' | 'jpeg' | 'webp' = 'png'
): void {
  if (!canvas) {
    console.error('downloadCanvas: Canvas 元素不能为空')
    return
  }

  try {
    const mimeType = `image/${format}`
    canvas.toBlob((blob) => {
      if (blob) {
        download(blob, { filename, mimeType })
      } else {
        console.error('downloadCanvas: 无法创建 Blob')
      }
    }, mimeType, quality)
  } catch (error) {
    console.error('downloadCanvas: 下载 Canvas 时发生错误', error)
  }
}
