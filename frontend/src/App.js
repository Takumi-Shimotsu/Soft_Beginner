import React, { useState } from 'react';
import dogImage from "./dog_hokkaidouken.png";
import aiImage from "./ai.png";

const App = () => {
  const [question, setQuestion] = useState(''); // 入力中の質問
  const [conversation, setConversation] = useState([]); // 会話の履歴
  const [loading, setLoading] = useState(false); // ローディング状態
  
  const handleSend = async () => {
    if (!question.trim()) {
      alert('質問を入力してください。');
      return;
    }

    const newQuestion = { type: 'question', text: question };
    const loadingMessage = { type: 'answer', text: '入力中...' }; // 仮の応答メッセージ

    // 質問と仮の応答を追加
    setConversation((prev) => [...prev, newQuestion, loadingMessage]);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/gpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error('サーバーエラーが発生しました。');
      }

      const data = await response.json();

      // "入力中..." を実際の回答で置き換え
      setConversation((prev) => [
        ...prev.slice(0, -1), // 最後の要素（仮の応答）を削除
        { type: 'answer', text: data.answer },
      ]);
    } catch (error) {
      console.error('エラーが発生しました:', error);

      // "入力中..." をエラーメッセージで置き換え
      setConversation((prev) => [
        ...prev.slice(0, -1), // 最後の要素（仮の応答）を削除
        { type: 'answer', text: 'エラーが発生しました。もう一度お試しください。' },
      ]);
    } finally {
      setLoading(false);
      setQuestion('');
    }
  };

  return (
    <div className="main-container">
      <header>Soft Beginner</header>
      {/* 会話セクション */}
      <div className="conversation-container">
        {conversation.map((item, index) => (
          <div
            key={index}
            className={item.type === 'question' ? 'question-section' : 'answer-section'}
          >
            {item.type === 'question' ? (
              <>
                <img src={dogImage} alt="北海道犬" />
                <p>{item.text}</p>
              </>
            ) : (
              <>
                <p>{item.text}</p>
                <img src={aiImage} alt="AI" />
              </>
            )}
          </div>
        ))}
      </div>

      {/* 入力と送信セクション */}
      <div className="input-container">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="ここにメッセージを入力してください..."
          disabled={loading}
        />
        <button onClick={handleSend} disabled={loading}>
          {loading ? '送信中...' : '送信'}
        </button>
      </div>
    </div>
  );
};

export default App;
