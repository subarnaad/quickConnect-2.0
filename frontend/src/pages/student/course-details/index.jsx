import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog,  DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import VideoPlayer from '@/components/video-player';
import { AuthContext } from '@/context/auth-context';
import { StudentContext } from '@/context/student-contex';
import { checkCoursePurchaseInfoService, createPaymentService, fetchStudentViewCourseDetailsService, initiateKhaltiPaymentService } from '@/services';
import { CheckCircle, Globe, Lock, PlayCircle } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

function StudentViewCourseDetailsPage() {
  const {
    studentViewCourseDetails,
    setStudentViewCourseDetails,
    currentCourseDetailsId,
    setCurrentCourseDetailsId,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);

  const { auth } = useContext(AuthContext);

  const [openDialog, setOpenDialog] = useState(false);

  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] = useState(null);
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
  const [approvalUrl, setApprovalUrl] = useState("");
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  async function fetchStudentViewCourseDetails() {

    //redirecting the courseprogress page if someone tries to access the course details page directly that is already bought
    const checkCoursePurchaseInfoResponse =
      await checkCoursePurchaseInfoService(
        currentCourseDetailsId,
        auth?.user._id
      );

    if (
      checkCoursePurchaseInfoResponse?.success &&
      checkCoursePurchaseInfoResponse?.data
    ) {
      navigate(`/course-progress/${currentCourseDetailsId}`);
      return;
    }
    const response = await fetchStudentViewCourseDetailsService(currentCourseDetailsId);
    if (response?.success) {
      setStudentViewCourseDetails(response?.data);
      setLoadingState(false);
    } else {
      setStudentViewCourseDetails(null);
      setLoadingState(false);
    }
  }

  
  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  // Free preview video
  function handleSetFreePreview(getCurrentVideoInfo) {
    if (getCurrentVideoInfo?.videoUrl) {
      console.log(getCurrentVideoInfo);
      setDisplayCurrentVideoFreePreview(getCurrentVideoInfo.videoUrl);
      setShowFreePreviewDialog(true);
    }
  }

 async function handleCreatePayment() {
  const paymentPayload = {
   userId: auth?.user?._id,
   userName: auth?.user?.userName,
   userEmail: auth?.user?.userEmail,
   orderStatus: "pending",
   paymentMethod: "paypal",
   paymentStatus: "initiated",
   orderDate: new Date(),
   paymentId: "",
   payerId: "",
   instructorId: studentViewCourseDetails?.instructorId,
   instructorName: studentViewCourseDetails?.instructorName,
   courseImage: studentViewCourseDetails?.image,
   courseTitle: studentViewCourseDetails?.title,
   courseId: studentViewCourseDetails?._id,
   coursePricing: studentViewCourseDetails?.pricing,
    
  };
  console.log(paymentPayload,"pay");
  const response = await createPaymentService(paymentPayload);

  if (response.success) {
    sessionStorage.setItem(
      "currentOrderId",
       JSON.stringify(response?.data?.orderId)
    );
     setApprovalUrl(response?.data?.approveUrl);
  }
 }

 async function   handleKhaltiPayment() {
  const formData = {
    amount: studentViewCourseDetails?.pricing,
    courseTitle: studentViewCourseDetails?.title,
    userName: auth?.user?.userName,
    userEmail: auth?.user?.userEmail,
    userId: auth?.user?._id,
    courseImage: studentViewCourseDetails?.image,
    courseId: studentViewCourseDetails?._id,
    instructorId: studentViewCourseDetails?.instructorId,
    instructorName: studentViewCourseDetails?.instructorName,
    
  };

  const response = await initiateKhaltiPaymentService(formData);

  if (response.success) {
    window.location.href = response.data.payment_url; // Redirect to Khalti payment page
  } else {
    console.error("Error initiating Khalti payment:", response.message);
  }
 }

  useEffect(() => {
    if (displayCurrentVideoFreePreview) setShowFreePreviewDialog(true);
  }, [displayCurrentVideoFreePreview]);

  useEffect(() => {
    if (currentCourseDetailsId !== null) fetchStudentViewCourseDetails();
  }, [currentCourseDetailsId]);

  useEffect(() => {
    if (id) setCurrentCourseDetailsId(id);
  }, [id]);

  // Reset course details when navigating away
  useEffect(() => {
    if (!location.pathname.includes('course/details')) {
      setStudentViewCourseDetails(null);
      setCurrentCourseDetailsId(null);
    }
  }, [location.pathname]);

  if (loadingState) return <Skeleton />;

  if (approvalUrl !== "") {
    window.location.href = approvalUrl;
  }

  // Get index of free preview video (if available)
  const getIndexOfFreePreviewUrl =
    studentViewCourseDetails !== null
      ? studentViewCourseDetails?.curriculum?.findIndex((item) => item.freePreview)
      : -1;

  return (
    <div className="mx-auto p-4">
      {/* Course Title & Metadata Section */}
      <div className="bg-gray-900 text-white p-8 rounded-t-lg">
        <h1 className="text-3xl font-bold mb-4">{studentViewCourseDetails?.title}</h1>
        <p className="text-xl mb-4">{studentViewCourseDetails?.subtitle}</p>
        <div className="flex items-center space-x-4 mt-2 text-sm">
          <span>Created By {studentViewCourseDetails?.instructorName}</span>
          <span>Created On {studentViewCourseDetails?.date?.split('T')[0]}</span>
          <span className="flex items-center">
            <Globe className="mr-1 h-4 w-4" />
            {studentViewCourseDetails?.primaryLanguage}
          </span>
          <span>
            {studentViewCourseDetails?.students.length}{' '}
            {studentViewCourseDetails?.students.length <= 1 ? 'Student' : 'Students'}
          </span>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="flex flex-col md:flex-row gap-8 mt-8">
        <main className="flex-grow">
          {/* Learning Objectives Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What you'll learn</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {studentViewCourseDetails?.objectives
                  ?.split(',')
                  .map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>

          {/* Course Description Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Course Description</CardTitle>
            </CardHeader>
            <CardContent>{studentViewCourseDetails?.description}</CardContent>
          </Card>

          {/* Course Curriculum Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Course Curriculum</CardTitle>
            </CardHeader>
            <CardContent>
              {studentViewCourseDetails?.curriculum?.map((curriculumItem, index) => (
                <li
                  key={index}
                  onClick={() => curriculumItem?.freePreview && handleSetFreePreview(curriculumItem)}
                  className={`${
                    curriculumItem?.freePreview ? 'cursor-pointer' : 'cursor-not-allowed'
                  } flex items-center mb-4`}
                >
                  {curriculumItem?.freePreview ? (
                    <PlayCircle className="mr-2 h-4 w-4" />
                  ) : (
                    <Lock className="mr-2 h-4 w-4" />
                  )}
                  <span>{curriculumItem?.title}</span>
                </li>
              ))}
            </CardContent>
          </Card>
        </main>

        {/* Sidebar Section: Free Preview Video */}
        <aside className="w-full md:w-[500px]">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <CardTitle>Free Preview</CardTitle>
              <div className="aspect-video mb-4 rounded-lg flex items-center justify-center">
                <VideoPlayer
                  url={
                    getIndexOfFreePreviewUrl !== -1
                      ? studentViewCourseDetails?.curriculum[getIndexOfFreePreviewUrl].videoUrl
                      : ''
                  }
                  width="450px"
                  height="200px"
                />
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold">${studentViewCourseDetails?.pricing}</span>
                {/*dialogue for payment option */}
                <div>
                  <Button onClick={handleDialogOpen} className="w-full">Buy Now</Button>

                  <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogContent className="w-[800px] max-w-full">
                      <DialogHeader>
                        <DialogTitle>Choose Payment Method</DialogTitle>
                      </DialogHeader>

                      {/* Payment Method Section */}
                      <div className="flex flex-col items-center mt-4">
                        <div className="flex flex-col items-center mb-4">
                          <img src="/Paypal.png" alt="Paypal" className="w-24 h-24" />
                          <Button onClick={handleCreatePayment} className="mt-2">Pay with Paypal</Button>
                        </div>
                        <div className="flex flex-col items-center">
                          <img src="/KhaltiImg.png" alt="Khalti" className="w-24 h-24" />
                          <Button
                          
                          onClick={handleKhaltiPayment}
                          className="mt-2">Pay with Khalti</Button>
                        </div>
                      </div>

                      {/* Close Button */}
                      <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                          <Button type="button" variant="secondary" onClick={handleDialogClose}>
                            Cancel
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* Dialog for Free Preview */}
      <Dialog open={showFreePreviewDialog} onOpenChange={setShowFreePreviewDialog}>
        <DialogContent className="w-[800px] max-w-full">
        <DialogHeader>
          <DialogTitle>Course Preview</DialogTitle>
        </DialogHeader>

        {/* Video Player Section */}
        <div className="aspect-video rounded-lg flex items-center justify-center">
          <VideoPlayer url={displayCurrentVideoFreePreview} width="450px" height="200px" />
        </div>

        {/* Choose Demo Video Section */}
        <div className="flex flex-col gap-2 mt-4">
          <h3 className="text-lg font-semibold">Choose Demo Video</h3>
          {studentViewCourseDetails?.curriculum
            ?.filter((item) => item.freePreview)
            .map((filteredItem, index) => (
              <p
                key={index}
                onClick={() => handleSetFreePreview(filteredItem)}
                className={`cursor-pointer text-[16px] transition-all duration-300 ${
                  displayCurrentVideoFreePreview === filteredItem.videoUrl
                    ? "text-black font-extrabold text-lg" // Selected video: Bold, Darker Text
                    : "text-gray-500 font-light hover:text-gray-700" // Other videos: Light font, hover effect
                }`}
              >
                {filteredItem?.title}
              </p>
            ))}
        </div>

        {/* Close Button */}
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

export default StudentViewCourseDetailsPage;
