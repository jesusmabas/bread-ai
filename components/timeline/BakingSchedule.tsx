
import React from 'react';
import { AIAnalysisResult } from '../../types';
import { useLocalization } from '../../contexts/LocalizationContext';

interface BakingScheduleProps {
    timeline: AIAnalysisResult['timeline'];
}

export const BakingSchedule: React.FC<BakingScheduleProps> = ({ timeline }) => {
    const { t, language } = useLocalization();

    const formatTime = (isoString?: string) => {
        if (!isoString) return '';
        return new Date(isoString).toLocaleTimeString(language, { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    };
    
    const formatDate = (isoString?: string) => {
        if (!isoString) return '';
        return new Date(isoString).toLocaleDateString(language, { month: 'long', day: 'numeric' });
    }

    let lastDate = '';

    return (
        <div className="no-print">
            <h3 className="text-xl font-semibold text-amber-900 mb-4">{t('timeline.schedule.title')}</h3>
            <div className="space-y-4">
            {timeline.map((item, index) => {
                const currentDate = formatDate(item.startTime);
                const showDateHeader = currentDate && currentDate !== lastDate;
                if(currentDate) lastDate = currentDate;

                return (
                    <React.Fragment key={index}>
                    {showDateHeader && (
                        <div className="pt-2 pb-1 border-b border-gray-200">
                            <h4 className="text-md font-bold text-gray-600">{currentDate}</h4>
                        </div>
                    )}
                    <div className="flex items-start gap-4">
                        <div className="text-right flex-shrink-0 w-24">
                            <p className="font-semibold text-sm text-amber-800">{formatTime(item.startTime)}</p>
                            {item.endTime && <p className="text-xs text-gray-500">to {formatTime(item.endTime)}</p>}
                        </div>
                        <div className="relative pl-6 flex-grow">
                            <div className="absolute top-1.5 left-0 w-3 h-3 bg-amber-500 rounded-full border-2 border-white ring-2 ring-amber-200"></div>
                            {index < timeline.length -1 && <div className="absolute top-1.5 left-[5px] h-full w-px bg-amber-200"></div>}
                            <h5 className="font-semibold text-gray-800">{item.step}</h5>
                            <p className="text-sm text-gray-600 mt-1">{item.details}</p>
                        </div>
                    </div>
                    </React.Fragment>
                );
            })}
            </div>
        </div>
    );
};
