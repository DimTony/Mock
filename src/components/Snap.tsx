import React from "react";

const SnapCarousel = () => {
  // Sample data - replace with your actual content
  const carouselItems = [
    {
      id: 1,
      title: "Card 1",
      content: "First carousel item",
      color: "bg-blue-500",
    },
    {
      id: 2,
      title: "Card 2",
      content: "Second carousel item",
      color: "bg-green-500",
    },
    {
      id: 3,
      title: "Card 3",
      content: "Third carousel item",
      color: "bg-purple-500",
    },
    {
      id: 4,
      title: "Card 4",
      content: "Fourth carousel item",
      color: "bg-red-500",
    },
    {
      id: 5,
      title: "Card 5",
      content: "Fifth carousel item",
      color: "bg-yellow-500",
    },
    {
      id: 6,
      title: "Card 6",
      content: "Sixth carousel item",
      color: "bg-pink-500",
    },
    {
      id: 7,
      title: "Card 7",
      content: "Seventh carousel item",
      color: "bg-indigo-500",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
    
      
      <div
        className="flex overflow-x-auto space-x-4 pb-4 snap-x snap-mandatory scroll-smooth"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#cbd5e1 #f1f5f9",
        }}
      >
        {carouselItems.map((item) => (
          <div
            key={item.id}
            className={`
              ${item.color} 
              min-w-80 h-64 
              flex-shrink-0 
              snap-start 
              rounded-lg 
              shadow-lg 
              flex 
              flex-col 
              justify-center 
              items-center 
              text-white 
              font-semibold
              transition-transform
              hover:scale-105
              cursor-pointer
            `}
          >
            <h3 className="text-xl mb-2">{item.title}</h3>
            <p className="text-center px-4">{item.content}</p>
          </div>
        ))}
      </div>

      {/* Optional: Scroll indicators */}
      {/* <div className="flex justify-center mt-4 space-x-2">
        {carouselItems.map((_, index) => (
          <div
            key={index}
            className="w-2 h-2 rounded-full bg-gray-300 hover:bg-gray-500 cursor-pointer transition-colors"
            onClick={() => {
              const carousel = document.querySelector(".snap-x");
              const cardWidth = 320 + 16; // card width + gap
              if (carousel) {
                carousel.scrollTo({
                  left: index * cardWidth,
                  behavior: "smooth",
                });
              }
            }}
          />
        ))}
      </div> */}
    </div>
  );
};

export default SnapCarousel;
