import React from 'react';

interface WeatherIconProps {
  condition: string;
}

const Sunny = () => (
    <svg viewBox="0 0 64 64" className="w-full h-full">
        <g strokeLinecap="round" strokeWidth="4" fill="none" stroke="orange">
            <g transform="translate(32,32)">
                <circle r="9" />
                <g className="animate-spin-slow">
                    <path d="M0 12V18" />
                    <path d="M0 -12V-18" />
                    <path d="M12 0H18" />
                    <path d="M-12 0H-18" />
                    <path d="M9 9l4 4" />
                    <path d="M-9 -9l-4 -4" />
                    <path d="M9 -9l4 -4" />
                    <path d="M-9 9l-4 4" />
                </g>
            </g>
        </g>
    </svg>
);


const Cloudy = () => (
    <svg viewBox="0 0 64 64" className="w-full h-full">
        <g strokeLinecap="round" strokeWidth="2" fill="none" stroke="white">
            <path d="M47.5,50h-35c-4.4,0-8-3.6-8-8s3.6-8,8-8h35c4.4,0,8,3.6,8,8S51.9,50,47.5,50z" className="opacity-70 animate-float" />
            <path d="M26.5,34h-1c-4.4,0-8-3.6-8-8s3.6-8,8-8h1c4.4,0,8,3.6,8,8S30.9,34,26.5,34z" className="opacity-90 animate-float-delay" />
        </g>
        <style>
        {`
            @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-3px); }
            }
            .animate-float { animation: float 6s ease-in-out infinite; }
            .animate-float-delay { animation: float 6s ease-in-out infinite 1s; }
        `}
        </style>
    </svg>
);

const Rainy = () => (
    <svg viewBox="0 0 64 64" className="w-full h-full">
        <g strokeLinecap="round" strokeWidth="2" fill="none" stroke="white">
            <path d="M47.5,50h-35c-4.4,0-8-3.6-8-8s3.6-8,8-8h35c4.4,0,8,3.6,8,8S51.9,50,47.5,50z" className="opacity-70" />
            <path d="M26.5,34h-1c-4.4,0-8-3.6-8-8s3.6-8,8-8h1c4.4,0,8,3.6,8,8S30.9,34,26.5,34z" />
        </g>
        <g strokeLinecap="round" strokeWidth="2" fill="none" stroke="lightblue">
            <path d="M24,52v4" className="animate-rain1" />
            <path d="M32,52v4" className="animate-rain2" />
            <path d="M40,52v4" className="animate-rain3" />
        </g>
        <style>
        {`
            @keyframes rain {
                0% { transform: translateY(0); opacity: 1; }
                100% { transform: translateY(10px); opacity: 0; }
            }
            .animate-rain1 { animation: rain 1.5s linear infinite; animation-delay: 0s; }
            .animate-rain2 { animation: rain 1.5s linear infinite; animation-delay: 0.5s; }
            .animate-rain3 { animation: rain 1.5s linear infinite; animation-delay: 1s; }
        `}
        </style>
    </svg>
);

const Snowy = () => (
    <svg viewBox="0 0 64 64" className="w-full h-full">
        <g strokeLinecap="round" strokeWidth="3" fill="none" stroke="white" className="animate-spin-slow">
            <path d="M32 15v34" />
            <path d="M15 32h34" />
            <path d="M20.2 20.2l23.6 23.6" />
            <path d="M20.2 43.8l23.6-23.6" />
        </g>
    </svg>
);

const Misty = () => (
    <svg viewBox="0 0 64 64" className="w-full h-full">
        <g strokeLinecap="round" strokeWidth="3" fill="none" stroke="white" className="opacity-80">
            <path d="M15 25h34" className="animate-mist1" />
            <path d="M12 35h40" className="animate-mist2" />
            <path d="M18 45h28" className="animate-mist3" />
        </g>
        <style>
        {`
            @keyframes mist-move {
                0%, 100% { transform: translateX(-5px); }
                50% { transform: translateX(5px); }
            }
            .animate-mist1 { animation: mist-move 6s ease-in-out infinite; }
            .animate-mist2 { animation: mist-move 7s ease-in-out infinite 1s; }
            .animate-mist3 { animation: mist-move 8s ease-in-out infinite 0.5s; }
        `}
        </style>
    </svg>
);


const DefaultIcon = () => (
    <svg viewBox="0 0 64 64" className="w-full h-full" stroke="white" strokeWidth="2" fill="none">
        <circle cx="32" cy="32" r="16" />
        <line x1="32" y1="10" x2="32" y2="16" />
        <line x1="32" y1="48" x2="32" y2="54" />
        <line x1="54" y1="32" x2="48" y2="32" />
        <line x1="10" y1="32" x2="16" y2="32" />
    </svg>
);


export const WeatherIcon: React.FC<WeatherIconProps> = ({ condition }) => {
  switch (condition.toLowerCase()) {
    case 'clear':
      return <Sunny />;
    case 'clouds':
      return <Cloudy />;
    case 'rain':
    case 'drizzle':
    case 'thunderstorm':
      return <Rainy />;
    case 'snow':
      return <Snowy />;
    case 'mist':
    case 'fog':
    case 'haze':
      return <Misty />;
    default:
      return <DefaultIcon />;
  }
};
