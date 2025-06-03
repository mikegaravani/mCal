const CouchIcon = () => {
  return (
    <div className="right-[5px] h-[55px] w-[55px] bg-gradient-to-br from-green-200 to-green-500 rounded-xl flex items-center justify-center overflow-hidden relative shadow-lg">
      {/* Couch Base/Frame */}
      <div className="relative w-[44px] h-[32px] flex flex-col items-center justify-end">
        {/* Couch Back */}
        <div className="absolute bottom-[12px] w-[40px] h-[16px] bg-gradient-to-b from-amber-700 to-amber-800 rounded-t-[8px] border-t-2 border-l-2 border-r-2 border-amber-900"></div>

        {/* Couch Seat */}
        <div className="absolute bottom-[4px] w-[42px] h-[12px] bg-gradient-to-b from-amber-600 to-amber-700 rounded-[4px] border-2 border-amber-900 animate-cushion-settle"></div>

        {/* Left Armrest */}
        <div className="absolute left-[0px] bottom-[4px] w-[8px] h-[20px] bg-gradient-to-r from-amber-800 to-amber-700 rounded-l-[6px] border-2 border-amber-900"></div>

        {/* Right Armrest */}
        <div className="absolute right-[0px] bottom-[4px] w-[8px] h-[20px] bg-gradient-to-l from-amber-800 to-amber-700 rounded-r-[6px] border-2 border-amber-900"></div>

        {/* Decorative Pillows */}
        <div className="absolute left-[10px] bottom-[16px] w-[6px] h-[6px] bg-gradient-to-br from-red-400 to-red-600 rounded-[2px] animate-pillow-float border border-red-700"></div>
        <div className="absolute right-[10px] bottom-[16px] w-[6px] h-[6px] bg-gradient-to-br from-blue-400 to-blue-600 rounded-[2px] animate-pillow-float-delayed border border-blue-700"></div>

        {/* Couch Legs */}
        <div className="absolute bottom-[0px] left-[6px] w-[2px] h-[4px] bg-gradient-to-b from-amber-900 to-amber-950 rounded-b-sm"></div>
        <div className="absolute bottom-[0px] right-[6px] w-[2px] h-[4px] bg-gradient-to-b from-amber-900 to-amber-950 rounded-b-sm"></div>
        <div className="absolute bottom-[0px] left-[16px] w-[2px] h-[4px] bg-gradient-to-b from-amber-900 to-amber-950 rounded-b-sm"></div>
        <div className="absolute bottom-[0px] right-[16px] w-[2px] h-[4px] bg-gradient-to-b from-amber-900 to-amber-950 rounded-b-sm"></div>

        {/* Comfort Highlights */}
        <div className="absolute bottom-[8px] left-[12px] w-[18px] h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-40 rounded-full"></div>
        <div className="absolute bottom-[20px] left-[8px] w-[26px] h-[1px] bg-gradient-to-r from-transparent via-amber-300 to-transparent opacity-30 rounded-full"></div>
      </div>

      {/* Cozy Comfort Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[8px] left-[12px] w-[2px] h-[2px] bg-orange-300 rounded-full animate-comfort-1 opacity-60"></div>
        <div className="absolute top-[15px] right-[15px] w-[1.5px] h-[1.5px] bg-yellow-300 rounded-full animate-comfort-2 opacity-70"></div>
        <div className="absolute top-[20px] left-[20px] w-[1px] h-[1px] bg-amber-300 rounded-full animate-comfort-3 opacity-50"></div>
        <div className="absolute top-[12px] right-[8px] w-[1.5px] h-[1.5px] bg-orange-400 rounded-full animate-comfort-4 opacity-80"></div>
        <div className="absolute top-[25px] left-[8px] w-[1px] h-[1px] bg-yellow-400 rounded-full animate-comfort-5 opacity-60"></div>
      </div>

      {/* Cozy Glow Effect */}
      <div className="absolute inset-0 bg-gradient-radial from-orange-200/20 via-transparent to-transparent animate-cozy-glow"></div>

      {/* Embedded keyframes */}
      <style>
        {`
          @keyframes cushion-settle {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(0.5px);
            }
          }

          @keyframes pillow-float {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
            }
            50% {
              transform: translateY(-1px) rotate(1deg);
            }
          }

          @keyframes comfort-float {
            0% {
              transform: translateY(0) scale(1);
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
            100% {
              transform: translateY(-12px) scale(0.8);
              opacity: 0;
            }
          }

          @keyframes cozy-glow {
            0%, 100% {
              opacity: 0.3;
            }
            50% {
              opacity: 0.6;
            }
          }

          .animate-cushion-settle {
            animation: cushion-settle 4s infinite ease-in-out;
          }

          .animate-pillow-float {
            animation: pillow-float 3s infinite ease-in-out;
          }

          .animate-pillow-float-delayed {
            animation: pillow-float 3s infinite ease-in-out 1.5s;
          }

          .animate-comfort-1 {
            animation: comfort-float 3s infinite ease-in-out;
          }

          .animate-comfort-2 {
            animation: comfort-float 3.5s infinite ease-in-out 0.7s;
          }

          .animate-comfort-3 {
            animation: comfort-float 2.8s infinite ease-in-out 1.4s;
          }

          .animate-comfort-4 {
            animation: comfort-float 3.2s infinite ease-in-out 2.1s;
          }

          .animate-comfort-5 {
            animation: comfort-float 2.5s infinite ease-in-out 2.8s;
          }

          .animate-cozy-glow {
            animation: cozy-glow 5s infinite ease-in-out;
          }
        `}
      </style>
    </div>
  );
};

export default CouchIcon;
