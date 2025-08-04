import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import MapComponent from "../components/MapComponent";
import { useRouteStore } from "../store/routeStore";

const BookTicket = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [sourceCoords, setSourceCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const qrRef = useRef(null); // ✅ For QR download
  const { setRoute } = useRouteStore();

  const cityCoordinates = {
    Bangalore: { lat: 12.9716, lng: 77.5946 },
    Mysore: { lat: 12.2958, lng: 76.6394 },
    Hyderabad: { lat: 17.385, lng: 78.4867 },
    Chennai: { lat: 13.0827, lng: 80.2707 },
  };

  const handleConfirm = () => {
    if (source && destination && source !== destination) {
      const src = cityCoordinates[source];
      const dest = cityCoordinates[destination];
      setSourceCoords(src);
      setDestinationCoords(dest);
      setRoute(src, dest);
      setConfirmed(true);
    } else {
      alert("Please select valid and different source & destination.");
    }
  };

  const handleDownloadQR = () => {
    const canvas = qrRef.current.querySelector("canvas");
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `FareWaveTicket_${source}_to_${destination}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl shadow-2xl rounded-3xl p-10 border border-green-200">
        <h2 className="text-4xl font-bold text-center text-green-700 mb-10 tracking-tight">
          🚍 Book Your Ticket
        </h2>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <label className="block text-gray-600 font-semibold mb-2">
              Source
            </label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">-- Select Source --</option>
              {Object.keys(cityCoordinates).map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-600 font-semibold mb-2">
              Destination
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">-- Select Destination --</option>
              {Object.keys(cityCoordinates).map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleConfirm}
            className="bg-green-600 text-white px-8 py-3 rounded-xl text-lg font-medium hover:bg-green-700 transition-all duration-300"
          >
            Confirm Booking
          </button>
        </div>

        {confirmed && sourceCoords && destinationCoords && (
          <>
            <div className="mt-12">
              <MapComponent
                source={[sourceCoords.lat, sourceCoords.lng]}
                destination={destinationCoords}
              />
            </div>

            <div className="mt-10 text-center">
              <p className="text-green-600 text-xl font-semibold mb-4">
                🎫 Your Ticket QR Code
              </p>
              <div ref={qrRef} className="inline-block p-5 bg-white rounded-xl shadow-lg">
                <QRCodeCanvas
                  value={`FareWaveTicket|from=${source}|to=${destination}|time=${Date.now()}`}
                  size={200}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="H"
                  includeMargin={true}
                />
              </div>
              <button
                onClick={handleDownloadQR}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                ⬇️ Download QR Code
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookTicket;
