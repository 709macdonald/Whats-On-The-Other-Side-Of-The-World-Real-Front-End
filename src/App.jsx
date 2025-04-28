import { useState, useEffect, useRef } from "react";
import Header from "./components/Header/Header";
import SearchWrapper from "./components/SearchBar/SearchWrapper";
import LeafletMapComponent from "./components/Map/LeafletMapComponent";
import Footer from "./components/Footer/Footer";
import {
  findNearestMcDonalds,
  loadMcDonaldsData,
} from "./services/McDonaldsService";

function App() {
  const [searchLocation, setSearchLocation] = useState(null);
  const [showSearch, setShowSearch] = useState(true);
  const [viewTarget, setViewTarget] = useState(null);
  const [mcDonaldsData, setMcDonaldsData] = useState([]);
  const [nearestMcDonalds, setNearestMcDonalds] = useState(null);
  const [locationDetails, setLocationDetails] = useState({
    original: null,
    antipode: null,
    originalCountry: "",
    antipodeCountry: "",
  });
  const [searchCount, setSearchCount] = useState(() => {
    const stored = localStorage.getItem("searchCount");
    return stored ? parseInt(stored, 10) : 3; // ⬅️ Start at 3 searches
  });

  const [isLocked, setIsLocked] = useState(() => {
    const stored = localStorage.getItem("isLocked");
    return stored === "true" ? true : false;
  });

  const hasFoundNearestRef = useRef(false);

  useEffect(() => {
    if (window.location.pathname === "/payment-success") {
      const params = new URLSearchParams(window.location.search);
      const amount = parseInt(params.get("amount"), 10) || 5;
      setSearchCount((prev) => prev + amount);
      setIsLocked(false);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const data = await loadMcDonaldsData();
      console.log("Loaded McDonald's data:", data.length, "locations");
      setMcDonaldsData(data);
    };

    loadData();
  }, []);

  useEffect(() => {
    localStorage.setItem("searchCount", searchCount.toString());
    localStorage.setItem("isLocked", isLocked.toString());
  }, [searchCount, isLocked]);

  useEffect(() => {
    if (
      locationDetails.antipode &&
      mcDonaldsData.length > 0 &&
      !hasFoundNearestRef.current
    ) {
      hasFoundNearestRef.current = true;

      const nearest = findNearestMcDonalds(
        locationDetails.antipode.lat,
        locationDetails.antipode.lng,
        mcDonaldsData
      );

      if (nearest) {
        setNearestMcDonalds(nearest);
      }
    }
  }, [locationDetails.antipode, mcDonaldsData]);

  const handlePurchase = (searchesPurchased) => {
    if (searchesPurchased === 5) {
      window.location.href = "https://buy.stripe.com/test_7sI3fbeh45DyesMfYY";
    } else if (searchesPurchased === 15) {
      window.location.href = "https://buy.stripe.com/test_3cs02Z0qed6070kbIJ";
    }
  };

  const handlePlaceSelected = (location) => {
    if (isLocked || searchCount <= 0) {
      alert(
        "You've reached your free search limit. Please purchase more searches to continue!"
      );
      return;
    }

    setSearchLocation(location);
    setShowSearch(false);
    setViewTarget("antipode");
    hasFoundNearestRef.current = false;
  };

  const handleViewOriginal = () => {
    setViewTarget("original");
  };

  const handleViewAntipode = () => {
    setViewTarget("antipode");
  };

  const handleViewMcDonalds = () => {
    if (nearestMcDonalds) {
      setViewTarget("mcdonalds");
    }
  };

  const handleLocationDetails = (details) => {
    setLocationDetails(details);
  };

  const handleReset = () => {
    if (isLocked) {
      alert(
        "You've reached your free search limit. Please purchase more searches to continue!"
      );
      return;
    }

    setSearchCount((prev) => {
      const newCount = prev - 1; // ⬅️ Subtract 1 search
      if (newCount <= 0) {
        setIsLocked(true);
      }
      return newCount;
    });

    setSearchLocation(null);
    setShowSearch(true);
    setViewTarget(null);
    setNearestMcDonalds(null);
    hasFoundNearestRef.current = false;
    setLocationDetails({
      original: null,
      antipode: null,
      originalCountry: "",
      antipodeCountry: "",
    });
  };

  return (
    <>
      <Header />
      <div className="mainScreen">
        {searchCount > 0 ? (
          <SearchWrapper onPlaceSelected={handlePlaceSelected} />
        ) : (
          <div className="purchase-buttons">
            <h2 className="out-of-searches-msg">You're out of searches!</h2>
            <p>Please purchase more to continue exploring.</p>
            <button
              className="btn btn-purple"
              onClick={() => handlePurchase(5)}
            >
              Purchase 5 Searches ($0.99)
            </button>
            <button
              className="btn btn-orange"
              onClick={() => handlePurchase(15)}
            >
              Purchase 15 Searches ($2.49)
            </button>
          </div>
        )}

        <LeafletMapComponent
          center={searchLocation}
          viewTarget={viewTarget}
          onLocationDetails={handleLocationDetails}
          nearestMcDonalds={nearestMcDonalds}
        />
      </div>
      <Footer
        onReset={handleReset}
        onViewOriginal={handleViewOriginal}
        onViewAntipode={handleViewAntipode}
        onViewMcDonalds={handleViewMcDonalds}
        searchPerformed={!showSearch && searchLocation !== null}
        originalLocation={locationDetails.original}
        antipodeLocation={locationDetails.antipode}
        nearestCountryToOriginal={locationDetails.originalCountry}
        nearestCountryToAntipode={locationDetails.antipodeCountry}
        nearestMcDonalds={nearestMcDonalds}
        viewTarget={viewTarget}
        searchCount={searchCount}
      />
    </>
  );
}

export default App;
