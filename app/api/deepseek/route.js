import { sendMessageToDeepSeek } from '../../../lib/deepseek';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { message } = await request.json();
    console.log("Received message to DeepSeek:", message.slice(0, 10)); // Log first 100 characters
    
    if (!message) {
      return NextResponse.json(
        { error: 'Mensagem é obrigatória' },
        { status: 400 }
      );
    }

    const response = await sendMessageToDeepSeek(message);
    return NextResponse.json({ response });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}