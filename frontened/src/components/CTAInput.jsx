export default function CTAInput() {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
      <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded shadow hover:bg-gray-100">
        Start Free Trial →
      </button>
      <input
        type="email"
        placeholder="Enter your email"
        className="px-4 py-3 rounded shadow text-gray-800 focus:outline-none w-72"
      />
    </div>
  );
}