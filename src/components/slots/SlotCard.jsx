const SlotCard = ({ slot, onBook }) => {
  return (
    <div
      className={`border p-4 rounded-xl ${
        slot.isBooked ? "bg-red-50" : "bg-white"
      }`}
    >
      <h3 className="font-bold">
        Slot {slot.slotNumber}
      </h3>

      <p>
        Status:{" "}
        <span
          className={
            slot.isBooked ? "text-red-600" : "text-green-600"
          }
        >
          {slot.isBooked ? "Booked" : "Available"}
        </span>
      </p>

      <button
        disabled={slot.isBooked}
        onClick={() => onBook(slot)}
        className="mt-2 px-3 py-1 bg-emerald-600 text-white rounded disabled:bg-gray-400"
      >
        Book
      </button>
    </div>
  );
};

export default SlotCard;