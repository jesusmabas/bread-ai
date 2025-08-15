
import React, { useState } from 'react';
import { AIAnalysisResult } from '../../types';
import { useLocalization } from '../../contexts/LocalizationContext';

type TimelineStatus = 'pending' | 'active' | 'complete';
interface TimelineItemState {
    status: TimelineStatus;
}
type TimelineState = Record<number, TimelineItemState>;

interface LiveTimelineProps {
    timeline: AIAnalysisResult['timeline'];
}

export const LiveTimeline: React.FC<LiveTimelineProps> = ({ timeline }) => {
    const { t } = useLocalization();
    const [state, setState] = useState<TimelineState>(() => {
        const initialState: TimelineState = {};
        timeline.forEach((_, index) => {
            initialState[index] = { status: 'pending' };
        });
        return initialState;
    });

    const setStatus = (index: number, status: TimelineStatus) => {
        setState(prev => ({
            ...prev,
            [index]: { ...prev[index], status }
        }));
    };

    return (
        <div className="no-print">
            <h3 className="text-xl font-semibold text-amber-900 mb-3">{t('timeline.liveTitle')}</h3>
            <div className="space-y-3">
                {timeline.map((item, index) => {
                    const status = state[index]?.status || 'pending';
                    const isComplete = status === 'complete';
                    const isActive = status === 'active';

                    return (
                        <div key={index} className={`p-4 rounded-lg border-l-4 transition-all duration-300 ${isComplete ? 'bg-green-50 border-green-500' : isActive ? 'bg-amber-50 border-amber-500' : 'bg-white border-gray-200 shadow-sm'}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className={`font-semibold ${isComplete ? 'text-green-800' : 'text-gray-800'}`}>{item.step}</h4>
                                    <p className={`text-sm mt-1 ${isComplete ? 'text-green-700' : 'text-gray-600'}`}>{item.details}</p>
                                </div>
                                <div className="flex-shrink-0 ml-4">
                                    {isComplete ? (
                                        <span className="text-xs font-bold text-green-600 bg-green-200 px-2 py-1 rounded-full">{t('timeline.status.done')}</span>
                                    ) : isActive ? (
                                        <button onClick={() => setStatus(index, 'complete')} className="text-xs font-semibold text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded-full">{t('timeline.status.markComplete')}</button>
                                    ) : (
                                        <button onClick={() => setStatus(index, 'active')} className="text-xs font-semibold text-white bg-amber-500 hover:bg-amber-600 px-3 py-1 rounded-full">{t('timeline.status.start')}</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
