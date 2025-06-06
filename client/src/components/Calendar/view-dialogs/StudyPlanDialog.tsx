import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trash2, Timer, Calendar, ArrowRight, BadgeCheck } from "lucide-react";
import { StudyPlan } from "../types/calendarType";
import { updateStudyPlan, deleteStudyPlan } from "@/api/calendar";

import { useNavigate } from "react-router-dom";
import { usePomodoroStore } from "@/store/usePomodoroStore";

type StudyPlanDialogProps = {
  studyPlan: StudyPlan | null;
  onClose: () => void;
  getTypeColor: (t: "study-plan") => { bg: string; color: string };
  onDeleteSuccess: (id: string) => void;
  onUpdateStudyPlan: (id: string, fields: Partial<StudyPlan>) => void;
};

const StudyPlanDialog: React.FC<StudyPlanDialogProps> = ({
  studyPlan,
  onClose,
  getTypeColor,
  onDeleteSuccess,
  onUpdateStudyPlan,
}) => {
  const navigate = useNavigate();

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  if (!studyPlan) return null;
  const typeColor = getTypeColor(studyPlan.type);

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatMinutes = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours} hr ${remainingMinutes} min`
      : `${hours} hr`;
  };

  const handleDeleteStudyPlan = async () => {
    if (!studyPlan) return;

    try {
      await deleteStudyPlan(studyPlan.id);
      onDeleteSuccess(studyPlan.id);
      setIsDeleteConfirmOpen(false);
      onClose();
    } catch (err) {
      console.error("Failed to delete study plan", err);
    }
  };

  const handleStartSession = async () => {
    try {
      await updateStudyPlan(studyPlan.id, { isCompleted: true });
      onUpdateStudyPlan(studyPlan.id, { isCompleted: true });

      usePomodoroStore.getState().setStudyPlanSession({
        focusTime: studyPlan.focusTime,
        breakTime: studyPlan.breakTime,
        cycles: studyPlan.cycles,
      });

      navigate("/pomodoro");
      onClose();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const clearTextSelection = () => {
    if (window.getSelection) {
      const selection = window.getSelection();
      if (selection?.empty) {
        selection.empty();
      } else if (selection?.removeAllRanges) {
        selection.removeAllRanges();
      }
    }
  };

  const handleClose = () => {
    clearTextSelection();
    onClose();
  };

  return (
    <>
      <Dialog
        open={!!studyPlan}
        onOpenChange={(open) => {
          if (!open) handleClose();
        }}
      >
        <DialogContent className="z-[9997] sm:max-w-[550px] max-h-[80vh] p-0 overflow-hidden rounded-lg">
          <div className="h-2" style={{ backgroundColor: typeColor.bg }} />

          <div className="p-6 overflow-y-auto max-h-[calc(80vh-0.5rem)]">
            <DialogHeader className="mb-4">
              <div className="flex flex-col gap-4">
                <div className="space-y-1">
                  <Badge className={`${typeColor.bg} text-white mb-2`}>
                    Study Plan
                  </Badge>
                  <DialogTitle className="text-2xl font-bold">
                    {studyPlan.title}
                  </DialogTitle>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium">{formatDate(studyPlan.date)}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  <div>
                    <p className="text-sm text-gray-600">Focus Time</p>
                    <p className="font-medium">
                      {formatMinutes(studyPlan.focusTime)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  <div>
                    <p className="text-sm text-gray-600">Break Time</p>
                    <p className="font-medium">
                      {formatMinutes(studyPlan.breakTime)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ArrowRight className="h-5 w-5" />
                  <div>
                    <p className="text-sm text-gray-600">Cycles</p>
                    <p className="font-medium">{studyPlan.cycles}</p>
                  </div>
                </div>
              </div>

              {studyPlan.dragToNextDay && !studyPlan.isCompleted && (
                <>
                  <Separator />
                  <div className="flex items-center gap-2 text-amber-600">
                    <Calendar className="h-5 w-5" />
                    <p className="font-medium">
                      Study plan will be dragged to the next day if not
                      completed
                    </p>
                  </div>
                </>
              )}

              {studyPlan.description && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Description</p>
                    <div className="p-3 bg-gray-100/50 rounded-lg">
                      <p>{studyPlan.description}</p>
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div className="flex flex-col gap-3 mb-4">
                {studyPlan.isCompleted ? (
                  <>
                    <div className="flex items-center gap-2 text-green-600 mb-4">
                      <BadgeCheck className="h-5 w-5" />
                      <p className="font-medium">
                        The study plan is already completed
                      </p>
                    </div>
                    <Separator />
                  </>
                ) : (
                  <Button
                    onClick={handleStartSession}
                    size="lg"
                    className="w-full py-6 text-lg font-medium"
                  >
                    Start Study Session
                  </Button>
                )}

                <Button
                  onClick={() => setIsDeleteConfirmOpen(true)}
                  variant="destructive"
                  size="sm"
                  className="gap-1 self-end mt-4"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="z-[99999]">
          <DialogHeader>
            <DialogTitle>Delete Study Plan</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to permanently delete this study plan?</p>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteConfirmOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteStudyPlan}>
              Yes, delete it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StudyPlanDialog;
