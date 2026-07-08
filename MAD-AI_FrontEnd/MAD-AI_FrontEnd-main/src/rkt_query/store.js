import { configureStore } from '@reduxjs/toolkit'
// Or from '@reduxjs/toolkit/query/react'
import { setupListeners } from '@reduxjs/toolkit/query'
import { routerMiddleware, connectRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import SelectedStuffReducer from './SelectedStuffReducer'
import SettingsReducer from './SettingsReducer';
import GlobalReducer from './GlobalReducer';
import SnackBarReducer from './SnackBarReducer';

import { aiDoctorApi } from './storeApis'
const history = createBrowserHistory();
const routeMiddleware = routerMiddleware(history);

export const store = configureStore({
  reducer: {
    SelectedStuffReducer,
    SettingsReducer,
    GlobalReducer,
    SnackBarReducer,
    router: connectRouter(history),
    [aiDoctorApi.reducerPath]: aiDoctorApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(aiDoctorApi.middleware).concat(routeMiddleware), //[routeMiddleware, thunk]
})

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)
export { history };