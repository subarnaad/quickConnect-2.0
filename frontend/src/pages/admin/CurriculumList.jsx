import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import VideoPlayer from "@/components/video-player";
import {
  editCourseService,
  fetchInstructorCourseDetailsService,
} from "@/services";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CurriculumList = () => {
  const params = useParams();
  const [data, setData] = React.useState([]);
  const [curriculumId, setCurriculumId] = React.useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getCourseDetails = async () => {
      const res = await fetchInstructorCourseDetailsService(params.id);
      setData(res.data?.curriculum);
    };
    getCourseDetails();
  }, [params.id]);

  //   const handleSwitchChange = async () => {
  //     await editCourseService(params.id, curriculumId);
  //   };

  const handleToggleChange = async (item) => {
    try {
      setCurriculumId(item._id); // Set the curriculum ID
      await editCourseService({
        courseId: params.id,
        curriculumId: item._id,
      });

      // Update the local state to reflect the change
      setData((prevData) =>
        prevData.map((curriculum) =>
          curriculum._id === item._id
            ? { ...curriculum, isActive: !curriculum.isActive }
            : curriculum
        )
      );
    } catch (error) {
      console.error("Error updating curriculum status:", error);
    }
  };

  return (
    <div>
      <Button
        className="mb-4"
        onClick={() => navigate(-1)} // Navigate to the previous page
      >
        Go Back
      </Button>
      {data?.map((item) => (
        <div className="border p-5 rounded-md" key={item._id}>
          <div className="mt-6">
            {item?.videoUrl ? (
              <div className="flex gap-3 items-center">
                <VideoPlayer
                  url={item?.videoUrl}
                  width="450px"
                  height="200px"
                />
                <div className="flex items-center gap-2">
                  <Switch
                    checked={item?.isActive}
                    onCheckedChange={() => handleToggleChange(item)}
                  />
                  {/* Display status next to the toggle */}
                  <span className="text-sm font-medium text-gray-700">
                    {item?.isActive ? "Active" : "Hidden"}
                  </span>
                </div>
              </div>
            ) : (
              "none"
            )}
            {/* Add item.title below the video */}
            <p className="mt-2 text-gray-700 font-medium">{item.title}</p>
          </div>
        </div>
      ))}
      ;
    </div>
  );
};

export default CurriculumList;
