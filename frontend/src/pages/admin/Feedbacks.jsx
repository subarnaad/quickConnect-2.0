import { getAllFeedbackService } from "@/services";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Feedbacks = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getFeedbacks = async () => {
      const res = await getAllFeedbackService();
      setData(res?.data);
    };
    getFeedbacks();
  }, []);

  const curriculumData = data?.map((item) => {
    return {
      description: item.description,
      studentName: item.studentId.userName,
      studentEmail: item.studentId.userEmail,
      courseTitle: item.courseId.title,
      curriculum: item.courseId.curriculum.filter((curriculum) => {
        return curriculum._id.toString() === item.curriculumId.toString();
      }),
    };
  });

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <h1 className="text-xl font-bold mb-2">Feedbacks</h1>
      <p className="text-gray-600 mb-4">List of all feedbacks.</p>
      <div className="overflow-x-auto">
        <Table className="border border-gray-200 rounded-lg overflow-hidden">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead>SN</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead>Student Email</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Course Title</TableHead>
              <TableHead>Curriculum Title</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {curriculumData?.map((item, index) => (
              <TableRow
                key={index}
                className="border-b border-gray-200 hover:bg-gray-50 transition-all duration-200"
              >
                <TableCell className="p-3">{index + 1}</TableCell>
                <TableCell className="p-3">{item.studentName}</TableCell>
                <TableCell className="p-3">{item.studentEmail}</TableCell>
                <TableCell className="p-3">{item.description}</TableCell>
                <TableCell className="p-3">{item.courseTitle}</TableCell>
                <TableCell className="p-3">
                  {item.curriculum
                    .map((curriculumItem) => curriculumItem.title)
                    .join(", ")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Feedbacks;
