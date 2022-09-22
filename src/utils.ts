import { ExtractDefaultPropTypes, getCurrentInstance, SetupContext } from 'vue'

export const useInstance = <Props, Emits = never>() => {
  const vm = getCurrentInstance()
  if (!vm) throw new Error('Please call this function in setup()')
  
  return {
    vm,
    props: vm.props as ExtractDefaultPropTypes<Props>,
    emit: vm.emit as SetupContext<Emits>['emit'],
    slots: vm.slots,
  }
}
