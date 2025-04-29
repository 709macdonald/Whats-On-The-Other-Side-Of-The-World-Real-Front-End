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
  const [isAppReady, setIsAppReady] = useState(false);

  const hasFoundNearestRef = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const amount = parseInt(params.get("amount"), 10);

    if (amount) {
      setSearchCount((prev) => prev + amount);
      setIsLocked(false);
      // optional nice touch: clean the URL after handling
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const data = await loadMcDonaldsData();
      console.log("Loaded McDonald's data:", data.length, "locations");
      setMcDonaldsData(data);

      // 🔥 Better warm-up
      try {
        const warmResults = await getSuggestions("Toronto");
        if (warmResults && warmResults.length > 0) {
          console.log("✅ Server warmed up with real results");
          setIsAppReady(true);
        } else {
          console.warn("⚠️ Empty warm-up response. Waiting 2 more seconds...");
          setTimeout(() => setIsAppReady(true), 2000); // fallback
        }
      } catch (error) {
        console.error("❌ Server warm-up failed:", error);
        // Still try to proceed after delay
        setTimeout(() => setIsAppReady(true), 3000);
      }
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
      window.location.href = "https://buy.stripe.com/aEUbLYcjHezAbra5kl";
    } else if (searchesPurchased === 15) {
      window.location.href = "https://buy.stripe.com/14k7vI6Zn2QS0Mw8ww";
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
        {showSearch && (
          <SearchWrapper
            onPlaceSelected={handlePlaceSelected}
            searchCount={searchCount}
            handlePurchase={handlePurchase}
            isAppReady={isAppReady}
          />
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
