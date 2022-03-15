import React from 'react'

export default function TouchableOpacity({ className, children, onClick, ...rest }) {
  const [touched, touchedSet] = React.useState(false)

  return (
    <button
      className={className}
      // style={{ opacity: touched ? 0.5 : 1, transition: 'opacity 300ms ease' }}
      onMouseDown={() => { touchedSet(true); onClick() }}
      onMouseUp={() => touchedSet(false)}
      {...rest}>
      {children}
    </button>
  )
}