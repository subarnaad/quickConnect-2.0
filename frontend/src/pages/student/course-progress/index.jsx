import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-contex";
import {
  getCurrentCourseProgressService,
  markLectureAsViewedService,
  resetCourseProgressService,
  submitFeedbackService,
} from "@/services";
import { Check, ChevronLeft, ChevronRight, Play } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useNavigate, useParams } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea"; // Assuming you have a Textarea component

function StudentViewCourseProgressPage() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } =
    useContext(StudentContext);

  const [lockCourse, setLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
    useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const { id } = useParams();
  const [feedback, setFeedback] = useState(""); // State for feedback input

  // fetch current course progress function
  async function fetchCurrentCourseProgress() {
    const response = await getCurrentCourseProgressService(auth?.user?._id, id);
    console.log(response, "resp");

    if (response?.success) {
      if (!response?.data?.isPurchased) {
        setLockCourse(true);
      } else {
        setStudentCurrentCourseProgress({
          courseDetails: response?.data?.courseDetails,
          progress: response?.data?.progress,
        });

        // Check if the course is completed
        if (response?.data?.completed) {
          setShowCourseCompleteDialog(true);
          setShowConfetti(true);
          return; // Do not reset the lecture, just show the completion dialog
        }

        // If no progress has been made, start from the first lecture
        if (response?.data?.progress?.length === 0) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
        } else {
          console.log("logging here");
          // Find the last viewed lecture
          const lastIndexOfViewedAsTrue = response?.data?.progress.reduceRight(
            (acc, obj, index) => {
              return acc === -1 && obj.viewed ? index : acc;
            },
            -1
          );

          setCurrentLecture(
            response?.data?.courseDetails?.curriculum[
              lastIndexOfViewedAsTrue + 1
            ]
          );
        }
      }
    }
  }

  // update course progress
  async function updateCourseProgress() {
    if (currentLecture) {
      const response = await markLectureAsViewedService(
        auth?.user?._id,
        studentCurrentCourseProgress?.courseDetails?._id,
        currentLecture._id
      );

      if (response?.success) {
        fetchCurrentCourseProgress();
      }
    }
  }

  // handle rewatch course
  async function handleRewatchCourse() {
    const response = await resetCourseProgressService(
      auth?.user?._id,
      studentCurrentCourseProgress?.courseDetails?._id
    );

    if (response?.success) {
      setCurrentLecture(null);
      setShowConfetti(false);
      setShowCourseCompleteDialog(false);
      fetchCurrentCourseProgress();
    }
  }

  // handle feedback submission
  const handleFeedbackSubmit = async () => {
    if (!feedback.trim()) {
      alert("Please write something before submitting.");
      return;
    }

    try {
      // Call the feedback submission service (replace with your actual service)
      const response = await submitFeedbackService({
        description: feedback,
        courseId: studentCurrentCourseProgress?.courseDetails?._id,
        curriculumId: currentLecture?._id,
        studentId: auth?.user?._id,
      });

      if (response?.success) {
        alert("Feedback submitted successfully!");
        setFeedback(""); // Clear the feedback box after submission
      } else {
        alert("Failed to submit feedback. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("An error occurred while submitting feedback.");
    }
  };

  useEffect(() => {
    fetchCurrentCourseProgress();
  }, [id]);

  useEffect(() => {
    if (currentLecture?.progressValue === 1) updateCourseProgress();
  }, [currentLecture]);

  useEffect(() => {
    if (showConfetti) setTimeout(() => setShowConfetti(false), 15000);
  }, [showConfetti]);

  return (
    <div className="flex flex-col h-screen bg-[#1c1d1f] text-white">
      {showConfetti && <Confetti />}
      <div className="flex items-center justify-between p-4 bg-[#1c1d1f] border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate("/student-courses")}
            className="bg-white text-black hover:bg-gray-200"
            variant="ghost"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            {/* Back to My Courses Page */}Back to My Courses Page
          </Button>
          <h1 className="text-lg font-bold hidden md:block">
            {studentCurrentCourseProgress?.courseDetails?.title}
          </h1>
        </div>
        <Button onClick={() => setIsSideBarOpen(!isSideBarOpen)}>
          {isSideBarOpen ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>
      <div className="flex flex-1">
        <div className="relative w-full ">
          <VideoPlayer
            width="100%"
            height="500px"
            url={currentLecture?.videoUrl}
            onProgressUpdate={setCurrentLecture}
            progressData={currentLecture}
          />
          <div className="p-6 bg-[#1c1d1f]">
            <h2 className="text-2xl font-bold mb-2">{currentLecture?.title}</h2>
          </div>
          {/* Document Section */}
          <div className="p-6 bg-[#1c1d1f] flex items-center gap-4">
            <span className="text-white font-semibold">Document:</span>
            <span className="text-blue-300 font-medium">
              {currentLecture?.documentName}
            </span>
            {currentLecture?.documentUrl && (
              <Button
                className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold"
                onClick={() => {
                  const googleUrl = `https://docs.google.com/gview?url=${encodeURIComponent(
                    currentLecture.documentUrl
                  )}&embedded=true`;
                  window.open(googleUrl, "_blank");
                }}
              >
                View Document
              </Button>
            )}
          </div>
          {/* Feedback Form */}
          <div className="p-6 bg-[#1c1d1f]">
            <h3 className="text-lg font-bold mb-2">Feedback or Complaint</h3>
            <p className="text-sm text-gray-400 mb-4">
              If you have any feedback or complaints, please fill in the box
              below and submit.
            </p>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Write your feedback or complaint here..."
              className="w-full h-24 p-2 border border-gray-700 rounded-md bg-[#2c2d2f] text-white"
            />
            <Button
              onClick={handleFeedbackSubmit}
              className="mt-4 bg-white text-black hover:bg-gray-200"
            >
              Submit Feedback
            </Button>
          </div>
        </div>
        <div
          className={`w-[400px] bg-[#1c1d1f] border-l border-gray-700 transition-all duration-300 ${
            isSideBarOpen ? "block " : "hidden"
          }`}
        >
          <Tabs defaultValue="content" className="h-full flex flex-col">
            <TabsList className="grid bg-[#1c1d1f] w-full grid-cols-2 p-0 h-14">
              <TabsTrigger
                value="content"
                className="h-full border-white bg-slate-500 text-white hover:bg-gray-500 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:border-black font-bold"
              >
                Course Content
              </TabsTrigger>
              <TabsTrigger
                value="overview"
                className="h-full border-white bg-slate-500 text-white hover:bg-gray-500 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:border-black font-bold"
              >
                Overview
              </TabsTrigger>
            </TabsList>
            <TabsContent value="content">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-2">
                  {studentCurrentCourseProgress?.courseDetails?.curriculum.map(
                    (item) => {
                      const isViewed =
                        studentCurrentCourseProgress?.progress?.find(
                          (progressItem) => progressItem.lectureId === item._id
                        )?.viewed;

                      const isCurrent = currentLecture?._id === item._id;

                      return (
                        <div
                          key={item._id}
                          onClick={() => setCurrentLecture(item)}
                          className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                            isCurrent ? "bg-gray-900" : "hover:bg-gray-800"
                          }`}
                        >
                          <div className="flex items-center space-x-2 text-sm font-semibold">
                            {isViewed ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Play className="h-4 w-4 text-white" />
                            )}
                            <span
                              className={`transition-all ${
                                isCurrent
                                  ? "text-white-300 font-black text-xl"
                                  : "text-white text-sm"
                              }`}
                            >
                              {item?.title}
                            </span>
                          </div>
                          {isViewed && (
                            <span className="text-xs text-green-400 font-semibold">
                              Completed
                            </span>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="overview" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-4">About this course</h2>
                  <p className="text-gray-400">
                    {studentCurrentCourseProgress?.courseDetails?.description}
                  </p>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={lockCourse}>
        <DialogContent className="sm:w-[425px]">
          <DialogHeader>
            <DialogTitle>You can't view this page</DialogTitle>
            <DialogDescription>
              Please purchase this course to get access
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog open={showCourseCompleteDialog}>
        <DialogContent showOverlay={false} className="sm:w-[425px]">
          <DialogHeader>
            <DialogTitle>Congratulations!</DialogTitle>
            <DialogDescription className="flex flex-col gap-3">
              <Label>You have completed the course</Label>
              <div className="flex flex-row gap-3">
                <Button onClick={() => navigate("/student-courses")}>
                  My Courses Page
                </Button>
                <Button onClick={handleRewatchCourse}>Rewatch Course</Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseProgressPage;
