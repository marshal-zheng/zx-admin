// 基于 iconfont 的文件类型图标映射
// 使用项目中已有的 iconfont 图标

// 文件类型枚举
export const UploadAcceptEnum = {
  csv: '.csv',
  excel: '.xlsx,.xls',
  image: '.jpg,.jpeg,.png,.gif,.bmp,.webp,.svg',
  jar: '.jar',
  pdf: '.pdf',
  sql: '.sql',
  plain: '.txt',
  txt: '.txt',
  word: '.doc,.docx',
  video: '.mp4,.avi,.mov,.wmv,.flv,.mkv,.webm',
  xmind: '.xmind',
  zip: '.zip,.rar,.7z,.tar,.gz',
  sketch: '.sketch',
  ppt: '.ppt,.pptx',
  json: '.json',
  jmx: '.jmx',
  har: '.har',
  ms: '.ms',
  unknown: ''
}

// 文件状态枚举
export const UploadStatus = {
  init: 'init',
  uploading: 'uploading',
  done: 'done',
  error: 'error'
}

// 基于 iconfont 的文件图标映射
export const FileIconMap = {
  csv: {
    [UploadStatus.init]: 'icon-icon_file-CSV_colorful_ash',
    [UploadStatus.done]: 'icon-icon_file-CSV_colorful1',
    [UploadStatus.uploading]: 'icon-icon_file-CSV_colorful_ash',
    [UploadStatus.error]: 'icon-icon_file-CSV_colorful_ash'
  },
  excel: {
    [UploadStatus.init]: 'icon-icon_file-excel_colorful_ash',
    [UploadStatus.done]: 'icon-icon_file-excel_colorful1',
    [UploadStatus.uploading]: 'icon-icon_file-excel_colorful_ash',
    [UploadStatus.error]: 'icon-icon_file-excel_colorful_ash'
  },
  image: {
    [UploadStatus.init]: 'icon-icon_file-image_colorful_ash',
    [UploadStatus.done]: 'icon-icon_file-image_colorful1',
    [UploadStatus.uploading]: 'icon-icon_file-image_colorful_ash',
    [UploadStatus.error]: 'icon-icon_file-image_colorful_ash'
  },
  jar: {
    [UploadStatus.init]: 'icon-a-icon_file-jar_colorful_ash',
    [UploadStatus.done]: 'icon-a-icon_file-jar_colorful',
    [UploadStatus.uploading]: 'icon-a-icon_file-jar_colorful_ash',
    [UploadStatus.error]: 'icon-a-icon_file-jar_colorful_ash'
  },
  pdf: {
    [UploadStatus.init]: 'icon-icon_file-pdf_colorful_ash',
    [UploadStatus.done]: 'icon-icon_file-pdf_colorful1',
    [UploadStatus.uploading]: 'icon-icon_file-pdf_colorful_ash',
    [UploadStatus.error]: 'icon-icon_file-pdf_colorful_ash'
  },
  sql: {
    [UploadStatus.init]: 'icon-icon_file-sql_colorful_ash',
    [UploadStatus.done]: 'icon-icon_file-sql_colorful1',
    [UploadStatus.uploading]: 'icon-icon_file-sql_colorful_ash',
    [UploadStatus.error]: 'icon-icon_file-sql_colorful_ash'
  },
  plain: {
    [UploadStatus.init]: 'icon-icon_file-text_colorful_ash',
    [UploadStatus.done]: 'icon-icon_file-text_colorful1',
    [UploadStatus.uploading]: 'icon-icon_file-text_colorful_ash',
    [UploadStatus.error]: 'icon-icon_file-text_colorful_ash'
  },
  txt: {
    [UploadStatus.init]: 'icon-icon_file-text_colorful_ash',
    [UploadStatus.done]: 'icon-icon_file-text_colorful1',
    [UploadStatus.uploading]: 'icon-icon_file-text_colorful_ash',
    [UploadStatus.error]: 'icon-icon_file-text_colorful_ash'
  },
  word: {
    [UploadStatus.init]: 'icon-icon_file-word_colorful_ash',
    [UploadStatus.done]: 'icon-icon_file-word_colorful1',
    [UploadStatus.uploading]: 'icon-icon_file-word_colorful_ash',
    [UploadStatus.error]: 'icon-icon_file-word_colorful_ash'
  },
  video: {
    [UploadStatus.init]: 'icon-icon_file-vedio_colorful_ash',
    [UploadStatus.done]: 'icon-icon_file-vedio_colorful1',
    [UploadStatus.uploading]: 'icon-icon_file-vedio_colorful_ash',
    [UploadStatus.error]: 'icon-icon_file-vedio_colorful_ash'
  },
  xmind: {
    [UploadStatus.init]: 'icon-icon_file-xmind_colorful_ash',
    [UploadStatus.done]: 'icon-icon_file-xmind_colorful1',
    [UploadStatus.uploading]: 'icon-icon_file-xmind_colorful_ash',
    [UploadStatus.error]: 'icon-icon_file-xmind_colorful_ash'
  },
  zip: {
    [UploadStatus.init]: 'icon-a-icon_file-compressed_colorful_ash2',
    [UploadStatus.done]: 'icon-a-icon_file-compressed_colorful2',
    [UploadStatus.uploading]: 'icon-a-icon_file-compressed_colorful_ash2',
    [UploadStatus.error]: 'icon-a-icon_file-compressed_colorful_ash2'
  },
  sketch: {
    [UploadStatus.init]: 'icon-icon_file-sketch_colorful_ash',
    [UploadStatus.done]: 'icon-icon_file-sketch_colorful1',
    [UploadStatus.uploading]: 'icon-icon_file-sketch_colorful_ash',
    [UploadStatus.error]: 'icon-icon_file-sketch_colorful_ash'
  },
  ppt: {
    [UploadStatus.init]: 'icon-icon_file-ppt_colorful_ash',
    [UploadStatus.done]: 'icon-icon_file-ppt_colorful1',
    [UploadStatus.uploading]: 'icon-icon_file-ppt_colorful_ash',
    [UploadStatus.error]: 'icon-icon_file-ppt_colorful_ash'
  },
  json: {
    [UploadStatus.init]: 'icon-a-icon_file-json',
    [UploadStatus.done]: 'icon-a-icon_file-json',
    [UploadStatus.uploading]: 'icon-a-icon_file-json',
    [UploadStatus.error]: 'icon-a-icon_file-json'
  },
  jmx: {
    [UploadStatus.init]: 'icon-a-icon_file-JMX',
    [UploadStatus.done]: 'icon-a-icon_file-JMX',
    [UploadStatus.uploading]: 'icon-a-icon_file-JMX',
    [UploadStatus.error]: 'icon-a-icon_file-JMX'
  },
  har: {
    [UploadStatus.init]: 'icon-icon_file_har',
    [UploadStatus.done]: 'icon-icon_file_har',
    [UploadStatus.uploading]: 'icon-icon_file_har',
    [UploadStatus.error]: 'icon-icon_file_har'
  },
  ms: {
    [UploadStatus.init]: 'icon-icon_file_ms',
    [UploadStatus.done]: 'icon-icon_file_ms',
    [UploadStatus.uploading]: 'icon-icon_file_ms',
    [UploadStatus.error]: 'icon-icon_file_ms'
  },
  unknown: {
    [UploadStatus.init]: 'icon-icon_file-unknow_colorful1',
    [UploadStatus.done]: 'icon-icon_file-unknow_colorful1',
    [UploadStatus.uploading]: 'icon-icon_file-unknow_colorful1',
    [UploadStatus.error]: 'icon-icon_file-unknow_colorful1'
  },
  none: {
    [UploadStatus.init]: 'icon-icon_file-unknow_colorful1',
    [UploadStatus.done]: 'icon-icon_file-unknow_colorful1',
    [UploadStatus.uploading]: 'icon-icon_file-unknow_colorful1',
    [UploadStatus.error]: 'icon-icon_file-unknow_colorful1'
  }
}

/**
 * 获取文件类型枚举
 * @param {string} fileType 文件类型
 * @returns {string} 文件类型枚举键
 */
export function getFileEnum(fileType) {
  if (fileType) {
    const keys = Object.keys(UploadAcceptEnum)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (UploadAcceptEnum[key].includes(fileType)) {
        return key
      }
    }
  }
  return 'unknown'
}

/**
 * 获取文件图标类名
 * @param {Object} item 文件项
 * @param {string} status 文件状态
 * @returns {string} 图标类名
 */
export function getFileIcon(item, status) {
  const fileType = item.file?.name?.split('.').pop() // 通过文件后缀判断文件类型
  const _status = status || item.status || UploadStatus.init
  const fileEnum = getFileEnum(`.${fileType}`)

  return FileIconMap[fileEnum]?.[_status] || FileIconMap.unknown[UploadStatus.init]
}

/**
 * 获取成功状态的文件图标
 * @param {Object} item 文件项
 * @returns {string} 图标类名
 */
export function getSuccessFileIcon(item) {
  return getFileIcon(item, UploadStatus.done)
}
