import { Fragment } from 'react'

const SENSOR_PATTERN = /\b(BEG_?\d{3,4}|ROU_\d{4}|SIT-O2BAS)\b/g

/** Affiche un texte en passant les codes capteurs (BEG0346, SIT-O2BAS…) en police mono. */
export function SensorText({ text }: { text: string }) {
  // `split` avec groupe capturant : les index impairs sont les codes capteurs.
  return (
    <>
      {text.split(SENSOR_PATTERN).map((part, index) =>
        index % 2 === 1 ? (
          <span key={index} className="font-mono text-[0.95em]">
            {part}
          </span>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  )
}
