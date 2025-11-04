
import React from 'react';

interface BackgroundProps {
  weatherCondition: string;
}

const getBackgroundColor = (condition: string) => {
  switch (condition.toLowerCase()) {
    case 'clear':
      return 'from-blue-400 to-blue-600';
    case 'clouds':
      return 'from-gray-500 to-gray-700';
    case 'rain':
    case 'drizzle':
    case 'thunderstorm':
      return 'from-gray-700 to-gray-900';
    case 'snow':
      return 'from-blue-200 to-gray-400';
    case 'mist':
    case 'fog':
    case 'haze':
      return 'from-gray-400 to-gray-500';
    default:
      return 'from-gray-800 to-gray-900';
  }
};

const RainDrop: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
    <div className="absolute top-[-20px] w-0.5 h-5 bg-gradient-to-b from-transparent to-blue-300" style={style}></div>
);

const Rain: React.FC = () => {
    const drops = Array.from({ length: 50 }).map((_, i) => {
        const style = {
            left: `${Math.random() * 100}%`,
            animation: `fall ${Math.random() * 0.5 + 0.5}s linear ${Math.random() * 5}s infinite`,
        };
        return <RainDrop key={i} style={style} />;
    });

    return (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <style>
                {`
                    @keyframes fall {
                        to {
                            transform: translateY(100vh);
                        }
                    }
                `}
            </style>
            {drops}
        </div>
    );
};


const Cloud: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div className="absolute bg-white/20 rounded-full blur-xl" style={style}></div>
);

const Clouds: React.FC = () => {
    const cloudData = [
        { top: '10%', left: '5%', width: '200px', height: '60px', animation: 'move-clouds 25s linear infinite reverse' },
        { top: '20%', left: '60%', width: '300px', height: '90px', animation: 'move-clouds 35s linear infinite' },
        { top: '40%', left: '80%', width: '250px', height: '75px', animation: 'move-clouds 30s linear infinite reverse' },
        { top: '65%', left: '10%', width: '350px', height: '100px', animation: 'move-clouds 40s linear infinite' },
    ];
    return (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <style>
                {`
                    @keyframes move-clouds {
                        0% { transform: translateX(-150%); }
                        100% { transform: translateX(150%); }
                    }
                `}
            </style>
            {cloudData.map((cloud, i) => <Cloud key={i} style={cloud} />)}
        </div>
    )
}

export const Background: React.FC<BackgroundProps> = ({ weatherCondition }) => {
  const bgColor = getBackgroundColor(weatherCondition);

  return (
    <div className={`fixed inset-0 -z-10 transition-all duration-1000 bg-gradient-to-b ${bgColor}`}>
      {weatherCondition.toLowerCase() === 'clear' && (
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl animate-pulse"></div>
      )}
      {(weatherCondition.toLowerCase() === 'rain' || weatherCondition.toLowerCase() === 'drizzle' || weatherCondition.toLowerCase() === 'thunderstorm') && <Rain />}
      {weatherCondition.toLowerCase() === 'clouds' && <Clouds />}
    </div>
  );
};
