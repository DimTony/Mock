import React from "react";

interface ProgressCardProps {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  className?: string;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  description,
  startDate,
  endDate,
  className = "",
}) => {
  // Calculate progress percentage based on dates
  const calculateProgress = (start: string, end: string): number => {
    const now = new Date();
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const currentTime = now.getTime();

    // If current time is before start date, progress is 0%
    if (currentTime < startTime) {
      return 0;
    }

    // If current time is after end date, progress is 100%
    if (currentTime > endTime) {
      return 100;
    }

    // Calculate progress percentage
    const totalDuration = endTime - startTime;
    const elapsed = currentTime - startTime;
    const progress = (elapsed / totalDuration) * 100;

    return Math.min(Math.max(progress, 0), 100);
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get days remaining
  const getDaysRemaining = (endDate: string): number => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const progress: number = calculateProgress(startDate, endDate);
  const daysRemaining: number = getDaysRemaining(endDate);
  const isCompleted: boolean = progress >= 100;
  const isNotStarted: boolean = progress === 0;

  // Progress bar color based on completion
  const getProgressColor = (): string => {
    if (isCompleted) return "bg-green-500";
    if (progress > 75) return "bg-yellow-500";
    if (progress > 50) return "bg-blue-500";
    if (progress > 25) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 border border-gray-200 ${className}`}
    >
      {/* Card Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        {description && <p className="text-gray-600 text-sm">{description}</p>}
      </div>

      {/* Date Range */}
      <div className="flex justify-between items-center mb-3 text-sm text-gray-500">
        <span>Start: {formatDate(startDate)}</span>
        <span>End: {formatDate(endDate)}</span>
      </div>

      {/* Progress Bar Container */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-medium text-gray-700">
            {Math.round(progress)}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ease-out ${getProgressColor()}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Status Information */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {isCompleted && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              ✓ Completed
            </span>
          )}
          {isNotStarted && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Not Started
            </span>
          )}
          {!isCompleted && !isNotStarted && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              In Progress
            </span>
          )}
        </div>

        <div className="text-sm text-gray-500">
          {daysRemaining > 0 ? (
            <span>{daysRemaining} days remaining</span>
          ) : daysRemaining === 0 ? (
            <span>Due today</span>
          ) : (
            <span className="text-red-500">
              {Math.abs(daysRemaining)} days overdue
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
  
const SnapCarousel = () => {
  // Sample data - replace with your actual content
  const carouselItems = [
    {
      id: 1,
      title: "Yanga",
      iuc: 7021955561,
      status: "Active",
      startDate: "2024-01-15",
      endDate: "2024-03-30",
      description: "First carousel item Description",
      content: "First carousel item",
      color: "bg-blue-500",
    },
    {
      id: 2,
      title: "Card 2",
      iuc: 7021955561,
      status: "Active",
      startDate: "2024-01-15",
      endDate: "2024-03-30",
      description: "First carousel item Description",
      content: "Second carousel item",
      color: "bg-green-500",
    },
    {
      id: 3,
      title: "Card 3",
      iuc: 7021955561,
      status: "Active",
      startDate: "2024-01-15",
      endDate: "2024-03-30",
      description: "First carousel item Description",
      content: "Third carousel item",
      color: "bg-purple-500",
    },
    {
      id: 4,
      title: "Card 4",
      iuc: 7021955561,
      status: "Active",
      startDate: "2024-01-15",
      endDate: "2024-03-30",
      description: "First carousel item Description",
      content: "Fourth carousel item",
      color: "bg-red-500",
    },
    {
      id: 5,
      title: "Card 5",
      iuc: 7021955561,
      status: "Active",
      startDate: "2024-01-15",
      endDate: "2024-03-30",
      description: "First carousel item Description",
      content: "Fifth carousel item",
      color: "bg-yellow-500",
    },
    {
      id: 6,
      title: "Card 6",
      iuc: 7021955561,
      status: "Active",
      startDate: "2024-01-15",
      endDate: "2024-03-30",
      description: "First carousel item Description",
      content: "Sixth carousel item",
      color: "bg-pink-500",
    },
    {
      id: 7,
      title: "Card 7",
      iuc: 7021955561,
      status: "Active",
      startDate: "2024-01-15",
      endDate: "2024-03-30",
      description: "First carousel item Description",
      content: "Seventh carousel item",
      color: "bg-indigo-500",
    },
  ];

  const calculateProgress = (start: string, end: string): number => {
    const now = new Date();
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const currentTime = now.getTime();

    // If current time is before start date, progress is 0%
    if (currentTime < startTime) {
      return 0;
    }

    // If current time is after end date, progress is 100%
    if (currentTime > endTime) {
      return 100;
    }

    // Calculate progress percentage
    const totalDuration = endTime - startTime;
    const elapsed = currentTime - startTime;
    const progress = (elapsed / totalDuration) * 100;

    return Math.min(Math.max(progress, 0), 100);
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

 const getProgressColor = (startDate: any, endDate: any): string => {
   if (calculateProgress(startDate, endDate) >= 100) return "bg-green-500";
   if (calculateProgress(startDate, endDate) > 75) return "bg-yellow-500";
   if (calculateProgress(startDate, endDate) > 50) return "bg-blue-500";
   if (calculateProgress(startDate, endDate) > 25) return "bg-orange-500";
   return "bg-red-500";
 };


  return (
    <div className="w-full max-w-6xl mx-auto py-4">
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
              min-w-90 h-64 
              flex-shrink-0 
              snap-start 
              rounded-lg 
              shadow-lg 
              flex 
              flex-col 
              py-4
              px-6
              text-white 
              font-semibold
              transition-transform
              hover:scale-105
              cursor-pointer
            `}
          >
            <h3 className="text-xl mb-2">{item.title}</h3>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Progress
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {Math.round(calculateProgress(item.startDate, item.endDate))}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ease-out ${getProgressColor(
                    item.startDate,
                    item.endDate
                  )}`}
                  style={{
                    width: `${calculateProgress(
                      item.startDate,
                      item.endDate
                    )}%`,
                  }}
                />
              </div>
            </div>
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
