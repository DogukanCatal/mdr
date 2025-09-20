export default function Stat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="p-3 rounded-xl border">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-base font-semibold">
        {value.toLocaleString("tr-TR", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })}
      </div>
    </div>
  );
}
