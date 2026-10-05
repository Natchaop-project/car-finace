import { Card, Segmented, cx } from '../../components/ui'
import CarArt from '../../components/vehicle/CarArt'
import { BODY_TYPES, COLORS } from './options'

// Live preview of body type + color; this drives the illustration shown across the app.
export default function AppearancePicker({ body, color, onBody, onColor }) {
  return (
    <Card className="flex flex-col items-center gap-5">
      <div className="grid aspect-[16/9] w-full max-w-md place-items-center rounded-card bg-surface-2 px-8">
        <CarArt body={body} color={color.hex} className="w-full" />
      </div>
      <Segmented label="ประเภทตัวถัง" options={BODY_TYPES} value={body} onChange={onBody} />
      <div role="radiogroup" aria-label="สีรถ" className="flex flex-wrap justify-center gap-2.5">
        {COLORS.map((c) => {
          const on = c.hex === color.hex
          return (
            <button
              key={c.hex}
              type="button"
              role="radio"
              aria-checked={on}
              aria-label={c.name}
              title={c.name}
              onClick={() => onColor(c)}
              className={cx(
                'size-8 cursor-pointer rounded-full border border-black/10 transition',
                on ? 'ring-2 ring-accent ring-offset-2 ring-offset-surface' : 'hover:scale-110',
              )}
              style={{ background: c.hex }}
            />
          )
        })}
      </div>
      <p className="-mt-2 text-[13px] text-ink-2">สี{color.name}</p>
    </Card>
  )
}
