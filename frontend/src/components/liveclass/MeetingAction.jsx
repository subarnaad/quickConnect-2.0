import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useEffect, useState } from "react";
import { v4 as uuidv4, validate as isValidUUID } from "uuid";
import { Button } from "../ui/button";
import { Copy, Link2, LinkIcon, Plus, Video } from "lucide-react";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchInstructorCourseDetailsService,
  sendClassMail,
  updateCourseByIdService,
} from "@/services";

function MeetingAction() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");
  const [generatedMeetingUrl, setGeneratedMeetingUrl] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [courseData, setCourseData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // to detect location changes

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
    const data = async () => {
      const currentClassId = location?.search.split("=")[1];
      const response = await fetchInstructorCourseDetailsService(
        currentClassId
      );
      if (response?.success) {
        setCourseData(response?.data);
      }
    };
    data();
  }, [location?.search.split("=")[1]]);
  console.log(courseData);
  const handleCreateMeetingForLater = async () => {
    const roomId = uuidv4();

    const meetingUrl = `${baseUrl}/class/start-live-class/video-meeting/${roomId}/${
      location?.search.split("=")[1]
    }`;
    await updateCourseByIdService(location?.search.split("=")[1], {
      courseLink: meetingUrl,
      isClassActive: true,
    });
    await sendClassMail({
      subject: "Live Class Invitation",
      text: "Hello students, join the live class now!",
      html: `<p>Hello students,</p><p>Join the live class now!</p> at localhost:5173${meetingUrl}`,
      to: courseData?.students.map((student) => student.studentEmail),
    });

    setGeneratedMeetingUrl(meetingUrl);
    setIsDialogOpen(true);
    toast.success("Meeting link created successfully");
  };

  const handleJoinMeeting = () => {
    if (!meetingLink) {
      toast.error("Please enter a valid link or code");
      return;
    }

    setIsLoading(true);
    let roomId = meetingLink;

    if (meetingLink.includes("http")) {
      try {
        const url = new URL(meetingLink);
        roomId = url.pathname.split("/")[4];
      } catch (error) {
        toast.error("Invalid meeting link format");
        setIsLoading(false);
        return;
      }
    }

    if (!isValidUUID(roomId)) {
      toast.error(
        "Invalid meeting ID. Please enter a valid meeting link or code."
      );
      setIsLoading(false);
      return;
    }

    toast.info("Joining meeting...");
    setTimeout(() => {
      navigate(
        `/class/start-live-class/video-meeting/${roomId}/${
          location?.search.split("=")[1]
        }`
      );
    }, 1500);
  };

  const handleStartMeeting = async () => {
    setIsLoading(true);
    const roomId = uuidv4();
    const meetingUrl = `/class/start-live-class/video-meeting/${roomId}/${
      location?.search.split("=")[1]
    }`;
    await updateCourseByIdService(location?.search.split("=")[1], {
      courseLink: meetingUrl,
      isClassActive: true,
    });
    await sendClassMail({
      subject: "Live Class Invitation",
      text: "Hello students, join the live class now!",
      html: `<p>Hello students,</p><p>Join the live class now!</p> at  localhost:5173${meetingUrl}`,
      to: courseData?.students.map((student) => student.studentEmail),
    });
    // Show the toast first
    toast.info("Joining meeting...");

    // Then navigate after a small delay to allow the toast to show up
    setTimeout(() => {
      navigate(meetingUrl);
    }, 50); // 50ms delay to let the toast show before navigating
  };

  // Show toast when the location changes to a meeting page (successful navigation)
  useEffect(() => {
    if (location.pathname.includes("/class/start-live-class/video-meeting/")) {
      toast.success("Successfully opened meeting page.");
    }
  }, [location.pathname]); // Trigger this when the pathname changes

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMeetingUrl);
    toast.info("Meeting link copied to clipboard");
  };

  useEffect(() => {
    if (!isDialogOpen) {
      setTimeout(() => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        document.body.style.pointerEvents = "";
      }, 300);
    }
  }, [isDialogOpen]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full sm:w-auto" size="lg">
              <Video className="w-5 h-5 mr-2" />
              New meeting
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleCreateMeetingForLater}>
              <Link2 className="w-4 h-4 mr-2" />
              Create a meeting for later
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleStartMeeting}>
              <Plus className="w-4 h-4 mr-2" />
              Start an instant meeting
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex w-full sm:w-auto relative">
          <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
            <LinkIcon className="w-4 h-4 text-gray-400" />
          </span>
          <Input
            placeholder="Enter a code or link"
            className="pl-8 rounded-r-none pr-10"
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
          />
          <Button
            variant="secondary"
            className="rounded-l-none"
            onClick={handleJoinMeeting}
            disabled={isLoading}
          >
            {isLoading ? "Joining..." : "Join"}
          </Button>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-sm rounded-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-3xl font-normal">
              Link For Joining
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              quickConnect is an online platform offering interactive courses,
              personalized learning, live classes, and mentorship for students
              worldwide.
            </p>
            <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <span className="text-gray-700 dark:text-gray-200 break-all">
                {generatedMeetingUrl.slice(0, 30)}...
              </span>
              <Button
                variant="ghost"
                className="hover:bg-gray-200"
                onClick={copyToClipboard}
              >
                <Copy className="w-5 h-5 text-orange-500" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default MeetingAction;
