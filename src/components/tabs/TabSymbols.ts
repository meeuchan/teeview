import type { InjectionKey, Ref } from 'vue'

export const ActiveTabKey: InjectionKey<Ref<string>> = Symbol('activeTabKey')
