import SlotCard from "./SlotCard";
import { useSlots } from "../../hooks/useSlots";

export default function SlotList({ parkingId }) {
  const { slots, loading, book, unbook } = useSlots(parkingId);

  if (loading) return <p>Loading slots...</p>;

  return (
    <div className="grid gap-3">
      {slots.map((slot) => (
        <SlotCard
          key={slot._id}
          slot={slot}
          onBook={book}
          onUnbook={unbook}
        />
      ))}
    </div>
  );
}