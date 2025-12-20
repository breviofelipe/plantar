import { useState } from 'react';

interface PlantInfosProps {
    query: string;
}

export default function PlantInfos({ query }: PlantInfosProps) {
    const [response, setResponse] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const message = `Você é um especialista em botânica. Retorne APENAS um JSON válido, sem qualquer texto adicional ou explicações.

Forneça informações detalhadas sobre: ${query}

Formato JSON obrigatório (responda APENAS com este JSON):
{
  "nome_cientifico": "string",
  "luz": "string",
  "agua": "string",
  "solo": "string",
  "temperatura_ideal": "string",
  "dicas_cuidados": ["string"].
  "despertar_semente": "string"
}

Responda em português. Nenhum texto antes ou depois do JSON.`;
    const fetchPlantInfo = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const res = await fetch('/api/deepseek', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            if (!res.ok) {
                throw new Error('Failed to fetch plant information');
            }

            const data = await res.json();
            fetch('/api/plants/info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ specie: query, response: data.response }),
            }).then(() => { console.log('Plant info saved to database'); });
            setResponse(data.response);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <button
                onClick={fetchPlantInfo}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
                {loading ? 'Loading...' : `Obter informações sobre ${query}`}
            </button>

            {error && <p className="text-red-600 mt-2">{error}</p>}
            {response && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {(() => {
                        try {
                            const data = JSON.parse(response);
                            return (
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-bold text-green-700">{query} ({data.nome_cientifico})</h2>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white p-3 rounded border-l-4 border-blue-500">
                                            <h3 className="font-semibold text-blue-600">Luz</h3>
                                            <p className="text-sm text-gray-700 mt-1">{data.luz}</p>
                                        </div>
                                        
                                        <div className="bg-white p-3 rounded border-l-4 border-cyan-500">
                                            <h3 className="font-semibold text-cyan-600">Água</h3>
                                            <p className="text-sm text-gray-700 mt-1">{data.agua}</p>
                                        </div>
                                        
                                        <div className="bg-white p-3 rounded border-l-4 border-amber-500">
                                            <h3 className="font-semibold text-amber-600">Solo</h3>
                                            <p className="text-sm text-gray-700 mt-1">{data.solo}</p>
                                        </div>
                                        
                                        <div className="bg-white p-3 rounded border-l-4 border-red-500">
                                            <h3 className="font-semibold text-red-600">Temperatura Ideal</h3>
                                            <p className="text-sm text-gray-700 mt-1">{data.temperatura_ideal}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white p-3 rounded border-l-4 border-purple-500">
                                        <h3 className="font-semibold text-purple-600">Despertar da Semente</h3>
                                        <p className="text-sm text-gray-700 mt-1">{data.despertar_semente}</p>
                                    </div>
                                    <div className="bg-white p-3 rounded border-l-4 border-green-500">
                                        <h3 className="font-semibold text-green-600">Dicas de Cuidados</h3>
                                        <ul className="text-sm text-gray-700 mt-2 list-disc list-inside space-y-1">
                                            {Array.isArray(data.dicas_cuidados) && data.dicas_cuidados.map((dica: string, idx: number) => (
                                                <li key={idx}>{dica}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            );
                        } catch {
                            return <p className="text-gray-600">{response}</p>;
                        }
                    })()}
                </div>
            )}
        </div>
    );
}