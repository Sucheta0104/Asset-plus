import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

import FAQSection from '../components/FAQ';

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: 'Basic',
      description: 'Perfect for small teams getting started',
      monthlyPrice: 0,
      annualPrice: 0,
      features: ['Up to 500 assets', '5 team members', 'Basic reporting', 'Email support'],
    },
    {
      name: 'Pro',
      description: 'Best for growing IT teams',
      monthlyPrice: 49,
      annualPrice: 99,
      features: ['Up to 2,000 assets', '15 team members', 'Advanced reporting & analytics', 'Priority support'],
      popular: true,
    },
    {
      name: 'Enterprise',
      description: 'For large organizations with complex needs',
      monthlyPrice: 149,
      annualPrice: 349,
      features: ['Unlimited assets', 'Unlimited team members', 'Custom reporting & dashboards', '24/7 dedicated support'],
    },
  ];

  // const calculateSavings = (monthly, annual) => {
  //   const annualTotal = annual * 12;
  //   const monthlyTotal = monthly * 12;
  //   return Math.round(((monthlyTotal - annualTotal) / monthlyTotal) * 100);
  // };

  return (
    <div>
    <Header/>
    <section className="py-20 px-6 bg-gray-50 text-center">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-gray-600 mb-6">
          Choose the perfect plan for your team. All plans include our 3-month free trial.
        </p>

        <div className="flex justify-center items-center gap-4 mb-10">
          <span className={`text-gray-700 font-medium ${!isAnnual ? 'text-blue-600' : ''}`}>Monthly</span>

          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isAnnual}
                onChange={(e) => setIsAnnual(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 transition-all duration-300">
                <div className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full transition-transform duration-300 ${isAnnual ? 'translate-x-5' : ''}`}></div>
              </div>
            </label>

            <span className={`text-sm font-medium ${isAnnual ? 'text-blue-600' : 'text-gray-900'}`}>Annual</span>
            {isAnnual && (
              <span className="bg-green-100 text-green-800 text-sm font-semibold px-2.5 py-0.5 rounded-full">
                Save 20%
              </span>
            )}
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => {
            const currentPrice = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            const yearlyTotal = currentPrice * 12;

            return (
              <div
                key={plan.name}
                className={`bg-white rounded-2xl p-6 relative ${plan.popular ? 'shadow-lg border-2 border-blue-600' : 'shadow'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-sm px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}

                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-500 mb-4">{plan.description}</p>

                <div className="mb-4">
                  <p className="text-3xl font-extrabold text-gray-900 mb-1">
                    ${currentPrice}
                    <span className="text-base font-medium">/month</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    {isAnnual
                      ? `Billed annually ($${yearlyTotal}/year)`
                      : `Billed monthly ($${yearlyTotal}/year)`}
                  </p>
                  {!isAnnual && (
                    <p className="text-sm text-green-600 font-medium mt-1">
                      Save ${(plan.monthlyPrice - plan.annualPrice) * 12}/year with annual billing
                    </p>
                  )}
                </div>

                <ul className="text-left space-y-2 text-gray-700 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-green-500 mr-2 mt-0.5">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                  Choose Plan
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Need a custom solution?{' '}
            <span className="text-blue-600 font-medium cursor-pointer hover:underline">Contact our sales team</span>
          </p>
          <div className="flex justify-center gap-8 text-sm text-gray-500 flex-wrap">
            <span>✓ 30-day money-back guarantee</span>
            <span>✓ No setup fees</span>
            <span>✓ Cancel anytime</span>
          </div>
        </div>
      </div>

      <FAQSection /> 
      <section className= "py-20 px-6 bg-blue-700 text-center w-full">
      <div className="justify-center max-w-5xl mx-auto">
        <h2 className="text-4xl font-extrabold text-white mb-4">
          Ready to get started?
        </h2>
        <p className="text-2xl  text-white mb-4">Join thousands of IT teams who trust AssetPlus to manage their assets.</p>
        

      </div>

    </section>
    </section>
    <Footer/>
    </div>
    );
}
