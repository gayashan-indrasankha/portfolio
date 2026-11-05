import { lazy, Suspense } from 'react'

import type { Step } from '../data/projects'
import { hasWebGL } from '../lib/webgl'
import Pipeline from './Pipeline'

// Three.js is loaded on demand; the flat diagram shows meanwhile and wherever WebGL is missing
const Scene3D = lazy(() => import('./Scene3D'))

interface Props {
  steps: Step[]
  active: number
  onSelect?: (index: number) => void
}

/** A project's working model: the 3D scene where WebGL is available, the SVG diagram otherwise. */
export default function Model({ steps, active, onSelect }: Props) {
  const flat = <Pipeline steps={steps} active={active} onSelect={onSelect} />
  if (!hasWebGL) return flat
  return (
    <Suspense fallback={flat}>
      <Scene3D steps={steps} active={active} onSelect={onSelect} />
    </Suspense>
  )
}
