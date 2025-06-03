const CoffeeBrewingIcon = () => {
  return (
    <div className="right-[5px] h-[55px] w-[55px] bg-gradient-to-br from-blue-100 to-blue-600 rounded-full flex items-center justify-center overflow-hidden relative shadow-lg">
      {/* Coffee Cup Base/Saucer */}
      <div className="absolute bottom-[8px] w-[32px] h-[3px] bg-gradient-to-r from-amber-800 to-amber-900 rounded-full opacity-80"></div>

      {/* Coffee Cup */}
      <div className="relative z-10">
        {/* Cup Body */}
        <div className="w-[20px] h-[16px] bg-gradient-to-b from-amber-50 to-amber-100 rounded-b-[8px] border-2 border-amber-800 relative">
          {/* Coffee Liquid */}
          <div className="absolute top-[2px] left-[2px] right-[2px] h-[10px] bg-gradient-to-b from-amber-900 to-amber-950 rounded-b-[4px]"></div>

          {/* Coffee Surface Highlight */}
          <div className="absolute top-[2px] left-[2px] right-[2px] h-[2px] bg-gradient-to-r from-amber-700 to-amber-800 rounded-t-[2px] opacity-80"></div>
        </div>

        {/* Cup Handle */}
        <div className="absolute right-[-8px] top-[4px] w-[6px] h-[8px] border-2 border-amber-800 rounded-r-full bg-transparent"></div>
      </div>

      {/* Enhanced Steam */}
      <div className="absolute top-[4px] flex gap-[2px] z-20">
        {/* Steam Line 1 */}
        <div className="flex flex-col items-center">
          <div className="w-[1.5px] h-[8px] bg-gradient-to-t from-gray-300 to-transparent rounded-full animate-steam-1"></div>
        </div>

        {/* Steam Line 2 */}
        <div className="flex flex-col items-center">
          <div className="w-[1.5px] h-[10px] bg-gradient-to-t from-gray-400 to-transparent rounded-full animate-steam-2"></div>
        </div>

        {/* Steam Line 3 */}
        <div className="flex flex-col items-center">
          <div className="w-[1.5px] h-[7px] bg-gradient-to-t from-gray-300 to-transparent rounded-full animate-steam-3"></div>
        </div>
      </div>

      {/* Coffee Beans Decoration */}
      <div className="absolute top-[2px] left-[2px] w-[3px] h-[2px] bg-amber-800 rounded-full opacity-60"></div>
      <div className="absolute bottom-[2px] right-[2px] w-[2px] h-[2px] bg-amber-900 rounded-full opacity-40"></div>

      {/* Embedded keyframes */}
      <style>
        {`
          @keyframes steam-1 {
            0% {
              transform: translateY(0) translateX(0) scaleY(1);
              opacity: 0.8;
            }
            50% {
              transform: translateY(-6px) translateX(1px) scaleY(1.1);
              opacity: 0.6;
            }
            100% {
              transform: translateY(-12px) translateX(-1px) scaleY(1.3);
              opacity: 0;
            }
          }

          @keyframes steam-2 {
            0% {
              transform: translateY(0) translateX(0) scaleY(1);
              opacity: 0.9;
            }
            50% {
              transform: translateY(-8px) translateX(-1px) scaleY(1.2);
              opacity: 0.7;
            }
            100% {
              transform: translateY(-15px) translateX(1px) scaleY(1.4);
              opacity: 0;
            }
          }

          @keyframes steam-3 {
            0% {
              transform: translateY(0) translateX(0) scaleY(1);
              opacity: 0.7;
            }
            50% {
              transform: translateY(-5px) translateX(-1px) scaleY(1.1);
              opacity: 0.5;
            }
            100% {
              transform: translateY(-10px) translateX(1px) scaleY(1.2);
              opacity: 0;
            }
          }

          .animate-steam-1 {
            animation: steam-1 2s infinite ease-in-out;
          }

          .animate-steam-2 {
            animation: steam-2 2.2s infinite ease-in-out 0.3s;
          }

          .animate-steam-3 {
            animation: steam-3 1.8s infinite ease-in-out 0.6s;
          }
        `}
      </style>
    </div>
  );
};

export default CoffeeBrewingIcon;
