<script lang="tsx">
import { computed, defineComponent, useAttrs, type CSSProperties } from 'vue'

interface FlexViewProps {
  /** flex-direction: column */
  column?: boolean
  /** align content vertically */
  vAlignContent?: 'top' | 'center' | 'bottom'
  /** align content horizontally */
  hAlignContent?: 'left' | 'center' | 'right'
  /** margin-left property ("auto" to align self right) */
  marginLeft?: string | number
  /** margin-top property ("auto" to align self bottom) */
  marginTop?: string | number
  /** margin-right property ("auto" to align self left) */
  marginRight?: string | number
  /** margin-bottom property ("auto" to align self top) */
  marginBottom?: string | number
  /** grow property (for parent primary axis) */
  grow?: boolean | number
  /** flex-shrink property */
  shrink?: boolean | number
  /** flex-basis property */
  basis?: string | number
  /** wrap content */
  wrap?: boolean
  /** height property (for parent secondary axis) */
  height?: string | number
  /** width property (for parent secondary axis) */
  width?: string | number
  /** class to pass to top level element of the component */
  className?: string
}

export default defineComponent({
  name: 'FlexView',
  props: {
    column: {
      type: Boolean,
      default: false
    },
    vAlignContent: {
      type: String as () => 'top' | 'center' | 'bottom' | undefined
    },
    hAlignContent: {
      type: String as () => 'left' | 'center' | 'right' | undefined
    },
    marginLeft: {
      type: [String, Number]
    },
    marginTop: {
      type: [String, Number]
    },
    marginRight: {
      type: [String, Number]
    },
    marginBottom: {
      type: [String, Number]
    },
    grow: {
      type: [Boolean, Number]
    },
    shrink: {
      type: [Boolean, Number]
    },
    basis: {
      type: [String, Number]
    },
    wrap: {
      type: Boolean,
      default: false
    },
    height: {
      type: [String, Number]
    },
    width: {
      type: [String, Number]
    },
    className: {
      type: String
    }
  },
  setup(props, { slots }) {
    const attrs = useAttrs()

    const getGrow = (): number => {
      const { grow } = props
      if (typeof grow === 'number') {
        return grow
      }
      if (grow) {
        return 1
      }
      return 0 // default
    }

    const getShrink = (): number => {
      const { shrink, basis } = props
      if (typeof shrink === 'number') {
        return shrink
      }
      if (shrink) {
        return 1
      }
      if (shrink === false) {
        return 0
      }
      if (basis && basis !== 'auto') {
        return 0
      }
      return 1 // default
    }

    const getBasis = (): string => {
      const { basis } = props
      if (basis) {
        const suffix =
          typeof basis === 'number' || String(parseInt(basis as string, 10)) === basis ? 'px' : ''
        return basis + suffix
      }
      return 'auto' // default
    }

    const alignPropToFlex = (align?: string): string => {
      switch (align) {
        case 'top':
        case 'left':
          return 'flex-start'
        case 'center':
          return 'center'
        case 'bottom':
        case 'right':
          return 'flex-end'
        default:
          return ''
      }
    }

    const flexStyle = computed((): CSSProperties => {
      const {
        column,
        wrap,
        vAlignContent,
        hAlignContent,
        width,
        height,
        marginLeft,
        marginTop,
        marginRight,
        marginBottom
      } = props

      const style = {
        width,
        height,
        marginLeft,
        marginTop,
        marginRight,
        marginBottom
      }

      return {
        boxSizing: 'border-box',
        // some browsers don't set these by default on flex
        minWidth: 0,
        minHeight: 0,
        // flex properties
        display: 'flex',
        flexDirection: column ? 'column' : 'row',
        flexWrap: wrap ? 'wrap' : 'nowrap',
        flex: `${getGrow()} ${getShrink()} ${getBasis()}`,
        justifyContent: alignPropToFlex(column ? vAlignContent : hAlignContent),
        alignItems: alignPropToFlex(column ? hAlignContent : vAlignContent),
        // style passed through props
        ...style
      }
    })

    // 过滤掉组件自己的 props，将剩余的属性传递给 div
    const getDivProps = computed(() => {
      const propsKeys = [
        'className',
        'style',
        'column',
        'grow',
        'shrink',
        'basis',
        'wrap',
        'vAlignContent',
        'hAlignContent',
        'width',
        'height',
        'marginBottom',
        'marginTop',
        'marginLeft',
        'marginRight'
      ]

      const divProps: Record<string, any> = {}
      Object.keys(attrs).forEach((key) => {
        if (!propsKeys.includes(key)) {
          divProps[key] = attrs[key]
        }
      })

      return divProps
    })

    return () => {
      const children = slots.default?.()

      return (
        <div class={props.className} style={flexStyle.value} {...getDivProps.value}>
          {children}
        </div>
      )
    }
  }
})
</script>
