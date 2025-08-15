import React, { useState, useEffect } from 'react';
import { SparklesIcon } from './Icons';
import { useLocalization } from '../contexts/LocalizationContext';

const LoadingState: React.FC = () => {
  const { t } = useLocalization();
  const loadingMessages = t('loading.messages') as string[];
  const [message, setMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMessage(prevMessage => {
        const currentIndex = loadingMessages.indexOf(prevMessage);
        const nextIndex = (currentIndex + 1) % loadingMessages.length;
        return loadingMessages[nextIndex];
      });
    }, 2500);

    return () => clearInterval(intervalId);
  }, [loadingMessages]);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-lg shadow-lg h-full">
      <SparklesIcon className="h-16 w-16 text-amber-500 animate-pulse" />
      <h3 className="mt-4 text-xl font-semibold text-amber-900">{t('loading.title')}</h3>
      <p className="mt-2 text-gray-600 transition-opacity duration-500">{message}</p>
      <div className="mt-6 w-full bg-amber-100 rounded-full h-2.5">
        <div className="bg-amber-500 h-2.5 rounded-full animate-pulse" style={{ width: '75%' }}></div>
      </div>
    </div>
  );
};

export default LoadingState;
