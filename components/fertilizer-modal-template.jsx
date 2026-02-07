import { useState } from "react";

export default function FertilizerModalTemplate({ specie }) {
  

  const [open, setOpen] = useState(false);
  const [fertilizerData, setFertilizerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleGenerateFertilizer = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/generate-fertilizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ species: specie }),
      })
      const data = await res.json()
      setFertilizerData(data)
      setOpen(true)
      setLoading(false)
    } catch (error) {
      console.error('Error:', error)
      setLoading(false)
    }
  }

  if(!open) {
    return (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Adubo</p>
                <button disabled={loading} onClick={handleGenerateFertilizer} className="text-lg font-semibold text-primary hover:text-primary/80 transition-colors">
                   {loading ? 'Criando adubo...' : 'Criar adubo'}
                </button>
              </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-green-600 uppercase tracking-wide">
            Fertilizer Recommendation
          </h2>
          <h1 className="text-2xl font-bold text-gray-800">
            🌻 {fertilizerData?.species}
          </h1>
        </div>

        {/* Nutrients */}
        <div className="space-y-4">
          {fertilizerData?.recommendations && fertilizerData.recommendations.map((item) => (
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
                {fertilizerData?.frequency}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-green-700">
                Melhor Estação
              </p>
              <p className="text-sm text-gray-700">
                {fertilizerData?.bestSeason}
              </p>
            </div>
          </div>

          {/* Rodapé */}
        <div className="mt-6 flex justify-end">
          <button onClick={() => setOpen(false)} className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700">
            Fechar 🌱
          </button>
        </div>
      </div>
    </div>
  );
}
