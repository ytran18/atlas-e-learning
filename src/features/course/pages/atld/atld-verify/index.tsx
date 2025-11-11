import PhotoCaptureContainer from "@/features/course/container/photo-capture-container";

const AtldVerifyPage = () => {
    return (
        <PhotoCaptureContainer
            courseType="atld"
            paramKey="atldId"
            learnPath="/atld/[atldId]/learn"
        />
    );
};

export default AtldVerifyPage;
