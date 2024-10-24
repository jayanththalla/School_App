import Link from 'next/link';

const examNames = {
  fa1: 'Formative Assessment - 1',
  fa2: 'Formative Assessment - 2',
  sa1: 'Summative Assessment - 1',
  fa3: 'Formative Assessment - 3',
  fa4: 'Formative Assessment - 4',
  sa2: 'Summative Assessment - 2',
};

const ResultsDashboard = () => {
  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen font-poppins">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-900 mb-4 md:mb-6">
        Student Results Dashboard
      </h1>

      {/* Displaying buttons or links for each exam */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.keys(examNames).map((exam) => (
          <Link key={exam} href={`/results/${exam}`} className="text-lg font-medium text-gray-700 bg-white px-4 py-3 border border-gray-300 rounded-lg shadow-sm hover:bg-blue-50 transition">
            {examNames[exam]}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ResultsDashboard;
