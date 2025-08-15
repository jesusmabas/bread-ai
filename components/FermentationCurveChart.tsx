



import React, { useMemo } from 'react';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, ReferenceLine, ReferenceArea } from 'recharts';
import { useLocalization } from '../contexts/LocalizationContext';

interface FermentationCurveChartProps {
  bulkHours: number;
  proofHours: number;
  coldProofHours?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  const { formatNumber, t } = useLocalization();
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white/80 backdrop-blur-sm rounded-md shadow-md border border-gray-200">
        <p className="font-semibold text-sm text-gray-700">{`Time: ${formatNumber(label, {maximumFractionDigits: 1})}h`}</p>
        <p className="text-amber-700 font-medium">{`Activity: ${formatNumber(payload[0].value, {maximumFractionDigits: 0})}%`}</p>
      </div>
    );
  }
  return null;
};

const WrappedLabel = (props: any) => {
    const { viewBox, text, fill } = props;
    if (!viewBox) return null; // Avoid rendering on first pass if viewBox is not ready
    const { x } = viewBox;
    const lines = text.split('\n');
    return (
        <text x={x + 5} y={15} textAnchor="start" fill={fill} fontSize={12} fontWeight="bold">
            {lines.map((line: string, index: number) => (
                <tspan key={index} x={x + 5} dy={index > 0 ? '1.2em' : 0}>{line}</tspan>
            ))}
        </text>
    );
};


const FermentationCurveChart: React.FC<FermentationCurveChartProps> = ({ bulkHours, proofHours, coldProofHours = 0 }) => {
  const { formatNumber } = useLocalization();
  const chartData = useMemo(() => {
    const totalDuration = bulkHours + proofHours + coldProofHours;
    if (totalDuration <= 0) return [];

    const data = [];
    const step = totalDuration / 200; // More points for smoothness

    const endOfBulk = bulkHours;
    const endOfCold = bulkHours + coldProofHours;

    const activityAtBulkEnd = 70;
    const activityGainDuringCold = coldProofHours > 0 ? 15 : 0;
    const activityAtColdEnd = activityAtBulkEnd + activityGainDuringCold;

    for (let t = 0; t <= totalDuration + step; t += step) {
      if (t > totalDuration) t = totalDuration; // ensure last point is exactly at totalDuration
      
      let activity;
      
      if (t <= endOfBulk) {
        // Stage 1: Bulk Fermentation (Sigmoid curve)
        const steepness = 5 / (endOfBulk * 0.5 || 1); // Adjust steepness based on duration
        const midPoint = endOfBulk * 0.6; // Shift midpoint to have a slower start
        activity = activityAtBulkEnd / (1 + Math.exp(-steepness * (t - midPoint)));
      } else if (coldProofHours > 0 && t <= endOfCold) {
        // Stage 2: Cold Fermentation (Slow linear rise)
        const timeInCold = t - endOfBulk;
        activity = activityAtBulkEnd + (activityGainDuringCold * (timeInCold / coldProofHours));
      } else {
        // Stage 3: Final Proof (another Sigmoid curve for the remainder)
        const finalProofStartActivity = coldProofHours > 0 ? activityAtColdEnd : activityAtBulkEnd;
        const remainingRise = 100 - finalProofStartActivity;
        const finalProofStartTime = endOfCold;
        const timeInFinalProof = t - finalProofStartTime;
        
        const steepness = 5 / (proofHours * 0.5 || 1); // Adjust steepness based on duration
        const midPoint = proofHours * 0.5;
        const riseInThisStage = remainingRise / (1 + Math.exp(-steepness * (timeInFinalProof - midPoint)));
        activity = finalProofStartActivity + riseInThisStage;
      }

      data.push({ time: t, activity: Math.min(100, activity) });
      if (t === totalDuration) break;
    }

    return data;
  }, [bulkHours, proofHours, coldProofHours]);
  
  const totalDuration = bulkHours + proofHours + coldProofHours;
  
  const CustomColdAreaLabel = (props: any) => {
    const { x, y, width, value } = props;
    if (width < 80) return null; // Don't render if area is too small
    return (
        <g>
            <text x={x + width / 2} y={y + 20} fill="#1e40af" textAnchor="middle" dominantBaseline="middle" fontSize={12} fontWeight="bold">
                {value}
            </text>
        </g>
    );
  };


  return (
    <div className="h-80 w-full bg-amber-50/50 p-4 rounded-lg border border-amber-200/50">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 40, left: 30, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                <XAxis 
                    dataKey="time" 
                    type="number" 
                    domain={[0, 'dataMax']} 
                    unit="h" 
                    stroke="#a8a29e"
                    label={{ value: 'Time (hours)', position: 'insideBottom', offset: -15, fill: '#78716c' }}
                    tickFormatter={(tick) => formatNumber(tick, {maximumFractionDigits: 2})}
                />
                <YAxis 
                    unit="%"
                    stroke="#a8a29e"
                    label={{ value: 'Dough rise / activity', angle: -90, position: 'insideLeft', fill: '#78716c', style: { textAnchor: 'middle' }, dx: -25 }}
                    domain={[0, 105]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" wrapperStyle={{paddingBottom: '20px'}} />
                
                 {coldProofHours > 0 && (
                    <ReferenceArea
                        x1={bulkHours}
                        x2={bulkHours + coldProofHours}
                        y1={0}
                        y2={'100%'}
                        strokeOpacity={0.3}
                        fill="#eff6ff"
                        fillOpacity={0.6}
                        label={<CustomColdAreaLabel value="Cold fermentation" />}
                    />
                )}

                <Line type="monotone" dataKey="activity" name="Fermentation activity" stroke="#c2410c" strokeWidth={3} dot={false} />

                <ReferenceLine 
                    x={bulkHours} 
                    stroke="#d97706" 
                    strokeWidth={2} 
                    strokeDasharray="4 4" 
                    label={<WrappedLabel text={"End of\nbulk"} fill="#b45309" />} 
                />
                <ReferenceLine 
                    x={totalDuration} 
                    stroke="#16a34a" 
                    strokeWidth={2} 
                    strokeDasharray="4 4" 
                    label={<WrappedLabel text={"Ready to\nbake"} fill="#15803d" />}
                />
            </LineChart>
        </ResponsiveContainer>
    </div>
  );
};

export default FermentationCurveChart;