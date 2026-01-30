export default function FertilizerModalTemplate({ data }) {
  console.log('Rendering FertilizerModalTemplate with data:', data);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-green-600 uppercase tracking-wide">
            Fertilizer Recommendation
          </h2>
          <h1 className="text-2xl font-bold text-gray-800">
            🌻 {data.species}
          </h1>
        </div>

        {/* Nutrients */}
        <div className="space-y-4">
          {data.recommendations && data.recommendations.map((item) => (
            <div key={item.type}>
              <div className="flex justify-between text-sm font-medium text-gray-700">
                <span>{item.type}</span>
                <span>{item.percentage}</span>
              </div>

              <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-green-500"
                  style={{ width: `${item.percentage}` }}
                />
              </div>

              <p className="mt-1 text-xs text-gray-500">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Informações */}
          <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl bg-green-50 p-4">
            <div>
              <p className="text-xs font-semibold text-green-700">
                Frequência de Aplicação
              </p>
              <p className="text-sm text-gray-700">
                {data.frequency}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-green-700">
                Melhor Estação
              </p>
              <p className="text-sm text-gray-700">
                {data.bestSeason}
              </p>
            </div>
          </div>

          {/* Rodapé */}
        <div className="mt-6 flex justify-end">
          <button className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700">
            Fechar 🌱
          </button>
        </div>
      </div>
    </div>
  );
}
