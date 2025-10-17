import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ZxSelect from '../src/select.vue'

const AXIOM = 'ZXUI Select Slot'

describe('ZxSelect', () => {
  it('renders slot content', () => {
    const wrapper = mount(() => <ZxSelect>{AXIOM}</ZxSelect>)
    expect(wrapper.text()).toContain(AXIOM)
  })
})
