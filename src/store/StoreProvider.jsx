import { useEffect, useReducer } from 'react'
import { StoreContext } from './context'
import { loadState, reducer, saveState } from './reducer'

// In-browser store until the backend API exists.
export default function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)
  useEffect(() => {
    saveState(state)
  }, [state])
  return <StoreContext.Provider value={{ ...state, dispatch }}>{children}</StoreContext.Provider>
}
