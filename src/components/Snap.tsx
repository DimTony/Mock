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

interface CarouselItem {
  id: number;
  title: string;
  iuc: number;
  status: string;
  startDate: string;
  duration: number; // Duration in days (e.g., 30, 60, 90)
  description: string;
  content: string;
  color: string;
}

const SnapCarousel: React.FC = () => {
  // Sample data with duration instead of endDate
  const carouselItems: CarouselItem[] = [
    {
      id: 1,
      title: "Yanga",
      iuc: 7021955561,
      status: "Active",
      startDate: "2025-07-09",
      duration: 30, // 30-day subscription
      description: "Premium subscription package",
      content: "30-day Premium Plan",
      color: "bg-blue-500",
    },
    {
      id: 2,
      title: "StarTimes",
      iuc: 7021955562,
      status: "Active",
      startDate: "2024-05-15",
      duration: 60, // 60-day subscription
      description: "Extended subscription package",
      content: "60-day Extended Plan",
      color: "bg-green-500",
    },
    {
      id: 3,
      title: "DStv",
      iuc: 7021955563,
      status: "Active",
      startDate: "2024-04-10",
      duration: 90, // 90-day subscription
      description: "Premium long-term package",
      content: "90-day Premium Plan",
      color: "bg-purple-500",
    },
    {
      id: 4,
      title: "GOtv",
      iuc: 7021955564,
      status: "Expired",
      startDate: "2024-03-01",
      duration: 30, // 30-day subscription (expired)
      description: "Basic subscription package",
      content: "30-day Basic Plan",
      color: "bg-red-500",
    },
    {
      id: 5,
      title: "Netflix",
      iuc: 7021955565,
      status: "Active",
      startDate: "2024-07-01",
      duration: 30, // 30-day subscription (fresh)
      description: "Streaming subscription",
      content: "30-day Streaming Plan",
      color: "bg-yellow-500",
    },
    {
      id: 6,
      title: "Showmax",
      iuc: 7021955566,
      status: "Active",
      startDate: "2024-06-15",
      duration: 45, // 45-day subscription
      description: "Entertainment package",
      content: "45-day Entertainment Plan",
      color: "bg-pink-500",
    },
    {
      id: 7,
      title: "Prime Video",
      iuc: 7021955567,
      status: "Active",
      startDate: "2024-05-01",
      duration: 60, // 60-day subscription
      description: "Video streaming service",
      content: "60-day Streaming Plan",
      color: "bg-indigo-500",
    },
  ];

  // Calculate progress percentage based on subscription duration
  const calculateProgress = (start: string, durationDays: number): number => {
    const now = new Date();
    const startTime = new Date(start).getTime();
    const currentTime = now.getTime();

    // Calculate days elapsed since start
    const elapsedMilliseconds = currentTime - startTime;
    const elapsedDays = elapsedMilliseconds / (1000 * 60 * 60 * 24);

    // If subscription hasn't started yet, progress is 0%
    if (elapsedDays < 0) {
      return 0;
    }

    // Calculate progress percentage
    const progress = (elapsedDays / durationDays) * 100;

    return Math.min(Math.max(progress, 0), 100);
  };

  // Get days remaining in subscription
  const getDaysRemaining = (start: string, durationDays: number): number => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + durationDays);

    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get days used in subscription
  const getDaysUsed = (start: string): number => {
    const now = new Date();
    const startTime = new Date(start).getTime();
    const currentTime = now.getTime();
    const elapsedMilliseconds = currentTime - startTime;
    const elapsedDays = elapsedMilliseconds / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.floor(elapsedDays));
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get progress bar color based on usage
  const getProgressColor = (startDate: string, duration: number): string => {
    const progress = calculateProgress(startDate, duration);
    if (progress >= 100) return "bg-red-500"; // Expired
    if (progress > 80) return "bg-orange-500"; // Almost expired
    if (progress > 60) return "bg-yellow-500"; // More than half used
    if (progress > 30) return "bg-blue-500"; // Less than half used
    return "bg-green-500"; // Fresh subscription
  };

  // Get status badge color
  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "suspended":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-4">
     
      <div
        className="flex overflow-x-auto space-x-4 pb-4 snap-x snap-mandatory scroll-smooth px-4"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#cbd5e1 #f1f5f9",
        }}
      >
        {carouselItems.map((item) => {
          const progress = calculateProgress(item.startDate, item.duration);
          const daysUsed = getDaysUsed(item.startDate);
          const daysRemaining = getDaysRemaining(item.startDate, item.duration);

          const getEndDate = (
            startDate: string,
            durationDays: number
          ): Date => {
            const start = new Date(startDate);
            const end = new Date(start);
            end.setDate(start.getDate() + durationDays);
            return end;
          };

          return (
            <div
              key={item.id}
              className="min-w-90 flex-shrink-0 snap-start rounded-xl shadow-lg bg-white border border-gray-200 flex flex-col p-6 transition-transform hover:scale-105 cursor-pointer"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">IMEI: {item.iuc}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </div>

              {/* Subscription Info */}
              <div className="mb-4 flex-grow">
                {/* <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
                  <span>Started: {formatDate(item.startDate)}</span>
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {item.duration} days
                  </span>
                </div> */}

                {/* <div className="flex justify-between items-center mb-3 text-sm text-gray-600">
                  <span>
                    Usage: {daysUsed} / {item.duration} days
                  </span>
                  <span
                    className={
                      daysRemaining > 0 ? "text-gray-600" : "text-red-600"
                    }
                  >
                    {daysRemaining > 0
                      ? `${daysRemaining} days left`
                      : `${Math.abs(daysRemaining)} days overdue`}
                  </span>
                </div> */}

                {/* Progress Section */}
                <div className="mb-4">
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ease-out ${getProgressColor(
                        item.startDate,
                        item.duration
                      )}`}
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <span
                      className={`text-xs ${
                        daysRemaining > 0 ? "text-gray-600 " : "text-red-600"
                      }`}
                    >
                      {daysRemaining > 0
                        ? `${daysRemaining} days left`
                        : `${Math.abs(daysRemaining)} days overdue`}
                    </span>
                    <span className="text-xs text-gray-700">
                      {/* {Math.round(progress)}% */}
                    Due by:  {formatDate(
                        getEndDate(item.startDate, item.duration).toISOString()
                      )}
                    </span>
                  </div>
                </div>

                {/* <p className="text-sm text-gray-600 text-center">
                  {item.description}
                </p> */}
              </div>

              {/* Action Button */}
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium">
                {progress >= 100 ? "Renew Subscription" : "Pay Now"}
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default SnapCarousel;
