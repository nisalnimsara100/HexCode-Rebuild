"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, AlertTriangle, Zap, Timer, Calendar } from "lucide-react";

interface CountdownTimerProps {
  dueDate: string;
  priority: "low" | "medium" | "high" | "critical";
  className?: string;
  showProgress?: boolean;
  size?: "sm" | "md" | "lg";
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  isOverdue: boolean;
  urgencyLevel: "safe" | "warning" | "urgent" | "critical" | "overdue";
}

export function CountdownTimer({
  dueDate,
  priority,
  className = "",
  showProgress = true,
  size = "md"
}: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalMs: 0,
    isOverdue: false,
    urgencyLevel: "safe"
  });

  const calculateTimeRemaining = (): TimeRemaining => {
    const now = new Date().getTime();
    const due = new Date(dueDate).getTime();
    const diff = due - now;

    if (diff <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalMs: 0,
        isOverdue: true,
        urgencyLevel: "overdue"
      };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    let urgencyLevel: TimeRemaining["urgencyLevel"] = "safe";

    // Determine urgency based on time left and priority
    if (days === 0) {
      if (hours < 1) {
        urgencyLevel = "critical";
      } else if (hours < 4) {
        urgencyLevel = "urgent";
      } else if (hours < 12) {
        urgencyLevel = "warning";
      }
    } else if (days === 1) {
      urgencyLevel = priority === "critical" || priority === "high" ? "warning" : "safe";
    }

    return {
      days,
      hours,
      minutes,
      seconds,
      totalMs: diff,
      isOverdue: false,
      urgencyLevel
    };
  };

  useEffect(() => {
    const updateTimer = () => {
      setTimeRemaining(calculateTimeRemaining());
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [dueDate, priority]);

  const getUrgencyColors = () => {
    switch (timeRemaining.urgencyLevel) {
      case "overdue":
        return {
          background: "bg-red-900/50 border-red-500/50",
          text: "text-red-300",
          badge: "bg-red-600 text-white",
          progress: "bg-red-600",
          icon: "text-red-400",
          glow: "shadow-red-500/20"
        };
      case "critical":
        return {
          background: "bg-red-800/30 border-red-400/50",
          text: "text-red-200",
          badge: "bg-red-500 text-white",
          progress: "bg-red-500",
          icon: "text-red-300",
          glow: "shadow-red-400/20"
        };
      case "urgent":
        return {
          background: "bg-orange-800/30 border-orange-400/50",
          text: "text-orange-200",
          badge: "bg-orange-500 text-white",
          progress: "bg-orange-500",
          icon: "text-orange-300",
          glow: "shadow-orange-400/20"
        };
      case "warning":
        return {
          background: "bg-yellow-800/30 border-yellow-400/50",
          text: "text-yellow-200",
          badge: "bg-yellow-500 text-black",
          progress: "bg-yellow-500",
          icon: "text-yellow-300",
          glow: "shadow-yellow-400/20"
        };
      default:
        return {
          background: "bg-gray-800/50 border-gray-600/50",
          text: "text-gray-300",
          badge: "bg-gray-600 text-white",
          progress: "bg-gray-600",
          icon: "text-gray-400",
          glow: "shadow-gray-500/10"
        };
    }
  };

  const formatTimeDisplay = () => {
    if (timeRemaining.isOverdue) {
      const overdueDiff = Math.abs(new Date().getTime() - new Date(dueDate).getTime());
      const overdueHours = Math.floor(overdueDiff / (1000 * 60 * 60));
      const overdueDays = Math.floor(overdueHours / 24);

      if (overdueDays > 0) {
        return `${overdueDays}d ${overdueHours % 24}h overdue`;
      }
      return `${overdueHours}h overdue`;
    }

    if (timeRemaining.days > 0) {
      return `${timeRemaining.days}d ${timeRemaining.hours}h`;
    } else if (timeRemaining.hours > 0) {
      return `${timeRemaining.hours}h ${timeRemaining.minutes}m`;
    } else {
      return `${timeRemaining.minutes}m ${timeRemaining.seconds}s`;
    }
  };

  const getProgressValue = () => {
    if (timeRemaining.isOverdue) return 100;

    // Calculate progress based on urgency (more urgent = higher progress)
    const totalDueTime = new Date(dueDate).getTime() - new Date(dueDate).getTime() + (7 * 24 * 60 * 60 * 1000); // Assume 7 days total
    const elapsed = totalDueTime - timeRemaining.totalMs;
    return Math.min((elapsed / totalDueTime) * 100, 100);
  };

  const colors = getUrgencyColors();

  const sizeClasses = {
    sm: {
      container: "p-2",
      text: "text-xs",
      icon: "h-3 w-3",
      badge: "text-xs px-1.5 py-0.5"
    },
    md: {
      container: "p-3",
      text: "text-sm",
      icon: "h-4 w-4",
      badge: "text-xs px-2 py-1"
    },
    lg: {
      container: "p-4",
      text: "text-base",
      icon: "h-5 w-5",
      badge: "text-sm px-3 py-1.5"
    }
  };

  const sizeClass = sizeClasses[size];

  return (
    <div className={`
      ${colors.background} 
      ${colors.glow}
      border rounded-lg transition-all duration-300
      ${timeRemaining.urgencyLevel === 'critical' || timeRemaining.urgencyLevel === 'overdue' ? 'animate-pulse' : ''}
      ${className}
    `}>
      <div className={`${sizeClass.container} space-y-2`}>
        {/* Header with icon and status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {timeRemaining.isOverdue ? (
              <AlertTriangle className={`${sizeClass.icon} ${colors.icon} animate-bounce`} />
            ) : timeRemaining.urgencyLevel === 'critical' ? (
              <Zap className={`${sizeClass.icon} ${colors.icon}`} />
            ) : (
              <Clock className={`${sizeClass.icon} ${colors.icon}`} />
            )}
            <span className={`${sizeClass.text} font-medium ${colors.text}`}>
              {timeRemaining.isOverdue ? 'OVERDUE' : 'Time Left'}
            </span>
          </div>

          <Badge className={`${colors.badge} ${sizeClass.badge} font-semibold`}>
            {timeRemaining.urgencyLevel.toUpperCase()}
          </Badge>
        </div>

        {/* Countdown Display */}
        <div className="text-center">
          <div className={`
            ${size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-xl' : 'text-lg'} 
            font-bold font-mono ${colors.text}
            ${timeRemaining.urgencyLevel === 'critical' ? 'animate-pulse' : ''}
          `}>
            {formatTimeDisplay()}
          </div>

          {size !== 'sm' && (
            <div className={`${sizeClass.text} ${colors.text} opacity-75 mt-1`}>
              Due: {new Date(dueDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          )}
        </div>

        {/* Detailed countdown for larger sizes */}
        {size === 'lg' && !timeRemaining.isOverdue && (
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className={`${colors.text}`}>
              <div className="text-lg font-bold">{timeRemaining.days}</div>
              <div className="text-xs opacity-75">Days</div>
            </div>
            <div className={`${colors.text}`}>
              <div className="text-lg font-bold">{timeRemaining.hours}</div>
              <div className="text-xs opacity-75">Hours</div>
            </div>
            <div className={`${colors.text}`}>
              <div className="text-lg font-bold">{timeRemaining.minutes}</div>
              <div className="text-xs opacity-75">Min</div>
            </div>
            <div className={`${colors.text}`}>
              <div className="text-lg font-bold">{timeRemaining.seconds}</div>
              <div className="text-xs opacity-75">Sec</div>
            </div>
          </div>
        )}

        {/* Progress bar */}
        {showProgress && (
          <div className="space-y-1">
            <Progress
              value={getProgressValue()}
              className="h-2 bg-gray-700"
            />
            <div className="flex justify-between text-xs opacity-75">
              <span className={colors.text}>Urgency Level</span>
              <span className={colors.text}>{Math.round(getProgressValue())}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}