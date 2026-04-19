import useParking from "../../hooks/useParking";
import ParkingCard from "./ParkingCard";

const ParkingList = ({ limit }) => {
  const { parkings, loading } = useParking();

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  const data = limit ? parkings.slice(0, limit) : parkings;

  if (!data.length) {
    return <div className="text-center py-10">No parking found</div>;
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((p) => (
        <ParkingCard key={p._id} parking={p} />
      ))}
    </div>
  );
};

export default ParkingList;