import CarArt from './CarArt'

// Small rounded tile used in list rows.
export default function VehicleThumb({ vehicle }) {
  return (
    <div className="grid h-10 w-16 shrink-0 place-items-center rounded-[10px] bg-surface-2 px-1">
      <CarArt body={vehicle.body} color={vehicle.color.hex} className="w-full" />
    </div>
  )
}
