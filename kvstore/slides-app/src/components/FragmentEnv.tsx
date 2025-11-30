import React from 'react'

export type FragmentEnv = {
  videoTime: number
  visibleCount: number
}

const defaultEnv: FragmentEnv = { videoTime: 0, visibleCount: 0 }

export const FragmentEnvContext = React.createContext<FragmentEnv>(defaultEnv)

export function useFragmentEnv(): FragmentEnv {
  return React.useContext(FragmentEnvContext)
}

export function FragmentEnvProvider(props: { value: FragmentEnv; children: React.ReactNode }): React.ReactElement {
  return <FragmentEnvContext.Provider value={props.value}>{props.children}</FragmentEnvContext.Provider>
}


