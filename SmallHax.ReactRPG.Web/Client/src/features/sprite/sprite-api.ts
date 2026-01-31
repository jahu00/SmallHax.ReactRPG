import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { SpriteSet } from '../../types/sprite-set';
export const spriteApi = createApi({
    reducerPath: "spriteApi",
    baseQuery: fetchBaseQuery({ baseUrl: '/content/'}),
    endpoints: (builder) => ({
        getBattleActorSpriteSet: builder.query<SpriteSet, string>({
            query: (name) => `battle-actors/${name}/${name}_actor.json`
        })
    })
});

export const { useGetBattleActorSpriteSetQuery } = spriteApi;