import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { AuthContext } from "@/context/auth-context";
import { toast, ToastContainer } from "react-toastify";
import { Button } from "@/components/ui/button";
import { updateCourseByIdService } from "@/services";

export const VideoMeeting = () => {
  const NEXT_PUBLIC_ZEGOAPP_ID = import.meta.env.VITE_NEXT_PUBLIC_ZEGOAPP_ID;
  const NEXT_PUBLIC_ZEGO_SERVER_SECRET = import.meta.env
    .VITE_NEXT_PUBLIC_ZEGO_SERVER_SECRET;
  const params = useParams();
  const roomID = params.roomId;
  const courseId = params.courseId;
  const navigation = useNavigate();
  const containerRef = useRef(null);
  const [zp, setZp] = useState(null);
  const [isInMeeting, setIsInMeeting] = useState(false);
  const { auth } = useContext(AuthContext);
  const [startTime, setStartTime] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (auth.authenticate) {
      const urlParams = new URLSearchParams(window.location.search);
      let meetingStartTime = urlParams.get("startTime");

      if (
        !meetingStartTime ||
        meetingStartTime === "null" ||
        isNaN(Number(meetingStartTime))
      ) {
        meetingStartTime = Date.now().toString();
        window.history.pushState(
          {},
          "",
          `${window.location.pathname}?startTime=${meetingStartTime}`
        );
      }

      setStartTime(meetingStartTime);
      joinMeeting(containerRef.current);
    } else {
      console.log("Session is not authenticated. Please login before use.");
      navigation("/auth");
    }
  }, [auth.authenticate, auth.user?.userName, navigation]);

  useEffect(() => {
    return () => {
      if (zp) {
        zp.destroy();
      }
      clearTimeout(timerRef.current);
    };
  }, [zp]);

  useEffect(() => {
    if (startTime) {
      const endTime = Number(startTime) + 1 * 60 * 1000; // 1 hour
      const remainingTime = endTime - Date.now();

      if (remainingTime > 0) {
        timerRef.current = setTimeout(() => {
          endMeeting(true);
        }, remainingTime);
      } else {
        endMeeting(true);
      }
    }
  }, [startTime]);

  const joinMeeting = async (element) => {
    try {
      const appID = Number(NEXT_PUBLIC_ZEGOAPP_ID);
      const serverSecret = NEXT_PUBLIC_ZEGO_SERVER_SECRET;
      if (!appID || !serverSecret) {
        throw new Error("Please provide appId and secret key");
      }
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,
        auth?.user?.id || Date.now().toString(),
        auth?.user?.userName || "Guest"
      );

      const zegoInstance = ZegoUIKitPrebuilt.create(kitToken);
      setZp(zegoInstance);

      zegoInstance.joinRoom({
        container: element,
        onDisconnect: () => {
          toast.error("Disconnected from the meeting. Reconnecting...");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        },
        sharedLinks: [
          {
            name: "Join via this link",
            url: `${window.location.origin}/class/start-live-class/video-meeting/${roomID}?startTime=${startTime}`,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall,
        },
        showAudioVideoSettingsButton: true,
        showScreenSharingButton: true,
        showTurnOffRemoteCameraButton: auth?.user?.role === "instructor",
        showTurnOffRemoteMicrophoneButton: auth?.user?.role === "instructor",
        showRemoveUserButton: auth?.user?.role === "instructor",
        onRemoveUserFromRoom: (user) => {
          // Only trigger for students (not self)
          if (
            auth?.user?.role !== "instructor" &&
            user.userID === (auth?.user?.id || "")
          ) {
            toast.error(
              "You have been removed from the meeting by the instructor."
            );
            navigation("/home");
            setTimeout(() => {
              window.location.reload();
            }, 10);
          }
        },
        onJoinRoom: () => {
          toast.success("Meeting joined successfully");
          setIsInMeeting(true);
        },
        onLeaveRoom: async () => {
          console.log("first");
          if (auth?.user?.role === "instructor") {
            endMeeting();
            await updateCourseByIdService(courseId, {
              courseLink: null,
              isClassActive: false,
            });
          } else {
            endMeeting();
          }
        },
        onKickedOut: () => {
          toast.error(
            "You have been removed from the meeting by the instructor."
          );
          navigation("/home");
          setTimeout(() => {
            window.location.reload();
          }, 10);
        },
      });
    } catch (error) {
      console.error("Error joining the meeting:", error);
      toast.error("Failed to join the meeting");
    }
  };

  const endMeeting = async (autoEnd = false) => {
    if (zp) {
      zp.destroy();
      setZp(null);
    }
    if (auth?.user?.role === "instructor") {
      await updateCourseByIdService(courseId, {
        courseLink: null,
        isClassActive: false,
      });
    }
    if (autoEnd) {
      toast.warning("The live session ended automatically after 1 hour.");
    } else {
      toast.success("Meeting ended successfully");
    }

    clearTimeout(timerRef.current);

    setTimeout(() => {
      if (auth?.user?.role === "instructor") {
        navigation("/instructor");
      } else {
        navigation("/home");
      }
      setTimeout(() => {
        window.location.reload();
      }, 10);
    }, 10);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
        <div
          className={`flex-grow flex flex-col md:flex-row relative ${
            isInMeeting ? "h-screen" : ""
          }`}
        >
          <div
            ref={containerRef}
            className="video-container flex-grow"
            style={{ height: isInMeeting ? "100%" : "calc(100vh - 4rem)" }}
          ></div>
        </div>

        {!isInMeeting && (
          <div className="flex flex-col">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                Meeting Info
              </h2>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                Participant - {auth?.user?.userName || "You"}
              </p>
              <Button
                onClick={endMeeting}
                className="w-full bg-red-500 hover:bg-red-200 text-white hover:text-black"
              >
                End Meeting
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-200 dark:bg-gray-700">
              <div className="text-center">
                <img
                  src="/HDvideo.png"
                  alt="Feature 1"
                  width={150}
                  height={150}
                  className="mx-auto mb-2 rounded-full"
                />
                <h3 className="text-lg font-semibold mb-1 text-gray-800 dark:text-white">
                  HD Video Quality
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Experience crystal clear video calls
                </p>
              </div>
              <div className="text-center">
                <img
                  src="/screenshaare.jpeg"
                  alt="Feature 1"
                  width={150}
                  height={150}
                  className="mx-auto mb-2 rounded-full"
                />
                <h3 className="text-lg font-semibold mb-1 text-gray-800 dark:text-white">
                  Screen Sharing
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Easily share your screen with participants
                </p>
              </div>
              <div className="text-center">
                <img
                  src="/securecall.jpeg"
                  alt="Feature 1"
                  width={150}
                  height={150}
                  className="mx-auto mb-2 rounded-full"
                />
                <h3 className="text-lg font-semibold mb-1 text-gray-800 dark:text-white">
                  Secure Meetings
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Your meetings are protected and private
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default VideoMeeting;
