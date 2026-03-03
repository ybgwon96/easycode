import { useState, useCallback, useRef } from 'react'

export type StepName = 'welcome' | 'envCheck' | 'install' | 'done'

const STEPS: StepName[] = ['welcome', 'envCheck', 'install', 'done']

export const useWizard = (): {
  currentStep: StepName
  stepIndex: number
  totalSteps: number
  next: () => void
  prev: () => void
  canGoBack: boolean
  goTo: (step: StepName) => void
} => {
  const [currentStep, setCurrentStep] = useState<StepName>('welcome')
  const history = useRef<StepName[]>([])
  const stepIndex = STEPS.indexOf(currentStep)

  const navigateTo = useCallback((step: StepName) => {
    setCurrentStep((prev) => {
      history.current.push(prev)
      return step
    })
  }, [])

  const next = useCallback(() => {
    const idx = STEPS.indexOf(currentStep)
    if (idx < STEPS.length - 1) navigateTo(STEPS[idx + 1])
  }, [currentStep, navigateTo])

  const prev = useCallback(() => {
    const target = history.current.pop()
    if (target) setCurrentStep(target)
  }, [])

  const canGoBack = currentStep !== 'welcome' && currentStep !== 'done'

  return {
    currentStep,
    stepIndex,
    totalSteps: STEPS.length,
    next,
    prev,
    canGoBack,
    goTo: navigateTo
  }
}
