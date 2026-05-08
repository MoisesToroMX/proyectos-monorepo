import { configureStore } from '@reduxjs/toolkit'

import authReducer from '@/store/slices/authSlice'
import projectsReducer from '@/store/slices/projectsSlice'
import tasksReducer from '@/store/slices/tasksSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
    tasks: tasksReducer,
  },
  devTools: true,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
