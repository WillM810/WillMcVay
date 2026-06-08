"use client";

import { localStorageProvider } from "@/utils/storage/localStorageProvider";
import { UserState } from "./UserReducer.types";

const KEY = "countdown_calendar_state_v1";

export const CountdownStorageProvider = {
    save(state: UserState) {
        localStorageProvider.save(KEY, state);
    },

    load() {
        return localStorageProvider.load<UserState>(KEY);
    },

    clear() {
        localStorageProvider.remove(KEY);
    }
};