
import React from 'react';
import { AIAnalysisResult } from '../../types';
import { useLocalization } from '../../contexts/LocalizationContext';

interface PrintableTimelineProps {
    timeline: AIAnalysisResult['timeline'];
}

export const PrintableTimeline: React.FC<PrintableTimelineProps> = ({ timeline }) => {
    const { t, language } = useLocalization();

    const formatTime = (isoString?: string) => {
        if (!isoString) return '';
        return new Date(isoString).toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit' });
    };
    
    const formatDate = (isoString?: string) => {
        if (!isoString) return '';
        return new Date(isoString).toLocaleDateString(language, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    const hasSchedule = timeline?.every(item => item.startTime) ?? false;
    let lastDate = '';

    return (
    <div className="hidden print:block">
         <h2 className="print-section-title">{t('timeline.printTitle')}</h2>
        {timeline.map((item, index) => {
            const currentDate = formatDate(item.startTime);
            const showDateHeader = hasSchedule && currentDate && currentDate !== lastDate;
            if(currentDate) lastDate = currentDate;

            return (
                <React.Fragment key={index}>
                    {showDateHeader && (
                        <h3 className="timeline-date-header">{currentDate}</h3>
                    )}
                    <div className="timeline-step-print">
                        <div className="timeline-step-header">
                             <h4 className="print-checklist-item">{item.step}</h4>
                             {item.startTime && (
                                <p className="timeline-step-time">
                                    {formatTime(item.startTime)}
                                    {item.endTime && ` - ${formatTime(item.endTime)}`}
                                </p>
                             )}
                        </div>
                        <p className="timeline-step-details">{item.details}</p>
                    </div>
                </React.Fragment>
            )
        })}
    </div>
)};