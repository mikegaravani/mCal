import React from "react";

function Timeline({ items }) {
  return (
    <>
      <div className="relative border-l-2 border-gray-300 mx-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-start mb-4 ml-[-8.8px]">
            <div
              className={`w-4 h-12 rounded-full absolute flex-shrink-0 mt-0`}
              style={{ backgroundColor: item.color }}
            ></div>
            <div className="ml-8">
              <p className="text-sm text-start text-gray-500">{item.time}</p>
              <p className="mt-1 text-base font-medium text-gray-800">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Timeline;
