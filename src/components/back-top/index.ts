import { useEventListener, useThrottleFn } from '@vueuse/core'
import { onMounted, ref, shallowRef } from 'vue'
import { useInstance } from '../../hooks'

export const backTopProps = {
  visibilityHeight: {
    type: Number,
    default: 200,
  },
  target: {
    type: String,
    default: '',
  },
}

export const backTopEmits = {
  click: (evt: MouseEvent) => evt instanceof MouseEvent,
}

const COMPONENT_NAME = 'UncompBackTop'
export const useBackTop = () => {
  const { props, emit } = useInstance<
    typeof backTopProps,
    typeof backTopEmits
  >()

  const el = shallowRef<HTMLElement>()
  const container = shallowRef<Document | HTMLElement>()
  const visible = ref(false)

  const scrollToTop = () => {
    if (!el.value) return
    el.value.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const handleScroll = () => {
    if (el.value) visible.value = el.value.scrollTop >= props.visibilityHeight
  }

  const handleClick = (event: MouseEvent) => {
    scrollToTop()
    emit('click', event)
  }

  useEventListener(container, 'scroll', useThrottleFn(handleScroll, 300))
  onMounted(() => {
    container.value = document
    el.value = document.documentElement

    if (props.target) {
      el.value = document.querySelector<HTMLElement>(props.target) ?? undefined
      if (!el.value) {
        throw new Error(
          COMPONENT_NAME + `target is not existed: ${props.target}`
        )
      }
      container.value = el.value
    }
  })

  return {
    visible,
    el,
    container,
    handleClick,
  }
}
