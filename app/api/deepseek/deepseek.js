import { sendMessageToDeepSeek } from '../../lib/deepseek';

export default async function handlerDeepSeek(req, res) {
  console.log('Recebido pedido DeepSeek:', req.method, req.body);
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Mensagem é obrigatória' });
    }

    const response = await sendMessageToDeepSeek(message);
    console.log('Resposta do DeepSeek:', response);
    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}