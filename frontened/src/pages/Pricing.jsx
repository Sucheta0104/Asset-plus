export default function Pricing() {
  return (
    <section className="py-20 px-6 bg-gray-50 text-center">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-gray-600 mb-6">
          Choose the perfect plan for your team. All plans include our 3-month free trial.
        </p>

        <div className="flex justify-center items-center gap-4 mb-10">
          <span className="text-gray-700">Monthly</span>
          <div className="flex items-center gap-2">
            <div className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked readOnly />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:bg-blue-600" />
              <span className="ml-3 text-sm font-medium text-gray-900">Annual</span>
            </div>
            <span className="bg-green-100 text-green-800 text-sm font-semibold px-2.5 py-0.5 rounded-full">
              Save 20%
            </span>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Basic Plan */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Basic</h3>
            <p className="text-gray-500 mb-4">Perfect for small teams getting started</p>
            <p className="text-3xl font-extrabold text-gray-900 mb-1">$24<span className="text-base font-medium">/month</span></p>
            <p className="text-sm text-gray-500 mb-4">Billed annually ($288/year)</p>
            <ul className="text-left space-y-2 text-gray-700 mb-6">
              <li>✓ Up to 500 assets</li>
              <li>✓ 5 team members</li>
              <li>✓ Basic reporting</li>
              <li>✓ Email support</li>
            </ul>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Choose Plan</button>
          </div>

          {/* Pro Plan */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-600 p-6 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-sm px-3 py-1 rounded-full">Most Popular</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Pro</h3>
            <p className="text-gray-500 mb-4">Best for growing IT teams</p>
            <p className="text-3xl font-extrabold text-gray-900 mb-1">$65<span className="text-base font-medium">/month</span></p>
            <p className="text-sm text-gray-500 mb-4">Billed annually ($780/year)</p>
            <ul className="text-left space-y-2 text-gray-700 mb-6">
              <li>✓ Up to 2,000 assets</li>
              <li>✓ 15 team members</li>
              <li>✓ Advanced reporting & analytics</li>
              <li>✓ Priority support</li>
            </ul>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Choose Plan</button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Enterprise</h3>
            <p className="text-gray-500 mb-4">For large organizations with complex needs</p>
            <p className="text-3xl font-extrabold text-gray-900 mb-1">$165<span className="text-base font-medium">/month</span></p>
            <p className="text-sm text-gray-500 mb-4">Billed annually ($1980/year)</p>
            <ul className="text-left space-y-2 text-gray-700 mb-6">
              <li>✓ Unlimited assets</li>
              <li>✓ Unlimited team members</li>
              <li>✓ Custom reporting & dashboards</li>
              <li>✓ 24/7 dedicated support</li>
            </ul>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Choose Plan</button>
          </div>
        </div>
      </div>
    </section>
  );
}
