import { useEffect, useReducer } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import type { User } from 'interfaces/user'
import type { AuthorizeInput, LoginInput } from 'interfaces/input'
import * as AuthApi from 'apis/auth'

interface State {
  user: User|null
  error: string|null
  loading: boolean
}

type Action  =
  | { type: 'LOGIN' }
  | { type: 'LOGOUT' }
  | { type: 'AUTHORIZING' }
  | { type: 'AUTHORIZATION_FAILED', error: Error }
  | { type: 'AUTHORIZATION_SUCCEED', user: User }


const initialState = {
  user: null,
  error: null,
  loading: false
};

const authReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...initialState,
        loading: true
      };
    case "LOGOUT":
      return {
        ...initialState
      };
    case "AUTHORIZING":
      return {
        ...initialState,
        loading: true
      };
    case "AUTHORIZATION_FAILED": {
      return {
        ...state,
        user: null,
        error: action.error.message,
        loading: false
      };
    }
    case "AUTHORIZATION_SUCCEED": {
      return {
        ...state,
        user: action.user,
        error: null,
        loading: false
      };
    }
  }
  return state;
};


interface LocationState {
    from: string
}

function checkPrivateRoute(currentPath: string): boolean {
  return ['/profile'].some((path: string) => currentPath.startsWith(path))
}

function checkPrivateRestrictedRoute(currentPath: string) : boolean {
  return ['/login', '/register'].some((path:string) => currentPath.startsWith(path))
}

export function useProvideAuth() {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const history = useHistory()
  const location = useLocation<LocationState>()

  useEffect(() => {
    if (state.loading) return
    const isAuthorized = (state.user !== null)
    const isPrivateRestricted = checkPrivateRestrictedRoute(location.pathname)
    const isPrivate = checkPrivateRoute(location.pathname)

    // Authorized user cannot access private restricted pages like `/login` or `/register`.
    if (isAuthorized && isPrivateRestricted) {
      // Attempt to redirect to the known last location, else the default private page.
      const { from  } = location.state || { from: '/profile' }

      // Already there.
      if (from === location.pathname) return

      // If the last known location is a private restricted page, we don't want
      // to fall into an infinite redirection.
      history.push(checkPrivateRestrictedRoute(from) ? '/profile' : from)
    } 

    // Non-authorized user cannot access private pages.
    if (!isAuthorized && isPrivate){
      history.push('/login')
    }
  }, [state, location, history])

  const authorize = async ({ accessToken }: AuthorizeInput) => {
    dispatch({ type: 'AUTHORIZING' })
    try {
      const user: User = await AuthApi.authorize({ accessToken });
      dispatch({
        type: "AUTHORIZATION_SUCCEED",
        user
      });
    } catch (error) {
      window.localStorage.removeItem("accessToken");
      dispatch({ type: "AUTHORIZATION_FAILED", error: error.message });
    }
  } 

  const login = async ({ email, password }: LoginInput) => {
    dispatch({ type: "LOGIN" });
    try {
      const accessToken = await AuthApi.login({ email, password });
      window.localStorage.setItem("accessToken", accessToken);
      await authorize({ accessToken })
    } catch (error) {
      window.localStorage.removeItem("accessToken");
      dispatch({ type: "AUTHORIZATION_FAILED", error: error.message });
    }
  }

  const logout = async () => {
    dispatch({type: 'LOGOUT'})
    window.localStorage.removeItem("accessToken");
  }

  return {
    login,
    logout,
    authorize,
    ...state
  }
}
