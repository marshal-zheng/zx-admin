import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import TagsInput from '../src/tags-input.vue'

const AXIOM = 'Test Tag'

describe('ZxTagsInput', () => {
  it('renders correctly', () => {
    const wrapper = mount(TagsInput, {
      props: {
        modelValue: ['Tag1', 'Tag2'],
      },
    })
    expect(wrapper.find('.zx-tags-input').exists()).toBe(true)
  })

  it('renders tags', () => {
    const wrapper = mount(TagsInput, {
      props: {
        modelValue: ['Tag1', 'Tag2'],
      },
    })
    const tags = wrapper.findAll('.el-tag')
    expect(tags).toHaveLength(2)
    expect(tags[0].text()).toBe('Tag1')
    expect(tags[1].text()).toBe('Tag2')
  })

  it('emits update:modelValue when tag is added', async () => {
    const wrapper = mount(TagsInput, {
      props: {
        modelValue: [],
      },
    })

    const input = wrapper.find('input')
    await input.setValue(AXIOM)
    await input.trigger('keydown.enter')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[AXIOM]])
  })

  it('emits remove event when tag is removed', async () => {
    const wrapper = mount(TagsInput, {
      props: {
        modelValue: [AXIOM],
      },
    })

    const closeBtn = wrapper.find('.el-tag__close')
    await closeBtn.trigger('click')
    await nextTick()

    expect(wrapper.emitted('remove')).toBeTruthy()
    expect(wrapper.emitted('remove')?.[0]).toEqual([AXIOM, 0])
  })

  it('beforeAdd hook can cancel add', async () => {
    const beforeAdd = vi.fn().mockReturnValue(false)
    const wrapper = mount(TagsInput, {
      props: {
        modelValue: [],
        beforeAdd,
      },
    })

    const input = wrapper.find('input')
    await input.setValue(AXIOM)
    await input.trigger('keydown.enter')
    await nextTick()

    expect(beforeAdd).toHaveBeenCalledWith(AXIOM, [])
    expect(wrapper.emitted('add')).toBeFalsy()
    expect(wrapper.emitted('add-cancel')).toBeTruthy()
  })

  it('beforeRemove hook supports async guard', async () => {
    let resolver: (value: boolean) => void = () => { }
    const beforeRemove = vi.fn().mockImplementation(
      () =>
        new Promise<boolean>((resolve) => {
          resolver = resolve
        })
    )
    const wrapper = mount(TagsInput, {
      props: {
        modelValue: [AXIOM],
        beforeRemove,
      },
    })

    const closeBtn = wrapper.find('.el-tag__close')
    await closeBtn.trigger('click')

    // still present before guard resolves
    expect(wrapper.findAll('.el-tag')).toHaveLength(1)

    resolver(true)
    await nextTick()
    await nextTick()

    expect(wrapper.emitted('remove')).toBeTruthy()
    expect(wrapper.emitted('remove')?.[0]).toEqual([AXIOM, 0])
  })

  it('beforeRemove hook can cancel remove', async () => {
    let resolver: (value: boolean) => void = () => { }
    const beforeRemove = vi.fn().mockImplementation(
      () =>
        new Promise<boolean>((resolve) => {
          resolver = resolve
        })
    )
    const wrapper = mount(TagsInput, {
      props: {
        modelValue: [AXIOM],
        beforeRemove,
      },
    })

    const closeBtn = wrapper.find('.el-tag__close')
    await closeBtn.trigger('click')

    resolver(false)
    await nextTick()
    await nextTick()

    expect(wrapper.findAll('.el-tag')).toHaveLength(1)
    expect(wrapper.emitted('remove')).toBeFalsy()
    expect(wrapper.emitted('remove-cancel')).toBeTruthy()
  })

  it('respects maxCount prop', async () => {
    const wrapper = mount(TagsInput, {
      props: {
        modelValue: ['Tag1', 'Tag2'],
        maxCount: 2,
      },
    })

    const input = wrapper.find('input')
    await input.setValue('Tag3')
    await input.trigger('keydown.enter')
    await nextTick()

    const errorMsg = wrapper.find('.zx-tags-input__error')
    expect(errorMsg.exists()).toBe(true)
  })

  it('disabled state works', () => {
    const wrapper = mount(TagsInput, {
      props: {
        modelValue: ['Tag1'],
        disabled: true,
      },
    })

    expect(wrapper.classes()).toContain('is-disabled')
    const tag = wrapper.find('.el-tag')
    expect(tag.attributes('closable')).toBeUndefined()
  })

  it('readonly state works', () => {
    const wrapper = mount(TagsInput, {
      props: {
        modelValue: ['Tag1'],
        readonly: true,
      },
    })

    expect(wrapper.classes()).toContain('is-readonly')
    const input = wrapper.find('input')
    expect(input.exists()).toBe(false)
  })

  it('different sizes work', () => {
    const sizes = ['large', 'default', 'small'] as const
    sizes.forEach((size) => {
      const wrapper = mount(TagsInput, {
        props: {
          modelValue: ['Tag1'],
          size,
        },
      })
      const tag = wrapper.find('.el-tag')
      expect(tag.classes()).toContain(`el-tag--${size}`)
    })
  })

  it('custom tag slot works', () => {
    const wrapper = mount(TagsInput, {
      props: {
        modelValue: ['Tag1'],
      },
      slots: {
        tag: ({ tag }: { tag: string }) => `Custom: ${tag}`,
      },
    })

    const tagElement = wrapper.find('.el-tag')
    expect(tagElement.text()).toContain('Custom: Tag1')
  })

  it('prevents duplicate tags when allowDuplicates is false', async () => {
    const wrapper = mount(TagsInput, {
      props: {
        modelValue: ['Tag1'],
        allowDuplicates: false,
      },
    })

    const input = wrapper.find('input')
    await input.setValue('Tag1')
    await input.trigger('keydown.enter')
    await nextTick()

    const tags = wrapper.findAll('.el-tag')
    expect(tags).toHaveLength(1)
  })
})
