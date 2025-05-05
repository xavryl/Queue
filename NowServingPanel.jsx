// NowServingPanel.jsx
export default function NowServingPanel({ nowServing, queue }) {
    return (
      <div className="flex flex-row justify-between gap-10 bg-gray-100 p-6 rounded-lg shadow-md items-start w-full">
        {/* Left: Now Serving */}
        <div className="flex-1 flex flex-col items-center">
          {nowServing !== null ? (
            <h2 className="text-2xl font-bold mb-4">Now Serving: {nowServing}</h2>
          ) : (
            <h2 className="text-2xl font-semibold mb-4 text-gray-500">No one is being served</h2>
          )}
        </div>
  
        {/* Right: Queue List */}
        <div className="bg-white p-4 rounded shadow-md w-64 max-h-96 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-2 text-center">Queue List</h3>
          <ul className="text-left space-y-1">
            {queue.map((num) => (
              <li key={num} className="border-b py-1">{num}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  