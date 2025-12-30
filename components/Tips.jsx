'use client';

import { Clock, RefreshCcw, RefreshCcwDotIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Tips({ plant, handleAddNote, isAuto = true }) {
  const [conversation, setConversation] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const calculateDaysSincePlanted = (date) => {
    const planted = new Date(date)
    const today = new Date()
    const diff = today.getTime() - planted.getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24))
  }
  const daysSincePlanted = calculateDaysSincePlanted(plant.plantedDate)
  const [message, setMessage] = useState(`Dica do dia para cuidar de ${plant.species} há ${daysSincePlanted} dias desde a semeadura. Apenas uma dica sucinta e prática.`);
  

  const fetchDailyNote = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      console.log('Buscando nota para a id:', plant._id);
      const response = await fetch(`/api/plants/${plant._id}/notes?date=${today}`);
      if(response.ok){
        const data = await response.json();
        if (data) {
          console.log('Nota diária encontrada:', data);
          setConversation(data);
        } 
      } else sendMessage();
    } catch (error) {
      console.error('Erro ao buscar nota:', error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/deepseek', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      
      if (data.response) {
        const aiMessage = { id: 1,role: 'assistant', content: data.response };
        setConversation(aiMessage);
        handleAddNote(data.response);
      }
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setIsLoading(false);
      setMessage('');
    }
  };

  useEffect(() => {
    if(isAuto) fetchDailyNote();
    // sendMessage();
  }, [plant]);

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!isAuto) {
    return (
      <div className="flex justify-center">
      <button
      onClick={sendMessage}
      disabled={isLoading}
      className="p-2 hover:bg-blue-500/10 text-blue-500 rounded-lg transition-colors"
      >
      {isLoading ?  
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4 animate-spin" />
                  <span>Gerando nova dica...</span>
                </div> :
                <RefreshCcw className="w-5 h-5" />}
      </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="space-y-3">
            <div
              className="bg-card rounded-xl p-4 border border-border hover:border-primary transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4 animate-spin" />
                  <span>Gerando dica...</span>
                </div>
              ) :
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <h5 className="font-medium">{plant.species} - Dica do Dia</h5>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDate(new Date().toISOString())}
                </div>
              </div> }
              { !isLoading && conversation && <p className="text-foreground whitespace-pre-wrap">{conversation.content}</p>}
            </div>
          </div>
        </div>
      </div>
      );
}