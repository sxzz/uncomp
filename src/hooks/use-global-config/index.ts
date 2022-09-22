import {
  computed,
  ComputedRef,
  getCurrentInstance,
  inject,
  InjectionKey,
  provide,
  ref,
  unref,
} from 'vue'
import { debugWarn, keysOf } from '../../utils'

import type { MaybeRef } from '@vueuse/core'
import type { App, Ref } from 'vue'

export const createGlobalConfig = <T extends Record<string, any>>(
  initial: T
) => {
  const globalConfig = ref({ ...initial }) as Ref<T>
  const configProviderContextKey: InjectionKey<ComputedRef<T>> = Symbol(
    'configProviderContextKey'
  )

  function useGlobalConfig<K extends keyof T, D extends T[K]>(
    key: K,
    defaultValue?: D
  ): Ref<Exclude<T[K], undefined> | D>
  function useGlobalConfig(): Ref<T>
  function useGlobalConfig(key?: keyof T, defaultValue = undefined) {
    const config = getCurrentInstance()
      ? inject(configProviderContextKey, globalConfig)
      : globalConfig
    if (key) {
      return computed(() => config.value?.[key] ?? defaultValue)
    } else {
      return config
    }
  }

  const provideGlobalConfig = (
    config: MaybeRef<T>,
    app?: App,
    global = false
  ) => {
    const inSetup = !!getCurrentInstance()
    const oldConfig = inSetup ? useGlobalConfig() : undefined

    const provideFn = app?.provide ?? (inSetup ? provide : undefined)
    if (!provideFn) {
      debugWarn(
        'provideGlobalConfig',
        'provideGlobalConfig() can only be used inside setup().'
      )
      return
    }

    const context = computed(() => {
      const cfg = unref(config)
      if (!oldConfig?.value) return cfg
      return mergeConfig(oldConfig.value, cfg)
    })
    provideFn(configProviderContextKey, context)

    if (global) globalConfig.value = context.value

    return context
  }

  const mergeConfig = (a: T, b: T): T => {
    const keys = [...new Set([...keysOf(a), ...keysOf(b)])]
    const obj = {} as T
    for (const key of keys) {
      obj[key] = b[key] ?? a[key]
    }
    return obj
  }
}
