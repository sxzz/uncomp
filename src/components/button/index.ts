import { computed } from 'vue'
import { getInstance } from '../../utils'

export const useButtonProps = {
  loading: Boolean,
  autoInsertSpace: {
    type: Boolean,
    default: undefined,
  },
}
export const useButtonEmits = {}
export const useButton = () => {
  const { vm, props, emit, slots } = getInstance<
    typeof useButtonProps,
    typeof useButtonEmits
  >()

  /** add space between two characters in Chinese */
  const insertSpace = computed(() => {
    const defaultSlot = slots.default?.()
    if (props.autoInsertSpace && defaultSlot?.length === 1) {
      const slot = defaultSlot[0]
      if (slot?.type === Text) {
        const text = slot.children as string
        return /^\p{Unified_Ideograph}{2}$/u.test(text.trim())
      }
    }
    return false
  })

  return {
    insertSpace,
  }
}
