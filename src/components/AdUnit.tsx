interface AdUnitProps {
  className?: string
  slot?: string
  format?: string
  layoutKey?: string
  label?: boolean
}

const AdUnit = (_props: AdUnitProps) => {
  // Completely disabled / hidden sponsored ad unit
  return null
}

export default AdUnit
