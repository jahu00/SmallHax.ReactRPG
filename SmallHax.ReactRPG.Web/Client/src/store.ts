import { configureStore } from '@reduxjs/toolkit'
import battleReducer from './features/battle/battle-slice'
import { spriteApi } from './features/sprite/sprite-api'

export const store = configureStore({
  reducer: {
    battle: battleReducer,
    [spriteApi.reducerPath]: spriteApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(spriteApi.middleware)
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch