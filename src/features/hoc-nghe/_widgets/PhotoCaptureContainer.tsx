import { PhotoCaptureContainer as SharedPhotoCaptureContainer } from "@/features/shared";
import { HOC_NGHE_SLUG, navigationPaths } from "@/utils/navigationPaths";

export const PhotoCaptureContainer = () => {
    return (
        <SharedPhotoCaptureContainer
            courseType="hoc-nghe"
            paramKey={HOC_NGHE_SLUG}
            learnPath={navigationPaths.HOC_NGHE_LEARN}
        />
    );
};
