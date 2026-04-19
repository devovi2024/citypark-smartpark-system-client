import ParkingFilter from "../../components/parkings/ParkingFilter";
import ParkingList from "../../components/parkings/ParkingList";

export default function Parkings() {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <ParkingFilter />
      <ParkingList />
    </div>
  );
}