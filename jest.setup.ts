import 'jest-preset-angular/setup-jest';
import { server } from './src/mocks/serve';

beforeAll(() => {
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})
