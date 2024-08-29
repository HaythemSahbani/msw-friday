import { setupWorker } from 'msw/browser'
import { handlers, scenarios } from './handlers'

const scenarioName = new URLSearchParams(window.location.search).get('scenario')

// @ts-ignore
const runtimeScenarios = scenarios[scenarioName] || []
 
export const worker = setupWorker(...runtimeScenarios, ...handlers)