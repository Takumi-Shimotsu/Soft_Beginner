import React, { useState } from 'react';
// import { Configuration, OpenAIApi } from 'openai';
import { OpenAI } from 'langchain/llms/openai';
// import { TextLoader } from 'langchain/document_loaders';
import { PromptTemplate } from 'langchain/prompts';

// 環境変数の読み込み
// import dotenv from 'dotenv';
// dotenv.config();

const App = () => {
  const [question, setQuestion] = useState(''); // 入力中の質問
  const [submittedQuestion, setSubmittedQuestion] = useState(''); // 送信済みの質問
  const [answer, setAnswer] = useState(''); // GPTからの回答
  const [loading, setLoading] = useState(false); // ローディング状態

  // LangChain の初期化
  const model = new OpenAI({
    openAIApiKey: process.env.REACT_APP_OPENAI_API_KEY,
    temperature: 0.7, // 応答の多様性を制御
    modelName: 'gpt-4o-mini', // モデルを指定
  });

  const handleSend = async () => {
    if (!question.trim()) {
      alert('質問を入力してください。');
      return;
    }

    setSubmittedQuestion(question); // 送信された質問を保存
    setLoading(true); // ローディング状態をオンに設定
    setAnswer(''); // Answer を初期化

    try {
      // LangChain を使って応答を取得
      const template = '質問: {question}\n回答:';
      const prompt = new PromptTemplate({
        inputVariables: ['question'],
        template,
      });

      const promptText = await prompt.format({ question });
      const response = await model.call(promptText);

      setAnswer(response); // 応答を保存
    } catch (error) {
      console.error('エラーが発生しました:', error);
      setAnswer('エラーが発生しました。もう一度お試しください。');
    } finally {
      setLoading(false); // ローディング状態をオフに設定
      setQuestion(''); // 入力欄をクリア
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#007bff', minHeight: '100vh', color: '#fff' }}>
      {/* アプリ名のヘッダー */}
      <header style={{ textAlign: 'center', padding: '10px', fontSize: '20px', fontWeight: 'bold' }}>
        アプリの名前
      </header>

      {/* メインコンテンツ */}
      <div style={{ maxWidth: '800px', margin: '20px auto', backgroundColor: '#fff', borderRadius: '10px', padding: '20px', color: '#333' }}>
        {/* Questionセクション */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ marginBottom: '10px' }}>Question</h2>
          <p
            style={{
              backgroundColor: '#f1f1f1',
              padding: '10px',
              borderRadius: '5px',
              minHeight: '50px',
              textAlign: 'left',
            }}
          >
            {submittedQuestion || 'ここに質問が表示されます。'}
          </p>
        </div>

        {/* Answerセクション */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ marginBottom: '10px' }}>Answer</h2>
          <p
            style={{
              backgroundColor: '#f1f1f1',
              padding: '10px',
              borderRadius: '5px',
              minHeight: '50px',
              textAlign: 'left',
            }}
          >
            {loading ? '回答を取得中...' : answer || 'ここに回答が表示されます。'}
          </p>
        </div>

        {/* 入力と送信セクション */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="ここに質問を入力してください..."
            style={{
              flex: 1,
              padding: '10px',
              fontSize: '16px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              resize: 'none',
              minHeight: '80px',
            }}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            style={{
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              fontSize: '16px',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            disabled={loading}
          >
            {loading ? '送信中...' : '送信'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
