import PhotoCaptureContainer from "@/features/course/container/photo-capture-container";
import { HOC_NGHE_SLUG, navigationPaths } from "@/utils/navigationPaths";

const HocNgheVerifyPage = () => {
    return (
        <PhotoCaptureContainer
            courseType="hoc-nghe"
            paramKey={HOC_NGHE_SLUG}
            learnPath={navigationPaths.HOC_NGHE_LEARN}
        />
    );
};

export default HocNgheVerifyPage;
