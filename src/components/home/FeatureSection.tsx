export default function FeatureSection() {
  const features = [
    {
      name: 'Decentralized Review',
      description: 'Multiple reviewers ensure translation quality through a decentralized voting system.'
    },
    {
      name: 'Fair Rewards',
      description: 'Automatic reward distribution for both translators and reviewers upon task completion.'
    },
    {
      name: 'Multiple Languages',
      description: 'Support for various language pairs with specialized translators and reviewers.'
    },
    {
      name: 'Quality Assurance',
      description: 'Built-in review process ensures high-quality translations meet standards.'
    }
  ]

  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            Translation DAO
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need for quality translations
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
} 