import { useEffect, useState } from "react";
import "../styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setTripList } from "../redux/state";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";
import { baseUrl } from "../Urls";

const TripList = () => {
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user?._id);
  const tripList = useSelector((state) => state.user?.tripList || []);
  const dispatch = useDispatch();

  const getTripList = async () => {
    if (!userId) {
      console.error("User ID is missing, skipping API call.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/users/${userId}/trips`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      dispatch(setTripList(data || [])); // Ensure it's always an array
    } catch (err) {
      console.error("Fetch Trip List failed!", err.message);
      dispatch(setTripList([])); // Set an empty list on failure
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTripList();
  }, [userId]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">Your Trip List</h1>
      <div className="list">
        {tripList.length > 1 ? (
          tripList.map(({ listingId, hostId, startDate, endDate, totalPrice, booking = true }, index) => (
            <ListingCard
              key={listingId?._id || index} // Ensure a valid key
              listingId={listingId?._id || "N/A"}
              creator={hostId?._id || "N/A"}
              listingPhotoPaths={listingId?.listingPhotoPaths || []}
              city={listingId?.city || "Unknown"}
              province={listingId?.province || "Unknown"}
              country={listingId?.country || "Unknown"}
              category={listingId?.category || "Unknown"}
              startDate={startDate || "N/A"}
              endDate={endDate || "N/A"}
              totalPrice={totalPrice || 0}
              booking={booking}
            />
          ))
        ) : (
          <p>No trips found.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default TripList;
