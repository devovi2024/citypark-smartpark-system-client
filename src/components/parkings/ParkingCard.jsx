import { Link } from "react-router-dom";

const ParkingCard = ({ parking }) => {
  const total = parking.totalSlots || 1;
  const available = parking.availableSlots || 0;

  const occupancyPercent = ((total - available) / total) * 100;

  return (

          <Link
          to={`/parkings/${parking._id}`}
          
        >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

      {/* ✅ IMAGE */}
      <img
        src={parking.image }
        alt="parking"
        className="w-full h-40 object-cover"
      />

      <div className="p-5">
        <h3 className="text-lg font-bold">{parking.name}</h3>

        <p className="text-sm text-gray-500">
          📍 {parking.location?.address || "No address"}
        </p>

        <p className="text-sm text-gray-500">
          🏙️ {parking.location?.city || "No city"}
        </p>

        <p className="text-green-600 font-semibold mt-2">
          $ {parking.pricePerHour}/hour
        </p>

        {/* ✅ BAR FIX */}
        <div className="mt-3">
          <div className="flex justify-between text-sm">
            <span>{available}/{total}</span>
          </div>

          <div className="bg-gray-200 h-2 rounded mt-1">
            <div
              className="bg-green-500 h-2 rounded"
              style={{ width: `${100 - occupancyPercent}%` }}
            />
          </div>
        </div>


      </div>
    </div>
        </Link>

  );
};

export default ParkingCard;