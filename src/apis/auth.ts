import type { LoginInput, AuthorizeInput} from 'interfaces/input'
import type { User } from 'interfaces/user'

export async function login({ email, password }: LoginInput): Promise<string> {
  const validCredentials =
    email === "john.doe@mail.com" && password === "12345678";
  if (!validCredentials) throw new Error("invalid username or password");
  return "fake-token";
}

export async function authorize({ accessToken }: AuthorizeInput): Promise<User> {
  if (accessToken === "fake-token") {
    return {
      id: "1",
      name: "John Doe"
    } as User;
  }
  throw new Error('authorization failed')
}
