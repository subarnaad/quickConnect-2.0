import FormControls from "@/components/common-form/form-controls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useContext } from "react";
import { InstructorContext } from "@/context/instructor-context";
import { courseLandingPageFormControls } from "@/config";



function CourseLanding(){

  const { courseLandingFormData, setCourseLandingFormData } = useContext(InstructorContext);

    
    return (
        <Card>
         <CardHeader>
                <CardTitle>Course Landing Page</CardTitle>
         </CardHeader>
            <CardContent>
              <FormControls
                formControls={courseLandingPageFormControls}
                formData={courseLandingFormData}
                setFormData={setCourseLandingFormData}
              />

            </CardContent>
          
        </Card>

            
    )

}

export default CourseLanding;