const stats = [
  {
    number: "51+",
    title: "You lose 51+ hours a year",
    description: "Trying to stay on top of household paperwork",
    source: "U.S. Bureau of Labor Statistics, 2022"
  },
  {
    number: "$1,268",
    title: "You lose $1,268 a year",
    description: "In late fees, other extra charges, and costs to your credit",
    source: "Doxo Hidden Costs of Bill Pay, 2023"
  },
  {
    number: "84%",
    title: "84% of people are stressed",
    description: "Worrying about home organization and upkeep",
    source: "Huffington Post Survey, 2013"
  }
];

export default function Stats() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Families Spend Too Much Time, Money, and Mental Energy Managing Household Information
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl p-8 text-center hover-lift">
              <div 
                data-testid={`stat-${index + 1}`}
                className="text-4xl lg:text-5xl font-bold text-primary mb-4"
              >
                {stat.number}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{stat.title}</h3>
              <p className="text-gray-600 mb-4">{stat.description}</p>
              <p className="text-xs text-gray-500">{stat.source}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
