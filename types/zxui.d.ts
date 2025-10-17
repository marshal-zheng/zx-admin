declare module 'zxui' {
  // Minimal typings for runtime-resolved local UI library
  export function useDialog<T = any>(options?: any): {
    state: any
    dialogProps: any
    dialogEvents: any
    open: (...args: any[]) => any
    close: () => void
    setLoading: (loading: boolean) => void
  }

  export function confirmInputDanger(options: any): Promise<any>

  // Optional component types placeholders
  export const ZxDialog: any
}