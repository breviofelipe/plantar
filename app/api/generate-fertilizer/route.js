import { NextResponse } from 'next/server';
import { sendMessageToDeepSeek } from '../../../lib/deepseek';

export async function POST(request) {
    try {
        const { species } = await request.json();
        console.log('Received request for fertilizer generation species:', species);

        if (!species) {
            return NextResponse.json(
                { error: 'Species is required' },
                { status: 400 }
            );
        }

        // Generate fertilizer recommendations based on species
        const message = `Gere recomendações de fertilizantes para a planta ${species} em formato JSON com os seguintes campos: species, recommendations (array com type, percentage e description), frequency e bestSeason. Responda apenas com o JSON válido.`;

        const fertilizerData = {
            species,
            recommendations: [
            {
                type: 'Nitrogen (N)',
                percentage: 20,
                description: 'Promotes leaf growth',
            },
            {
                type: 'Phosphorus (P)',
                percentage: 15,
                description: 'Strengthens roots and flowers',
            },
            {
                type: 'Potassium (K)',
                percentage: 15,
                description: 'Improves overall plant health',
            },
            ],
            frequency: 'Every 2-4 weeks',
            bestSeason: 'Spring and Summer',
        };
        let json = JSON.stringify(fertilizerData);
        try{
            const response = await sendMessageToDeepSeek(message);
             json = response.replace(/^\s*```json\s*/, '').replace(/\s*```\s*$/, '')
            console.log('Fertilizer generation response:', json);
        } catch (error) {
            console.error('Error communicating with DeepSeek:', error);
        }

        return NextResponse.json(json, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to generate fertilizer data' },
            { status: 500 }
        );
    }
}