import {
  ShieldCheckIcon,
  ClockIcon,
  ChartBarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    title: 'Real-time Tracking',
    description: 'Monitor all your IT assets in real-time with automated discovery and updates.',
    icon: ShieldCheckIcon,
  },
  {
    title: 'License Alerts',
    description: 'Never miss a renewal with smart alerts for software licenses and warranties.',
    icon: ClockIcon,
  },
  {
    title: 'Audit Reports',
    description: 'Generate comprehensive audit reports with detailed asset tracking history.',
    icon: ChartBarIcon,
  },
  {
    title: 'Team Collaboration',
    description: 'Enable seamless collaboration across IT teams with role-based access.',
    icon: UserGroupIcon,
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-gray-100 py-16 px-6 h-125">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900">Everything you need to manage IT assets</h2>
        <p className="mt-4 text-gray-600 text-lg">
          Powerful features designed to simplify asset management and boost your team's productivity.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-blue-600/80 text-white rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.3)] p-6 text-left transform transition-transform duration-300 hover:scale-105 hover:shadow-[0_15px_35px_rgba(59,130,246,0.5)]"
          >
            <feature.icon className="h-10 w-10 mb-4" />
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
